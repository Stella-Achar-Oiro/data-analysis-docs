"""
Data Analysis Documentation System
A secure, watermarked documentation platform built with FastAPI.
"""

from fastapi import FastAPI, Request, HTTPException, status, Response, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from pathlib import Path
import markdown
import os
import json
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging - use stdout only in production
log_handlers = [logging.StreamHandler()]

# Only add file handler if logs directory exists
logs_dir = Path('logs')
if logs_dir.exists():
    log_handlers.append(logging.FileHandler('logs/access.log'))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=log_handlers
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Data Analysis Documentation",
    description="Secure documentation system with watermarks and session control",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-immediately")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

# Markdown converter with extensions
md = markdown.Markdown(
    extensions=[
        'tables',
        'fenced_code',
        'toc',
        'codehilite',
        'meta',
        'attr_list'
    ]
)

# Documentation modules configuration
DOCUMENTATION_MODULES = {
    "analytics": {
        "title": "Analytics",
        "icon": "chart-line",
        "topics": {
            "dashboard-overview": {
                "title": "Dashboard Overview",
                "description": "Main dashboard features and navigation",
                "file": "dashboard-overview.md"
            },
            "sales-analytics": {
                "title": "Sales Analytics",
                "description": "Revenue trends and product performance",
                "file": "sales-analytics.md"
            },
            "customer-segmentation": {
                "title": "Customer Segmentation",
                "description": "RFM analysis and customer cohorts",
                "file": "customer-segmentation.md"
            }
        }
    },
    "data": {
        "title": "Data Management",
        "icon": "database",
        "topics": {
            "data-import": {
                "title": "Data Import",
                "description": "Import workflows and data validation",
                "file": "data-import.md"
            }
        }
    },
    "reporting": {
        "title": "Reporting",
        "icon": "file-alt",
        "topics": {
            "report-generation": {
                "title": "Report Generation",
                "description": "Automated reports and custom builders",
                "file": "report-generation.md"
            }
        }
    }
}


# Pydantic Models
class LoginRequest(BaseModel):
    email: EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# JWT Token Functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return email if valid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None


def get_current_user(access_token: Optional[str] = Cookie(None)) -> Optional[str]:
    """Get current user from cookie token."""
    if not access_token:
        return None
    return verify_token(access_token)


