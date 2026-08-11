# CA DIR eCPR XML — spec notes (extracted from official eCPR User Guide)

Source: https://www.dir.ca.gov/public-works/ecpruserguide.pdf (extracted 2026-08-11)

# eCPR XML Upload — Engineering Spec Extraction
*(Source: DIR eCPR Application User Guide, January 2016, Version 1.5)*

---

## 1. XML Structure (Verbatim Content Found)

**IMPORTANT: This document contains NO actual XML schema, element names, tag structures, or XML code samples.** The guide only references the existence of these resources but does not reproduce them:

> "Certified Payroll Records can be imported using an XML file. The CPR in XML format must strictly follow the guidelines provided in eCPR XML Guidelines."

The document points to external resources (not reproduced in this guide):
- **eCPR XML schema** (linked, downloadable — "Right-Click to Save")
- **XML schema file** (separate download)
- **eCPR XML guidelines** (detailed instructions — separate document, highlighted as key reference)
- **Sample XML file** (linked example)
- Optional Vendor Software list (compatible third-party software for generating CPR XML)

**Verbatim from System Requirements screen (page 26):**
```
System requirements:
• Create your own template using the eCPR XML schema
  ○ Use the eCPR XML schema or download the XML schema file (Right-Click to Save)
  ○ Detailed instructions are provided in the eCPR XML guidelines
  ○ View a sample XML file
OR
• Use compatible software to create the CPRs in XML (see Optional Vendor Software list below)
```

**No element names, attributes, nesting hierarchy, or code fragments are shown anywhere in this document.**

---

## 2. Required Fields Per Payroll/Employee (As Named in the System UI)

*Note: These are field labels from the equivalent online iForm, which the guide states mirrors the data loaded from XML. Field names below are as displayed to users, not confirmed XML tag names.*

### Contractor Information
- Contractor FEIN *(required to initiate)*
- License Type
- License Number
- Contractor Name
- Contractor PWCR
- Contractor Address: Street, City, State, Zip
- Insurance Number
- Contractor Email

### Project Information
- DIR Project ID *(only required search field per Release Notes 1.10)*
- Awarding Body
- Project Name
- Street, City, County, State, Zip
- Description
- Contract With *(drop-down or manual entry — critical for Payroll Number/Amendment tracking)*

### Payroll Information (header level)
- Non-Performance checkbox (statement of non-performance indicator)
- For Week Ending (date)
- Payroll Number / Amendment Number (system-generated, format: `N - N`, e.g., "3 - 0")

### Employee-Level Payroll Fields
- Name, Street, City, State, Zip, SSN
- Number of Withholding
- Work Classification
- Work Week dates (Sun–Sat, individually dated)
- Hours Worked Each Day: Straight Time, Overtime, Double Time (per day of week)
- Total Hours
- Hourly Pay Rate
- Gross Amount Earned: **This Project** / **All Work**
- Deductions, Contributions, and Payments:
  - Federal Tax, FICA, State Tax, SDI
  - Vacation/Holiday, Health/Welfare, Pension
  - Training, Fund/Admin, Dues, Travel/Subs, Savings, Other
  - **Total Deductions** *(NOTE: per Release Notes 1.10, auto-calculation was REMOVED — this is now a required manually-entered field)*
- Net Wages Paid For Week
- Check Number
- Note field (free-form, **max length 256 characters**, optional)

### Certification (Signature Block)
- Signer name ("I, [name]")
- Position in business
- Name of business/contractor (on behalf of)
- Week ending date (repeated in certification statement)
- Electronic signature ("Click to Sign")
- Date (system-stamped, e.g., "ACCEPTED 2015-08-14")

---

## 3. Validation Rules, Formats, and Error Behaviors

### Formats Explicitly Stated
- **Date format (manual entry):** `mm/dd/yy`
- **FEIN:** Must be unique; system auto-checks against database on entry
- **Note field:** Maximum length 256 characters

### Validation Behavior
- Uploaded XML is validated against the schema upon upload.
- **Success path:** "eCPR XML Validation Success" page displayed with a link to "load the xml into the eCPR form."
- **Failure path:** "eCPR XML Validation Error" page displayed with specific error detail.

