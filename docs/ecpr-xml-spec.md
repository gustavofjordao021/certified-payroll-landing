# CA DIR eCPR XML — implementation spec (extracted from official XML Guidelines v2.0)

Source: https://dir.ca.gov/Public-Works/Guides/eCPR-XML-guidelines.pdf (extracted 2026-08-11)

# eCPR XML Implementation Specification
### (Extracted verbatim/exhaustively from DIR eCPR XML Guidelines, Version 2.0, March 2026)

---

## 1. COMPLETE XML STRUCTURE

### 1.1 XML Declaration and Root

```xml
<?xml version="1.0" encoding="utf-8"?>
```

(Note: document shows both `encoding="utf-8"` and `encoding="UTF-8"` in different examples — both appear in source.)

Root element:

```xml
<CPR:eCPR xmlns:CPR="http://www.dir.ca.gov/dlse/CPR-Prod-Test/CPR.xsd">
```

(An earlier/alternate namespace shown in the schema excerpt is `http://oak01web/dlse/CPR-Test/CPR.xsd` — this appears to be a pre-development/test schema location example, while the CPRSample.xml file examples on pages 4–9 use `http://www.dir.ca.gov/dlse/CPR-Prod-Test/CPR.xsd`. See Open Questions.)

### 1.2 Top-Level Structure (in order)

```xml
<CPR:eCPR xmlns:CPR="...">
  <CPR:contractorInfo>
    ...
  </CPR:contractorInfo>
  <CPR:projectInfo>
    ...
  </CPR:projectInfo>
  <CPR:payrollInfo>
    ...
  </CPR:payrollInfo>
</CPR:eCPR>
```

### 1.3 `<CPR:contractorInfo>` — full element order

```xml
<CPR:contractorInfo>
  <CPR:contractorName>Happy Carrier</CPR:contractorName>
  <CPR:contractorLicense>
    <CPR:licenseType>OTHER</CPR:licenseType>
    <CPR:licenseNum>California Motor Carrier Permit: 0123456</CPR:licenseNum>
  </CPR:contractorLicense>
  <CPR:contractorPWCR>1234567890</CPR:contractorPWCR>
  <CPR:contractorFEIN>123456789</CPR:contractorFEIN>
  <CPR:contractorAddress>
    <CPR:street>999 Carrier Rd</CPR:street>
    <CPR:city>Oakland</CPR:city>
    <CPR:state>CA</CPR:state>
    <CPR:zip>94612</CPR:zip>
  </CPR:contractorAddress>
  <CPR:insuranceNum>Insurance101</CPR:insuranceNum>
  <CPR:contractorEmail>happy@carrier.com</CPR:contractorEmail>
</CPR:contractorInfo>
```

**Element definitions (from schema excerpt shown on p.3):**
- `contractorInfo` — "This element contains information of the contractor or company that is legally responsible for this payroll."
- `contractorName` — "This element contains the name of the contractor or company that is legally responsible for this payroll." Base type `xs:string`, restriction: `minLength = 1`, `maxLength = 56`.

**License Type field rule (explicit, p.4):**
> For the "License Type" field, enter "CSLB", "PL", or "OTHER".