# Utility Functions
def load_markdown_content(filename: str) -> str:
    """Load and convert markdown file to HTML."""
    content_path = Path("content") / filename
    if not content_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Documentation file not found: {filename}"
        )

    with open(content_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Reset markdown instance for fresh conversion
    md.reset()
    html_content = md.convert(content)

    return html_content


def get_timestamp() -> str:
    """Get formatted timestamp for watermarks."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def log_access(email: str, action: str, details: str = "") -> None:
    """Log user access for audit trail."""
    logger.info(f"ACCESS | User: {email} | Action: {action} | Details: {details}")


# Routes
@app.get("/", response_class=HTMLResponse)
async def home(request: Request, access_token: Optional[str] = Cookie(None)):
    """Home page - redirect to login if not authenticated."""
    user_email = get_current_user(access_token)

    if not user_email:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)

    log_access(user_email, "VIEW_HOME", "Accessed home page")

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "user_email": user_email,
            "timestamp": get_timestamp(),
            "modules": DOCUMENTATION_MODULES
        }
    )


@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request, access_token: Optional[str] = Cookie(None)):
    """Login page."""
    # If already logged in, redirect to home
    user_email = get_current_user(access_token)
    if user_email:
        return RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)

    return templates.TemplateResponse(
        "login.html",
        {"request": request}
    )


@app.post("/login")
async def login(request: Request, response: Response):
    """Process login - create JWT token."""
    form_data = await request.form()
    email = form_data.get("email")

    if not email:
        return templates.TemplateResponse(
            "login.html",
            {"request": request, "error": "Email is required"},
            status_code=status.HTTP_400_BAD_REQUEST
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email},
        expires_delta=access_token_expires
    )

    # Log the login
    log_access(email, "LOGIN", "User logged in successfully")

    # Create redirect response with cookie
    redirect_response = RedirectResponse(url="/", status_code=status.HTTP_302_FOUND)
    redirect_response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )

    return redirect_response


@app.get("/logout")
async def logout(access_token: Optional[str] = Cookie(None)):
    """Logout - clear token."""
    user_email = get_current_user(access_token)
    if user_email:
        log_access(user_email, "LOGOUT", "User logged out")

    response = RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
    response.delete_cookie(key="access_token")

    return response


@app.get("/docs/{module}/{topic}", response_class=HTMLResponse)
async def show_doc(
    request: Request,
    module: str,
    topic: str,
    access_token: Optional[str] = Cookie(None)
):
    """Display documentation with security features."""
    user_email = get_current_user(access_token)

    if not user_email:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)

    # Validate module and topic
    if module not in DOCUMENTATION_MODULES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Module not found: {module}"
        )

    if topic not in DOCUMENTATION_MODULES[module]["topics"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Topic not found: {topic}"
        )

    topic_info = DOCUMENTATION_MODULES[module]["topics"][topic]

    # Load markdown content
    html_content = load_markdown_content(topic_info["file"])

    # Log access
    log_access(user_email, "VIEW_DOC", f"Viewed {module}/{topic}")

    return templates.TemplateResponse(
        "doc_viewer.html",
        {
            "request": request,
            "user_email": user_email,
            "timestamp": get_timestamp(),
            "module": module,
            "module_title": DOCUMENTATION_MODULES[module]["title"],
            "topic": topic,
            "topic_title": topic_info["title"],
            "content": html_content,
            "modules": DOCUMENTATION_MODULES
        }
    )


@app.get("/dashboard-demo", response_class=HTMLResponse)
async def dashboard_demo(request: Request, access_token: Optional[str] = Cookie(None)):
    """Interactive dashboard mockup."""
    user_email = get_current_user(access_token)

    if not user_email:
        return RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)

    log_access(user_email, "VIEW_DASHBOARD_DEMO", "Viewed dashboard demo")

    return templates.TemplateResponse(
        "dashboard_mockup.html",
        {
            "request": request,
            "user_email": user_email,
            "timestamp": get_timestamp()
        }
    )


@app.post("/api/log-print/{module}/{topic}")
async def log_print_attempt(
    module: str,
    topic: str,
    access_token: Optional[str] = Cookie(None)
):
    """Log print attempts."""
    user_email = get_current_user(access_token)

    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    log_access(user_email, "PRINT_ATTEMPT", f"Attempted to print {module}/{topic}")

    return {"status": "logged", "message": "Print attempt has been logged"}


@app.post("/api/log-screenshot")
async def log_screenshot_attempt(access_token: Optional[str] = Cookie(None)):
    """Log screenshot attempts."""
    user_email = get_current_user(access_token)

    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    log_access(user_email, "SCREENSHOT_ATTEMPT", "Attempted to take screenshot")

    return {"status": "logged", "message": "Screenshot attempt has been logged"}


@app.get("/api/sample-data")
async def get_sample_data(access_token: Optional[str] = Cookie(None)):
    """Get anonymous sample data for charts."""
    user_email = get_current_user(access_token)

    if not user_email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    data_path = Path("static/data/sample-data.json")
    if not data_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sample data not found"
        )

    with open(data_path, "r") as f:
        data = json.load(f)

    return data


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": get_timestamp(),
        "version": "1.0.0"
    }


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    """Custom 404 page."""
    return templates.TemplateResponse(
        "error.html",
        {
            "request": request,
            "error_code": 404,
            "error_message": "Page not found"
        },
        status_code=404
    )


@app.exception_handler(500)
async def server_error_handler(request: Request, exc: HTTPException):
    """Custom 500 page."""
    return templates.TemplateResponse(
        "error.html",
        {
            "request": request,
            "error_code": 500,
            "error_message": "Internal server error"
        },
        status_code=500
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