**Verbatim error example shown in document (page 33):**
```
The XML file you have provided contains invalid data.
Please review the following error:
cvc-pattern-valid: Value " is not facet-valid with respect to pattern 
'[0-9]{1,2}' for type '#AnonType_numWithholdingExempemployeeeemployeespayrollInfoeCPR'.
You can either fix the problems in the XML file and upload it again.
OR
You may be able to load the xml into the OnLine eCPR form.
There you fix your issues and then submit the payroll information.
```
- This reveals one actual (partial/mangled) type name from the schema: `#AnonType_numWithholdingExempemployeeeemployeespayrollInfoeCPR`, and indicates the "Number of Withholding" field is constrained by pattern `[0-9]{1,2}` (i.e., 1–2 digit numeric).

### Form-Level Validation (applies post-load, whether from XML or manual entry)
- **Verbatim error banner (page 23):**
  > "Unable to submit payroll because one or more fields contain invalid data. Problem items are denoted by red or yellow backgrounds. Please review the data you have entered and fix and invalid items before retrying your submission."
- Required fields are highlighted in **yellow** when empty/invalid.
- Submission is blocked entirely if mandatory data is missing — the Submit button will not process.

### Project/Contractor Matching Rules
- If Contractor FEIN is **not found** in the eCPR database, all yellow-highlighted fields become mandatory and user must click **"Add New Contractor"**.
- If DIR Project ID is **not found** in eCPR database (but exists in PWC-100), user must click **"Add New Project"**.
- If DIR Project ID is **not found anywhere** (not registered in PWC-100), the system displays a message that the project must first be registered via PWC-100 (https://www.dir.ca.gov/pwc100ext/).
- The **"Contract With"** field must be correctly matched (via dropdown or manual entry) and then explicitly linked via **"Connect To Project"** button — described as a "one-time process for each project."

> **Verbatim critical note (repeated twice, pages 11 & 30):**
> "It is critical that the Agency/Contractor is entered correctly as it is used to drive the 'Payroll Number/Amendment' number for all CPR. If the Agency isn't entered correctly, the CPR will be counted as a new branch of payroll not related to the Agency."

### Non-Performance Rule
- If Non-Performance checkbox is checked, a confirmation dialog appears:
  > "Selecting this option will delete any employee payroll records you have entered. Is this what you want to do?" [Yes/Cancel]
- **Critical constraint:** "If the box is simply closed without clicking 'Yes', or 'Cancel', the submission will not be accepted."
- Employee/Payroll Information sections are not required when non-performance is checked.

### Signature/Lock Behavior
- Once signed ("Click to Sign"), **the form cannot be edited** (stated explicitly twice — pages 22 & 31).
- Submit button only appears after signing.

---

## 4. Upload Workflow Steps and Constraints

### Workflow (Verbatim Steps from "eCPR XML Validation Success" page, page 28)
```
Step 1.... Click here to load the xml into the OnLine eCPR form
Step 2.... If you are a new contractor, click the "Add New Contractor" button to create your contractor record
Step 3.... If this is a new project, click the "Add New Project" button to create the project record
Step 4.... If you have not yet associated the project with the value you have entered in the "Contract With" field, click the "Connect To Project" button
Step 5.... Sign the OnLine form by clicking the "Click to Sign" button at the bottom of the page
Step 6.... Submit the payroll information by clicking the "Submit" button that appears after signing the form
```

### General Upload Steps
1. Navigate to eCPR Home Page (https://efiling.dir.ca.gov/eCPR/pages/home.jsp)
2. Click "Browse" to select XML file
3. Click "Upload" to process the file
4. System validates the file
5. On success: click link to load XML into online form, complete Steps 2–6 above
6. On failure: either (a) fix XML file and re-upload, or (b) load XML into online form and correct problem fields interactively, then sign and submit

### Confirmation/Output
- Successful submission generates a confirmation page containing:
  - Contractor Name, Contractor Address
  - Awarding Body, Project ID, Contract With
  - Week Ending Date, Payroll Number, Amendment Number
  - Count of "employee payroll record(s) processed"
  - **Transaction ID** (system-generated integer)
  - "Print this Page" link
  - PDF icon to generate downloadable PDF of submission
- **Explicit warning:** "The information entered will not be saved or retrievable for future access" unless the PDF is generated before closing the window.

### Constraints Explicitly Stated
- **No file size limit mentioned** (not specified — see Open Questions).
- **No explicit "one project per file" rule stated**, but workflow structure (one Project Information block, one Payroll Information block per submission cycle) implies single-project-per-submission-instance. Not explicitly confirmed for XML (multiple payroll/employee records per file are supported — example shows "2 employee payroll record(s) processed" from one upload).
- **Corrections/Amendments (Section 6.1, verbatim):**
  > "Once you have submitted a payroll record you may make any corrections to the submitted form."
  > "For the XML submission you must rekey all the original employee input information with the corrected fields updated. You need only resubmit the employee payroll records which need correction."
  - This implies corrections are submitted as new XML uploads (or new iForm entries) rather than in-place edits, and only the corrected employee record(s) need resubmission, not the entire original payroll.
  - The **Amendment Number** field (visible as "Payroll Number: 3 - 0", "Amendment Number: 0" in confirmation output) appears to be the system's mechanism for tracking corrections/versions, though the document never explains how the Amendment Number increments or how a resubmission is flagged as an amendment vs. a new payroll.

### Browser/System Requirements (general, applies to whole app)
- Supported browsers: Internet Explorer 9, 10, and latest versions of Chrome, Firefox, Safari.
- No additional software required (for using the web app itself).

---

## 5. OPEN QUESTIONS (Not Specified in This Document)

| # | Gap | Likely Documented In |
|---|---|---|
| 1 | Actual XML schema (element/attribute names, namespaces, nesting, data types, cardinality) | The separate **"eCPR XML schema"** file / **"XML schema file"** download and **"eCPR XML guidelines"** document referenced but not included here — must obtain from DIR's public works XML upload page directly. |
| 2 | Full sample XML file content | The linked **"sample XML file"** on the DIR site (not reproduced in this guide). |
| 3 | Exact SSN format/masking rules in XML (full 9-digit? masked? encrypted in transit?) | Likely in eCPR XML guidelines / schema; possibly related to DIR data security/privacy policy documents not referenced here. |
| 4 | File size limits for XML upload | Not mentioned; likely a technical constraint documented in the XML guidelines or discoverable only via testing/server error responses. |
| 5 | Whether one XML file can contain multiple projects, multiple contractors, or multiple week-ending payrolls | Not explicitly stated (example only shows one contractor/project/week per upload); XML guidelines document would clarify. |
| 6 | Complete list of valid enumerations (e.g., License Type values beyond "OTHER," "CSLB"; valid state codes; Work Classification code list) | eCPR XML schema (likely enumerated types) or DIR Labor Law reference tables (e.g., prevailing wage classification lists). |
| 7 | Exact numeric/currency format constraints (decimal places, max value, negative allowed?) beyond the one partial pattern glimpsed in an error message (`[0-9]{1,2}` for Number of Withholding) | eCPR XML schema (XSD) itself — this document only leaks one fragment via an error message. |
| 8 | Full definition of "Amendment Number" incrementing logic and how a correction submission is distinguished from a new payroll in XML | Not covered; likely internal DIR business logic — may need to contact eCPR unit (eCPR@dir.ca.gov) or find in XML guidelines. |
| 9 | Authentication/session requirements for programmatic (non-browser) XML submission, or whether an API endpoint exists vs. only browser-based file upload | Not addressed — this guide only describes manual browser upload via "Browse"/"Upload" buttons; no API/web service details given. |
| 10 | Character encoding requirements for XML file (UTF-8, etc.) | Not stated; standard practice assumption only — should confirm via schema/guidelines. |
| 11 | Handling of multiple work classifications for a single employee within one payroll week (form shows one "Work Classification" per employee row) | Not clarified — may require multiple employee entries or repeated blocks in XML; check schema. |
| 12 | Retry/idempotency behavior — what happens if the same XML file (or Transaction) is uploaded twice | Not mentioned. |
| 13 | Rate limits, timeout behavior for large file uploads | Not mentioned. |
| 14 | Format for "Contract With" value when manually typed (free text) vs. matching to existing PWC-100 registered entity — risk of duplicate/mismatched entity creation | Partially addressed by warnings/notes, but no strict format or validation rule given for manual entry, e.g. no dedupe logic explained beyond "Please use the drop-down list to avoid entering duplicate names." |
| 15 | Optional Vendor Software list contents | Referenced ("see Optional Vendor Software list below") but list itself not shown in this extracted document — likely on the DIR eCPR home page itself. |