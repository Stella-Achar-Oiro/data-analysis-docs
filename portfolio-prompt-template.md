# AI Prompt for Creating Clean Portfolio Documents

A reusable prompt you can give to any AI to create professional portfolio documents.

---

## MASTER PROMPT

```
Create a professional technical documentation portfolio with the following specifications:

## REQUIREMENTS:

### 1. NO PERSONAL IDENTIFIERS
- Do NOT include any real names, contact information, or client names
- Use generic references like "County Health Management System" instead of actual organization names
- Replace all identifying information with placeholders like "Project A", "Healthcare System", etc.

### 2. COLOR SCHEME
- Primary color: #1a365b (dark navy blue)
- Secondary color: #2d4a73 (lighter blue)
- Background: White
- Use for headers, buttons, boxes, and gradients

### 3. DOCUMENT STRUCTURE

Create separate HTML files that convert to PDF:

**Document 1: Portfolio Cover (4 pages)**
- Title page with portfolio name
- Stats section (words published, pages documented, systems built)
- 4 project samples overview (brief descriptions only)
- Expertise sections (industries, document types, technical skills)
- Confidentiality note at bottom

**Document 2: Sample Documentation (7+ pages)**
- Complete user documentation for a healthcare ERP patient registration module
- Include:
  * 40-step workflow with CSS-based flowchart (no external libraries)
  * Field reference table (10+ fields with format, validation, examples)
  * Role-based permission matrix (3 roles, 8 permissions)
  * Error troubleshooting table (7+ common errors with solutions)
  * Data protection compliance section
  * All diagrams must be CSS-only (no Mermaid, no external CDN)

### 4. VISUAL ELEMENTS

**Use CSS to create:**
- Flowcharts (boxes with arrows using div elements)
- Permission matrices (CSS grid with checkmarks and crosses)
- Tables (proper HTML tables with alternating row colors)
- Step numbers (circular badges with numbers)
- Warning/note boxes (colored background with border)

**Example CSS Flowchart:**

.flowchart {
    background-color: #f8f9fa;
    border: 2px solid #e8f0f5;
    padding: 25px;
}

.flow-step {
    background-color: white;
    border: 2px solid #1a365b;
    padding: 12px;
    margin: 10px auto;
    text-align: center;
    max-width: 80%;
}

.flow-arrow {
    text-align: center;
    color: #1a365b;
    font-size: 20px;
}

### 5. CONTENT GUIDELINES

**Projects to showcase:**
1. Healthcare ERP - Patient Registration (12 pages, High complexity)
   - 40-step workflow, field references, role-based access, compliance
2. Business Intelligence Platform (8 pages)
   - Dashboard, data import, analytics, reporting
3. AWS Serverless Architecture (15 pages, Advanced)
   - Lambda, DynamoDB, security, cost optimization
4. Secure Documentation Platform (System deliverable)
   - Python FastAPI, watermarks, session control, security

**For each project include:**
- Project name (generic, no real client)
- Duration (e.g., "2023-2024")
- Industry and type
- Scope description
- Features documented (bullet list with 5-7 items)
- Deliverables (pages, complexity, format)

### 6. TECHNICAL SPECIFICATIONS

**HTML Structure:**

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document Title</title>
    <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Segoe UI', sans-serif; }
        /* All CSS inline in <style> tag */
    </style>
</head>
<body>
    <!-- Content here -->
</body>
</html>

**Color Usage:**
- Headers: #1a365b
- Backgrounds: #f5f8fa (light blue-gray)
- Borders: #e8f0f5 (very light blue)
- Warning boxes: #fff9e6 background, #f0ad4e border
- Error boxes: #ffe6e6 background, #dc3545 border
- Success: #28a745

**Typography:**
- Body: 13px
- H1: 26-28px
- H2: 20-24px
- H3: 17-19px
- Tables: 12px
- Line height: 1.6

### 7. SAMPLE CONTENT REQUIREMENTS

**40-Step Workflow Example:**
Step 1: Access Patient Registration
Step 2: Search for Existing Patient (Prevent Duplicates)
Step 3: Verify No Duplicates Exist
Step 4: Enter Patient Demographics (Steps 9-13: Name, DOB, Gender, ID)
Step 5: Next of Kin Information (Steps 24-26)
... continue to Step 40

**Field Reference Table Columns:**
- Field Name | Required | Format | Validation Rules | Example

**Permission Matrix:**
- Rows: Permissions (Create, Update, Delete, View, etc.)
- Columns: Roles (Registration Clerk, Nurse, Administrator)
- Cells: Checkmark or X

**Error Table Columns:**
- Error Message | Cause | Solution

### 8. OUTPUT FORMAT

Create TWO separate HTML files:
1. portfolio-cover.html - Cover and overview (4 pages)
2. healthcare-sample.html - Detailed sample documentation (7 pages)

Each file should be:
- Self-contained (all CSS inline)
- Print-ready (proper page breaks)
- A4 sized (@page rule)
- No external dependencies

### 9. THINGS TO AVOID

DO NOT include:
- Real names of people
- Actual client/company names
- Contact information (phone, email)
- Specific locations (use "County A", "Region B")
- External CDN links (Mermaid, Chart.js in static docs)
- Lorem ipsum text (use realistic content)

DO INCLUDE:
- Realistic generic examples
- Professional language
- Complete workflows
- Actual data structures
- Real-world scenarios

### 10. CONVERSION TO PDF

After creating HTML files, convert using:

wkhtmltopdf --enable-local-file-access --page-size A4 file.html file.pdf

Then combine:

pdfunite cover.pdf sample.pdf final-portfolio.pdf

## EXAMPLE OUTPUT STRUCTURE:

portfolio-cover.html (4 pages):
- Page 1: Title + Stats
- Page 2: Project Samples Overview
- Page 3: Expertise (Industries + Doc Types)
- Page 4: Technical Skills + Note

healthcare-sample.html (7 pages):
- Page 1: Overview + Workflow Diagram
- Page 2: Features Documented
- Page 3: Field Reference Table
- Page 4: Permission Matrix
- Page 5: Error Troubleshooting
- Page 6: Compliance Requirements
- Page 7: Quality Features Summary

Now create the portfolio following these specifications exactly.
```

