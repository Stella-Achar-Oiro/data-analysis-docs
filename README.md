# Data Analysis Documentation System

A secure, production-ready documentation platform built with FastAPI. Features JWT authentication, dynamic watermarking, Chart.js visualizations, and Mermaid diagrams.

---

## Overview

This project demonstrates a professional documentation system for a fictional data analysis application. All data is anonymized and intended for portfolio demonstration purposes only.

### Key Features

- **FastAPI Backend** - Modern async Python framework with automatic API documentation
- **JWT Authentication** - Secure token-based sessions with HTTPOnly cookies
- **Dynamic Watermarks** - User email and timestamp on all pages and visuals
- **Interactive Charts** - Chart.js visualizations with sample data
- **Mermaid Diagrams** - System architecture and workflow diagrams
- **Security Controls** - Disabled copy/paste, print blocking, access logging
- **Responsive Design** - Professional blue/white theme, mobile-friendly

---

## Project Structure

```
data-analysis-docs/
|-- main.py                         # FastAPI application
|-- pyproject.toml                  # Poetry configuration
|-- .env                            # Environment variables (local)
|-- .env.example                    # Example environment file
|-- .gitignore                      # Git ignore rules
|-- README.md                       # This file
|
|-- content/                        # Markdown documentation
|   |-- dashboard-overview.md
|   |-- data-import.md
|   |-- sales-analytics.md
|   |-- customer-segmentation.md
|   +-- report-generation.md
|
|-- templates/                      # Jinja2 HTML templates
|   |-- base.html                   # Base template with watermarks
|   |-- login.html                  # Login page
|   |-- index.html                  # Home page
|   |-- doc_viewer.html             # Documentation viewer
|   |-- dashboard_mockup.html       # Interactive dashboard demo
|   +-- error.html                  # Error pages
|
|-- static/
|   |-- css/
|   |   +-- styles.css              # Main stylesheet
|   |-- js/
|   |   |-- security.js             # Security features
|   |   |-- charts.js               # Chart.js configurations
|   |   +-- mermaid-init.js         # Mermaid initialization
|   +-- data/
|       +-- sample-data.json        # Anonymous sample data
|
+-- logs/
    +-- access.log                  # Access logging
```

---

## Quick Start

### Prerequisites

- Python 3.10+
- Poetry (recommended) or pip

### Installation

**Using Poetry (Recommended):**

```bash
# Navigate to project directory
cd data-analysis-docs

# Install dependencies
poetry install

# Activate virtual environment
poetry shell

# Run the application
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Using pip:**

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn python-jose python-multipart markdown jinja2 pydantic python-dotenv aiofiles

# Run the application
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Access the Application

Open your browser and navigate to:

- **Application:** http://localhost:8000
- **API Documentation:** http://localhost:8000/api/docs
- **ReDoc:** http://localhost:8000/api/redoc

---

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# JWT Configuration
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15

# Application Settings
APP_ENV=development
DEBUG=true

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

**Important:** Change `SECRET_KEY` to a secure random string in production.

---

## Features

### Authentication

- Email-based login (demo mode - any valid email works)
- JWT tokens stored in HTTPOnly cookies
- 15-minute session timeout
- Automatic logout on inactivity

### Documentation Modules

| Module | Topics |
|--------|--------|
| Analytics | Dashboard Overview, Sales Analytics, Customer Segmentation |
| Data Management | Data Import |
| Reporting | Report Generation |

### Security Features

| Feature | Implementation |
|---------|----------------|
| Watermarks | Dynamic user email + timestamp on all pages |
| Copy Protection | Right-click and Ctrl+C disabled |
| Print Blocking | Ctrl+P intercepted and logged |
| Session Control | JWT expiration, idle timeout |
| Access Logging | All page views and actions logged |

### Visualizations

- **Chart.js Charts:** Revenue trends, product performance, category distribution
- **Mermaid Diagrams:** Data flow, system architecture, workflows
- **Dashboard Mockup:** Interactive demo with KPI cards and multiple charts

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Home page (requires auth) |
| `/login` | GET | Login page |
| `/login` | POST | Process login |
| `/logout` | GET | Logout and clear session |
| `/docs/{module}/{topic}` | GET | View documentation |
| `/dashboard-demo` | GET | Interactive dashboard |
| `/api/log-print/{module}/{topic}` | POST | Log print attempts |
| `/api/sample-data` | GET | Get sample JSON data |
| `/health` | GET | Health check endpoint |

---

## Development

### Running in Development Mode

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The `--reload` flag enables auto-reload on code changes.

### Running in Production

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

For production deployment, consider:

- Using a reverse proxy (nginx)
- Enabling HTTPS
- Setting `secure=True` on cookies
- Using a production-grade secret key
- Configuring proper logging

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Backend | FastAPI (Python 3.10+) |
| Templates | Jinja2 |
| Authentication | JWT (python-jose) |
| Content | Markdown |
| Charts | Chart.js 4.4.0 |
| Diagrams | Mermaid.js 10.6.1 |
| Icons | Font Awesome 6.5.1 |
| Fonts | Inter, JetBrains Mono |

---

## Sample Data

All data in this application is fictional and anonymized:

- **Products:** Product A, B, C, D, E
- **Categories:** Electronics, Clothing, Home & Garden, Sports, Books
- **Regions:** Region A, B, C, D
- **Customers:** Customer A, B, C, etc.

No real company names, personal identifiers, or actual business data is used.

---

## Deployment to Railway

### Quick Deploy

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Push this folder to a GitHub repository
   - In Railway dashboard, click **New Project**
   - Select **Deploy from GitHub repo**
   - Choose your repository
   - Railway auto-detects Python and deploys

3. **Set Environment Variables**
   In Railway dashboard, go to **Variables** and add:
   ```
   SECRET_KEY=your-secure-random-key-here
   ```

4. **Generate Domain**
   - Go to **Settings** > **Networking**
   - Click **Generate Domain**
   - Your app will be live at `https://your-app.up.railway.app`

### Manual Deploy via CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project (from data-analysis-docs folder)
railway init

# Deploy
railway up

# Open in browser
railway open
```

### Deployment Files

| File | Purpose |
|------|---------|
| `railway.toml` | Railway configuration |
| `Procfile` | Start command |
| `requirements.txt` | Python dependencies |
| `nixpacks.toml` | Build configuration |
| `runtime.txt` | Python version |

---

## License

This project is for portfolio demonstration purposes. All rights reserved.

---

## Author

Created as a portfolio sample demonstrating:

- FastAPI application development
- JWT authentication implementation
- Secure documentation systems
- Data visualization with Chart.js
- Professional UI/UX design

---

**Version:** 1.0.0
**Last Updated:** January 2026