No other enumerations or field-level restrictions (beyond contractorName's minLength/maxLength shown as the illustrative schema example) are given in the document text for other contractorInfo fields.

### 1.4 `<CPR:projectInfo>` — full element order

```xml
<CPR:projectInfo>
  <CPR:awardingBody></CPR:awardingBody>
  <CPR:contractAgency>CA-DIR</CPR:contractAgency>
  <CPR:projectName></CPR:projectName>
  <CPR:projectID>7</CPR:projectID>
  <CPR:awardingBodyID></CPR:awardingBodyID>
  <CPR:projectNum></CPR:projectNum>
  <CPR:contractID></CPR:contractID>
  <CPR:projectLocation>
    <CPR:description></CPR:description>
    <CPR:street></CPR:street>
    <CPR:city></CPR:city>
    <CPR:county></CPR:county>
    <CPR:state></CPR:state>
    <CPR:zip></CPR:zip>
  </CPR:projectLocation>
</CPR:projectInfo>
```

**Rule (verbatim, p.4):**
> Under `<CPR:projectInfo>` element, provide any project details that are available however the only mandatory field for eCPR submission is Project ID. This Project ID must match the project you are submitting the payroll for.

All other projectInfo fields (awardingBody, projectName, awardingBodyID, projectNum, contractID, and all of projectLocation) are **optional** and may be left empty, per the sample (all shown blank except contractAgency and projectID, and contractAgency is not stated as mandatory).

### 1.5 `<CPR:payrollInfo>` — full element order

```xml
<CPR:payrollInfo>
  <CPR:statementOfNP>false</CPR:statementOfNP>
  <CPR:payrollNum></CPR:payrollNum>
  <CPR:amendmentNum></CPR:amendmentNum>
  <CPR:forWeekEnding>2015-01-09</CPR:forWeekEnding>
  <CPR:employees>
    <CPR:employee>
      ...
    </CPR:employee>
    <CPR:employee>
      ...
    </CPR:employee>
    <!-- repeatable -->
  </CPR:employees>
</CPR:payrollInfo>
```

**Rules:**
- `statementOfNP`: enum-like boolean — literal string `"false"` or `"true"`.
  - `"false"` = payroll week is NOT a statement of non-performance (p.5, rule 5).
  - `"true"` = payroll week IS a statement of non-performance; in this case **all `<CPR:employee>` elements within `<CPR:employees>` are NOT included** (i.e., `<CPR:employees>` is empty) (p.9, rule 11).
- `payrollNum`: **must be left empty** — "automatically assigned by the eCPR system."
- `amendmentNum`: **must be left empty** — "automatically assigned by the eCPR system."
- `forWeekEnding`: date format **yyyy-mm-dd** (explicit rule, p.6, rule 6). Represents the ending date of the payroll week.
- `employees`: parent/wrapper element containing zero or more `employee` elements. New workers are added by adding additional `<CPR:employee>` elements inside `<CPR:employees>` (p.6, rule 7).

### 1.6 `<CPR:employee>` — full element order (per employee)

```xml
<CPR:employee>
  <CPR:name id="111223333::JOHN SMITH">John Smith</CPR:name>
  <CPR:address>
    <CPR:street>33 Elm Ave</CPR:street>
    <CPR:city>Oakland</CPR:city>
    <CPR:state>CA</CPR:state>
    <CPR:zip>94612</CPR:zip>
  </CPR:address>
  <CPR:ssn>111223333</CPR:ssn>
  <CPR:numWithholdingExemp>2</CPR:numWithholdingExemp>
  <CPR:workClass>Carrier Driver</CPR:workClass>
  <CPR:payroll>
    <CPR:hrsWorkedEachDay>
      <CPR:day id="1">
        <CPR:date>2015-01-03</CPR:date>
        <CPR:straightTime>8</CPR:straightTime>
        <CPR:overtime>1</CPR:overtime>
        <CPR:doubletime>0</CPR:doubletime>
      </CPR:day>
      <CPR:day id="2">
        <CPR:date>2015-01-04</CPR:date>
        <CPR:straightTime>8</CPR:straightTime>
        <CPR:overtime>0</CPR:overtime>
        <CPR:doubletime>0</CPR:doubletime>
      </CPR:day>
      <CPR:day id="3">
        <CPR:date>2015-01-05</CPR:date>
        <CPR:straightTime>8</CPR:straightTime>
        <CPR:overtime>1</CPR:overtime>
        <CPR:doubletime>0</CPR:doubletime>
      </CPR:day>
      <CPR:day id="4">
        <CPR:date>2015-01-06</CPR:date>
        <CPR:straightTime>8</CPR:straightTime>
        <CPR:overtime>0</CPR:overtime>
        <CPR:doubletime>0</CPR:doubletime>
      </CPR:day>
      <CPR:day id="5">
        <CPR:date>2015-01-07</CPR:date>
        <CPR:straightTime>8</CPR:straightTime>
        <CPR:overtime>0</CPR:overtime>
        <CPR:doubletime>0</CPR:doubletime>
      </CPR:day>
      <CPR:day id="6">
        <CPR:date>2015-01-08</CPR:date>
        <CPR:straightTime>8</CPR:straightTime>
        <CPR:overtime>1</CPR:overtime>
        <CPR:doubletime>0</CPR:doubletime>
      </CPR:day>
      <CPR:day id="7">
        <CPR:date>2015-01-09</CPR:date>
        <CPR:straightTime>8</CPR:straightTime>
        <CPR:overtime>0</CPR:overtime>
        <CPR:doubletime>0</CPR:doubletime>
      </CPR:day>
    </CPR:hrsWorkedEachDay>
    <CPR:totHrs>
      <CPR:totHrsStraightTime>56</CPR:totHrsStraightTime>
      <CPR:totHrsOvertime>3</CPR:totHrsOvertime>
      <CPR:totHrsDoubletime>0</CPR:totHrsDoubletime>
    </CPR:totHrs>
    <CPR:hrlyPayRate>
      <CPR:hrlyPayRateStraightTime>50.00</CPR:hrlyPayRateStraightTime>
      <CPR:hrlyPayRateOvertime>60.00</CPR:hrlyPayRateOvertime>
      <CPR:hrlyPayRateDoubletime>70.00</CPR:hrlyPayRateDoubletime>
    </CPR:hrlyPayRate>
    <CPR:grossAmountEarned>
      <CPR:thisProject>2000</CPR:thisProject>
      <CPR:allWork>3000</CPR:allWork>
    </CPR:grossAmountEarned>
    <!-- [deductionsContribPay follows within payroll; exact intervening
         structure between grossAmountEarned (line ~107) and
         deductionsContribPay (line ~203) is not shown in the document
         excerpts — see Open Questions] -->
    <CPR:deductionsContribPay>
      <CPR:fedTax>100.00</CPR:fedTax>
      <CPR:FICA>50.00</CPR:FICA>
      <CPR:stateTax>20.00</CPR:stateTax>
      <CPR:SDI>10.00</CPR:SDI>
      <CPR:vacationHoliday>10</CPR:vacationHoliday>
      <CPR:healthWelfare>10</CPR:healthWelfare>
      <CPR:pension>10</CPR:pension>
      <CPR:training>10</CPR:training>
      <CPR:fundAdmin>20</CPR:fundAdmin>
      <CPR:dues>30</CPR:dues>
      <CPR:travelSubs>30</CPR:travelSubs>
      <CPR:savings>0.0</CPR:savings>
      <CPR:other>0.0</CPR:other>
      <CPR:total>200</CPR:total>
      <CPR:notes>This is a a sample</CPR:notes>
    </CPR:deductionsContribPay>
  </CPR:payroll>
</CPR:employee>
```

**Notes on structure fidelity:** The document's page-by-page screenshots show line numbers jumping (e.g., employee block spans lines 38–133 for a two-employee file; `deductionsContribPay` shown starting at line 203). This indicates content exists between `grossAmountEarned` (ends ~line 107) and `deductionsContribPay` (starts ~line 203) that is **not visible in the provided document excerpts** — likely the second employee's full block or additional fields. The verbatim visible content has been reproduced above; the gap is flagged in Open Questions.

---

## 2. FIELD FORMAT RULES

### 2.1 Dates
- **Format:** `yyyy-mm-dd` (explicitly stated for `<CPR:forWeekEnding>`; same format used consistently in `<CPR:date>` under each `<CPR:day>`, e.g., `2015-01-09`).

### 2.2 SSN / Employee Identification
- `<CPR:ssn>`: numeric string, no dashes shown (e.g., `111223333`).
- `<CPR:name id="...">`: the `id` attribute **must** contain **SSN::Name** of the employee (double-colon delimiter), e.g., `id="111223333::JOHN SMITH"`.
  - The **"Name" portion must be all upper-case** (explicit rule, p.6 rule 8, and highlighted in diagram on p.7 as "upper-case only").
  - The element's text content (e.g., `John Smith`) is NOT required to be upper-case per the sample (shown in mixed case as element content, while the `id` attribute is upper-case).

### 2.3 License Type Enum
- `<CPR:licenseType>` accepted values: **"CSLB"**, **"PL"**, or **"OTHER"** (exact strings, case as shown).

### 2.4 Boolean-like Enum Fields
- `<CPR:statementOfNP>`: literal string values **"true"** or **"false"** only.

### 2.5 Hours
- `<CPR:straightTime>`, `<CPR:overtime>`, `<CPR:doubletime>` (per day): numeric, shown as plain integers (e.g., `8`, `1`, `0`) — no decimal shown in samples, though decimals not explicitly prohibited.
- `<CPR:totHrsStraightTime>`, `<CPR:totHrsOvertime>`, `<CPR:totHrsDoubletime>`: numeric totals across all days (e.g., `56`, `3`, `0`).
- **Day id rule:** "Day id should begin at '1' and then increment for each day included in the payroll. The total number of days for each employee should [be] the total number of days included in the payroll." (verbatim, p.7, rule 9 — note: source text appears to have an omitted word "be").

### 2.6 Money / Pay Rates
- `<CPR:hrlyPayRateStraightTime>`, `<CPR:hrlyPayRateOvertime>`, `<CPR:hrlyPayRateDoubletime>`: decimal with two places shown (e.g., `50.00`, `60.00`, `70.00`).
- `<CPR:thisProject>`, `<CPR:allWork>` (under `grossAmountEarned`): numeric amounts, shown without decimals in sample (e.g., `2000`, `3000`).
- **Deductions/Contributions (`<CPR:deductionsContribPay>`) — explicit rule (p.9, rule 12):**
  > When entering fringe benefits (e.g. pension) in the `<CPR:deductionsContribPay>` section, make sure to include **hourly amounts**. For deductions, enter the **total lump sum amount** for deductions such as $121.22 for FICA, which indicates a total amount paid to FICA of $121.22 for all hours worked in the pay period.
  
  This implies a **distinction within the same section**:
  - Fringe benefit fields (e.g., `vacationHoliday`, `healthWelfare`, `pension`, `training`, `fundAdmin`, `dues`, `travelSubs`, `savings`, `other`) → enter as **hourly amounts**.
  - Deduction fields (e.g., `fedTax`, `FICA`, `stateTax`, `SDI`) → enter as **total lump sum amount** for the pay period.
  - `<CPR:total>`: total value (sample shows `200`, integer, no decimal).
  - `<CPR:notes>`: free text, optional (see §2.8).

### 2.7 Withholding
- `<CPR:numWithholdingExemp>`: numeric (e.g., `2`).

### 2.8 Notes Field
- `<CPR:notes>` (under `deductionsContribPay`): "can be used to add free form supplemental descriptive information for each employee's payroll, but it isn't mandatory and can be left blank." (p.8, rule 10) — **only explicitly optional field for employee data.**

### 2.9 Required vs Optional Summary (explicit statements only)
- **Mandatory, entire document, explicitly stated:**
  - `<CPR:projectID>` — "the only mandatory field for eCPR submission" within projectInfo (p.4, rule 3).
  - All fields under `<CPR:employee>` are mandatory **except** `<CPR:notes>` (p.7, rule 9: "All fields under employee are mandatory except `<CPR:notes>`.")
  - Address information must be included for each employee ("Make sure address information is included for each employee," p.7 rule 9).
- **Explicitly must be left empty (system-assigned):**
  - `<CPR:payrollNum>`
  - `<CPR:amendmentNum>`
- **Explicitly optional:**
  - `<CPR:notes>` under `deductionsContribPay`.
  - All fields in `projectInfo` other than `projectID` ("provide any project details that are available").

No other field is explicitly marked required/optional in the source text beyond the above; contractorInfo fields are populated in the sample but no explicit "mandatory" statement is given for them individually (only the minLength/maxLength schema restriction example for `contractorName`: min 1, max 56 characters).

---

## 3. PER-EMPLOYEE / PER-PAYROLL STRUCTURE DETAIL

### 3.1 Employee-level fields (in schema order per sample)
1. `name` (with `id` attribute = `SSN::UPPERCASE-NAME`)
2. `address` (street, city, state, zip)
3. `ssn`
4. `numWithholdingExemp`
5. `workClass` (free text, e.g., "Carrier Driver")
6. `payroll` (container):
   - `hrsWorkedEachDay` → repeated `day` elements (id="1".."n"), each with `date`, `straightTime`, `overtime`, `doubletime`
   - `totHrs` → `totHrsStraightTime`, `totHrsOvertime`, `totHrsDoubletime`
   - `hrlyPayRate` → `hrlyPayRateStraightTime`, `hrlyPayRateOvertime`, `hrlyPayRateDoubletime`
   - `grossAmountEarned` → `thisProject`, `allWork`
   - `deductionsContribPay` → `fedTax`, `FICA`, `stateTax`, `SDI`, `vacationHoliday`, `healthWelfare`, `pension`, `training`, `fundAdmin`, `dues`, `travelSubs`, `savings`, `other`, `total`, `notes`

### 3.2 Multiple employees
- Each worker gets a separate `<CPR:employee>` element nested inside the single `<CPR:employees>` wrapper (p.6, rule 7).
- Sample XML line numbering indicates a two-employee file spans from line 38 to line 223 for the `employees` block, with individual `employee` blocks starting at lines 43 and 133 respectively (implying each employee block is roughly 90 lines given full day/pay/deduction data) — exact content of second employee not shown verbatim beyond structural skeleton.

### 3.3 Statement of Non-Performance week
- Set `<CPR:statementOfNP>true</CPR:statementOfNP>`.
- `<CPR:employees>` element is present but **contains no `<CPR:employee>` children** (empty), as shown:
```xml
<CPR:payrollInfo>
  <CPR:statementOfNP>true</CPR:statementOfNP>
  <CPR:payrollNum></CPR:payrollNum>
  <CPR:amendmentNum></CPR:amendmentNum>
  <CPR:forWeekEnding>2015-01-09</CPR:forWeekEnding>
  <CPR:employees>
  </CPR:employees>
</CPR:payrollInfo>
```

---

## 4. VALIDATION RULES AND KNOWN REJECTION CAUSES (explicit only)

The document does not provide an explicit list of "rejection causes" or error codes. The following are the only validation-related statements made:

1. **Schema validation recommended**: Use Notepad++ or XML Notepad to validate XML files against a schema file (CPR.xsd) before submission (p.2).
2. **Project ID must match**: "This Project ID must match the project you are submitting the payroll for" (p.4) — implies mismatch would cause rejection/failure, though not explicitly stated as a rejection cause.
3. **payrollNum / amendmentNum must be empty**: system-assigned; presumably submitting non-empty values could cause rejection or be overwritten (not explicitly stated as causing rejection, only stated they "must be empty").
4. **File extension requirement**: "In order to upload an XML file to the Public Works eCPR submission, your file must end with the extension 'xml' (e.g. testpayroll123.xml)" (p.9, Section 5) — implicit rejection cause if extension is wrong.
5. **Employee name id format**: must be `SSN::NAME` with NAME in upper-case — deviation not explicitly stated as rejection cause, but presented as a firm rule ("needs to have," "must be all upper-case").
6. **Mandatory field omission**: Since all employee fields except `notes` are mandatory, and `projectID` is the only mandatory projectInfo field, omission of these would presumably fail schema validation (implicit, not explicitly stated as "rejection").
7. **Date format non-compliance**: forWeekEnding not in yyyy-mm-dd format — implicit failure, not explicitly stated as rejection cause.
8. **License Type value not in enumerated set** (CSLB/PL/OTHER) — implicit schema validation failure.

No explicit error messages, error codes, or a formal "rejection causes" list appear anywhere in the document.

---

## 5. AMENDMENTS / CORRECTIONS, NON-PERFORMANCE, STATEMENT OF COMPLIANCE

### 5.1 Amendments
- `<CPR:amendmentNum>` element exists within `payrollInfo` but the document states only: "The values for `<CPR:payrollNum>` and `<CPR:amendmentNum>` elements are automatically assigned by the eCPR system and must be empty" (p.5, rule 5).
- **No further guidance is given** on how to submit an amendment/correction, what triggers an amendment number assignment, or any distinct XML structure for amended payrolls. This appears to be entirely system-managed and outside the scope of what the contractor populates.

### 5.2 Statement of Non-Performance
- Controlled entirely by `<CPR:statementOfNP>` boolean-like field:
  - `"false"` → normal payroll week with employee data required.
  - `"true"` → non-performance week; `<CPR:employees>` element present but empty (no `<CPR:employee>` children).
- No other special elements, flags, or explanatory text fields are referenced for statement of non-performance beyond this single boolean field and the empty employees container.

### 5.3 Statement of Compliance
- **The document does not mention "Statement of Compliance" anywhere** as a distinct concept, element, or required attestation field (e.g., no `<CPR:statementOfCompliance>`, no signature block, no certification statement element appears in any shown XML or schema excerpt). This is a notable gap — see Open Questions.

---

## 6. FILE NAMING CONVENTION

Verbatim (Section 5, p.9):
> In order to upload an XML file to the Public Works eCPR submission, your file must end with the extension "xml" (e.g. testpayroll123.xml)

No other naming convention rules (prefixes, contractor ID embedding, date embedding, etc.) are specified.

---

## 7. SUPPORTING FILES / TOOLING REFERENCED

- **CPRSample.xml** — sample XML with sample data (template).
- **CPR.xsd** — the eCPR schema file; contains `xs:schema`, `xs:element`, `xs:complexType`, `xs:sequence`, `xs:annotation`/`xs:documentation`, `xs:simpleType`, `xs:restriction` (base `xs:string`, `minLength`, `maxLength`) constructs, per the excerpt shown.
- Schema header excerpt (verbatim, p.3):
```xml
<?xml version="1.0" encoding="utf-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:CPR="http://oak01web/dlse/CPR-Test/CPR.xsd"
    targetNamespace="http://oak01web/dlse/CPR-Test/CPR.xsd"
    elementFormDefault="qualified" attributeFormDefault="unqualified">
    <!--XML SCHEMA for electronic California Payroll Records version Pre-development-->
    <!--day element changed according to iform-->
    <xs:include schemaLocation=""></xs:include>
    <xs:element name="eCPR">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="contractorInfo">
                    <xs:annotation>
                        <xs:documentation>
                            This element contains information of the
                            contractor or company that is legally
                            responsible for this payroll.
                        </xs:documentation>
                    </xs:annotation>
                    <xs:complexType>
                        <xs:sequence>
                            <xs:element name="contractorName">
                                <xs:annotation>
                                    <xs:documentation>
                                        This element contains the name
                                        of the contractor or company
                                        that is legally responsible for
                                        this payroll.
                                    </xs:documentation>
                                </xs:annotation>
                                <xs:simpleType>
                                    <xs:restriction base="xs:string">
                                        <xs:minLength value="1" />
                                        <xs:maxLength value="56" />
                                    </xs:restriction>
                                </xs:simpleType>
                            </xs:element>
```
(Excerpt truncated as shown in source; full CPR.xsd content not reproduced in document beyond this illustrative fragment.)

- Recommended tool: **XML Notepad** (free, Microsoft), download URL: `https://microsoft.github.io/XmlNotepad/`. Installation steps: go to webpage → click "Install" → download installer → run installation wizard → click "Install" to complete.
- Alternative editors: Notepad (PC), TextEdit (Mac), Notepad++.

---

## OPEN QUESTIONS

1. **Namespace URI discrepancy**: The CPR.xsd excerpt (p.3) uses `xmlns:CPR="http://oak01web/dlse/CPR-Test/CPR.xsd"` (labeled "Pre-development" schema), while sample XML files (pp.4–9) use `xmlns:CPR="http://www.dir.ca.gov/dlse/CPR-Prod-Test/CPR.xsd"`. Which is the correct/current production namespace for live submissions? Is there a further distinct "Prod" (non-Test) namespace not shown?

2. **Missing XML content between `grossAmountEarned` and `deductionsContribPay`**: Line numbering in the sample (lines ~107 to ~203) suggests content exists that is not shown in the provided document excerpts (likely the remainder of employee #1's record and/or all of employee #2's record, or other elements). What is the complete, gap-free content of these lines?

3. **Statement of Compliance**: The document never mentions a Statement of Compliance element, certification statement, signer name/title, or date-signed field, which is typically part of certified payroll (WH-347 equivalent). Is this handled entirely outside the XML (e.g., via a separate portal step at upload time), or is there an XML element not captured in these excerpts?

4. **Amendment submission mechanics**: No guidance is given on how a contractor actually submits an amended/corrected payroll via XML (e.g., is a full new file submitted referencing the original submission, or is there a separate correction endpoint/element?). What identifies which original payroll record an amendment corrects, given `amendmentNum` is system-assigned and must be left empty on submission?

5. **CPR.xsd full content**: Only a small fragment of the actual schema (covering `eCPR` → `contractorInfo` → `contractorName`) is shown. The complete enumerations, data types, minOccurs/maxOccurs, and restrictions for all other elements (projectInfo, payrollInfo, employee, day, deductionsContribPay fields, etc.) are not provided verbatim in this document. A serializer would need the actual CPR.xsd file for complete/authoritative validation rules.

6. **Data types/format for numeric fields**: Are `straightTime`, `overtime`, `doubletime`, `totHrs*`, `numWithholdingExemp`, `thisProject`, `allWork`, and the `deductionsContribPay` monetary fields defined as integers, decimals with fixed precision, or strings in the schema? The samples show inconsistent decimal usage (e.g., `2000` vs `50.00` vs `0.0`) with no stated formatting rule beyond the two pay-rate/deduction examples with `.00`.

7. **workClass enumeration**: Is `<CPR:workClass>` a free-text field or does it need to match a controlled list of job classifications/crafts (as is typical for prevailing wage certified payrolls)? The document shows only one example value ("Carrier Driver") with no stated restriction.

8. **contractorPWCR, contractorFEIN, insuranceNum format rules**: No length, pattern, or checksum rules given (e.g., is FEIN validated as 9 digits, PWCR as a specific registration number format)?

9. **Address field rules**: No format/length rules given for street/city/state/zip in either contractorAddress, projectLocation, or employee address (e.g., is `state` restricted to 2-letter USPS codes, is `zip` 5-digit or ZIP+4 allowed)?

10. **`total` field in `deductionsContribPay`**: Is this expected to equal the sum of all preceding deduction/fringe fields? No validation rule/formula is stated, though the sample total (200) does not obviously equal the sum of the listed fringe/deduction values shown (100+50+20+10+10+10+10+10+20+30+30+0+0 = 300, not 200), suggesting either the sample is illustrative/non-representative or a business rule not documented governs which fields sum into `total`.

11. **Multiple projects per employee / split time**: `grossAmountEarned` has both `thisProject` and `allWork` — is there guidance for employees working across multiple public works projects in the same pay period (e.g., must a separate XML file be submitted per project, or can one file cover multiple ProjectIDs)? The document states only one `projectID` per file structure, with no repeatable projectInfo per employee.

12. **Character encoding**: Declaration shows `utf-8` in one sample and `UTF-8` in another — is case sensitivity in the encoding declaration meaningful/enforced?