---

## USAGE

Copy the entire prompt above and paste it into:
- ChatGPT
- Claude
- Any AI assistant

The AI will generate clean HTML files that you can convert to PDF.

---

## CUSTOMIZATION

To customize for your specific needs, modify:

1. **Colors:** Change `#1a365b` to your brand color
2. **Projects:** Replace the 4 sample projects with your actual work (keeping client names generic)
3. **Stats:** Update "25,000+ words" to your actual numbers
4. **Industries:** List your specific industries
5. **Skills:** Add your actual technical skills

---

## QUICK VARIATIONS

### For Different Industries

Replace the healthcare sample with:
- Manufacturing ERP (inventory management)
- Financial Platform (payment processing)
- E-commerce System (order fulfillment)

### For Different Lengths

For shorter portfolio (6 pages total):
- Cover: 3 pages
- Sample: 3 pages

For longer portfolio (15 pages total):
- Cover: 4 pages
- Sample 1: 5 pages (Healthcare)
- Sample 2: 6 pages (AWS Architecture)

### For Different Color Schemes

| Style | Color Code |
|-------|------------|
| Professional Blue | #1a365b |
| Tech Purple | #6a0dad |
| Corporate Gray | #4a5568 |
| Modern Green | #047857 |
| Finance Navy | #0c2340 |

---

## CSS COMPONENT LIBRARY

### Flowchart Component

```css
.flowchart {
    background-color: #f8f9fa;
    border: 2px solid #e8f0f5;
    border-radius: 8px;
    padding: 25px;
    margin: 20px 0;
}

.flow-step {
    background-color: white;
    border: 2px solid #1a365b;
    border-radius: 6px;
    padding: 12px 20px;
    margin: 10px auto;
    text-align: center;
    max-width: 80%;
    font-weight: 500;
}

.flow-step.decision {
    background-color: #fff9e6;
    border-color: #f0ad4e;
    transform: rotate(0deg);
}

.flow-arrow {
    text-align: center;
    color: #1a365b;
    font-size: 24px;
    margin: 5px 0;
}

.flow-arrow::after {
    content: "V";
    display: block;
}
```

### Table Styles

```css
.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 12px;
}

.data-table th {
    background-color: #1a365b;
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: 600;
}

.data-table td {
    padding: 10px 12px;
    border-bottom: 1px solid #e8f0f5;
}

.data-table tr:nth-child(even) {
    background-color: #f5f8fa;
}

.data-table tr:hover {
    background-color: #e8f0f5;
}
```

### Alert Boxes

```css
.alert {
    padding: 15px 20px;
    border-radius: 6px;
    margin: 15px 0;
    border-left: 4px solid;
}

.alert-warning {
    background-color: #fff9e6;
    border-color: #f0ad4e;
    color: #856404;
}

.alert-error {
    background-color: #ffe6e6;
    border-color: #dc3545;
    color: #721c24;
}

.alert-info {
    background-color: #e7f1ff;
    border-color: #007bff;
    color: #004085;
}

.alert-success {
    background-color: #d4edda;
    border-color: #28a745;
    color: #155724;
}
```

### Step Badges

```css
.step-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background-color: #1a365b;
    color: white;
    border-radius: 50%;
    font-size: 13px;
    font-weight: 600;
    margin-right: 10px;
}
```

### Permission Matrix

```css
.permission-matrix {
    width: 100%;
    border-collapse: collapse;
}

.permission-matrix th {
    background-color: #1a365b;
    color: white;
    padding: 10px;
    text-align: center;
}

.permission-matrix td {
    padding: 10px;
    text-align: center;
    border: 1px solid #e8f0f5;
}

.permission-matrix .check {
    color: #28a745;
    font-size: 18px;
}

.permission-matrix .cross {
    color: #dc3545;
    font-size: 18px;
}
```

### Page Break Control

```css
.page-break {
    page-break-after: always;
}

.no-break {
    page-break-inside: avoid;
}

.keep-together {
    page-break-inside: avoid;
    break-inside: avoid;
}
```

---

## HTML TEMPLATE STARTER

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Documentation Portfolio</title>
    <style>
        @page {
            size: A4;
            margin: 15mm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 13px;
            line-height: 1.6;
            color: #333;
        }

        h1 {
            font-size: 28px;
            color: #1a365b;
            margin-bottom: 15px;
        }

        h2 {
            font-size: 22px;
            color: #1a365b;
            margin: 25px 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e8f0f5;
        }

        h3 {
            font-size: 17px;
            color: #2d4a73;
            margin: 20px 0 10px 0;
        }

        p {
            margin-bottom: 12px;
        }

        /* Add component styles from above */

        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <!-- Page 1: Cover -->
    <section class="cover-page">
        <h1>Technical Documentation Portfolio</h1>
        <!-- Content -->
    </section>

    <div class="page-break"></div>

    <!-- Page 2: Projects -->
    <section class="projects-page">
        <h2>Project Samples</h2>
        <!-- Content -->
    </section>

    <!-- Continue with more pages -->
</body>
</html>
```

---

This prompt is battle-tested and produces professional, print-ready portfolios every time.
