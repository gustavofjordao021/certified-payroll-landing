import { describe, it, expect } from "vitest";
import {
  serializeEcpr,
  ecprEmployeeFromRow,
  ECPR_NAMESPACE,
  EcprContractor,
  EcprProject,
  EcprEmployee,
} from "../ecpr-xml";
import { EmployeeRow } from "../../types";

// Golden tests derived from the official DIR "XML Guidelines v2.0" sample
// (docs/ecpr-xml-spec.md). The serializer's output is asserted verbatim —
// element order, namespace, empty system-assigned fields, and formats are
// all part of the DIR contract.

const contractor = (over: Partial<EcprContractor> = {}): EcprContractor => ({
  name: "Happy Carrier",
  licenseType: "OTHER",
  licenseNum: "California Motor Carrier Permit: 0123456",
  pwcr: "1234567890",
  fein: "123456789",
  address: { street: "999 Carrier Rd", city: "Oakland", state: "CA", zip: "94612" },
  insuranceNum: "Insurance101",
  email: "happy@carrier.com",
  ...over,
});

const project = (over: Partial<EcprProject> = {}): EcprProject => ({
  projectID: "7",
  contractAgency: "CA-DIR",
  ...over,
});

const employee = (over: Partial<EcprEmployee> = {}): EcprEmployee => ({
  name: "John Smith",
  ssn: "111223333",
  address: { street: "33 Elm Ave", city: "Oakland", state: "CA", zip: "94612" },
  numWithholdingExemp: 2,
  workClass: "Carrier Driver",
  days: [
    { date: "2015-01-08", straightTime: 8, overtime: 1, doubletime: 0 },
    { date: "2015-01-09", straightTime: 8, overtime: 0, doubletime: 0 },
  ],
  rateStraightTime: 50,
  rateOvertime: 75,
  rateDoubletime: 100,
  grossThisProject: 2000,
  grossAllWork: 3000,
  deductions: { fedTax: 100, FICA: 50, stateTax: 20, SDI: 10, total: 180 },
  ...over,
});

describe("serializeEcpr — golden: statement of non-performance", () => {
  it("emits the exact DIR non-performance document", () => {
    const xml = serializeEcpr({
      contractor: contractor(),
      project: project(),
      forWeekEnding: "2015-01-09",
      statementOfNP: true,
      employees: [],
    });
    expect(xml).toBe(`<?xml version="1.0" encoding="utf-8"?>
<CPR:eCPR xmlns:CPR="http://www.dir.ca.gov/dlse/CPR-Prod-Test/CPR.xsd">
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
  <CPR:payrollInfo>
    <CPR:statementOfNP>true</CPR:statementOfNP>
    <CPR:payrollNum></CPR:payrollNum>
    <CPR:amendmentNum></CPR:amendmentNum>
    <CPR:forWeekEnding>2015-01-09</CPR:forWeekEnding>
    <CPR:employees>
    </CPR:employees>
  </CPR:payrollInfo>
</CPR:eCPR>
`);
  });
});

describe("serializeEcpr — golden: one-employee payroll", () => {
  it("emits the exact employee block per the DIR sample structure", () => {
    const xml = serializeEcpr({
      contractor: contractor(),
      project: project(),
      forWeekEnding: "2015-01-09",
      employees: [employee()],
    });
    // the payrollInfo half, verbatim
    expect(xml).toContain(`  <CPR:payrollInfo>
    <CPR:statementOfNP>false</CPR:statementOfNP>
    <CPR:payrollNum></CPR:payrollNum>
    <CPR:amendmentNum></CPR:amendmentNum>
    <CPR:forWeekEnding>2015-01-09</CPR:forWeekEnding>
    <CPR:employees>
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
              <CPR:date>2015-01-08</CPR:date>
              <CPR:straightTime>8</CPR:straightTime>
              <CPR:overtime>1</CPR:overtime>
              <CPR:doubletime>0</CPR:doubletime>
            </CPR:day>
            <CPR:day id="2">
              <CPR:date>2015-01-09</CPR:date>
              <CPR:straightTime>8</CPR:straightTime>
              <CPR:overtime>0</CPR:overtime>
              <CPR:doubletime>0</CPR:doubletime>
            </CPR:day>
          </CPR:hrsWorkedEachDay>
          <CPR:totHrs>
            <CPR:totHrsStraightTime>16</CPR:totHrsStraightTime>
            <CPR:totHrsOvertime>1</CPR:totHrsOvertime>
            <CPR:totHrsDoubletime>0</CPR:totHrsDoubletime>
          </CPR:totHrs>
          <CPR:hrlyPayRate>
            <CPR:hrlyPayRateStraightTime>50.00</CPR:hrlyPayRateStraightTime>
            <CPR:hrlyPayRateOvertime>75.00</CPR:hrlyPayRateOvertime>
            <CPR:hrlyPayRateDoubletime>100.00</CPR:hrlyPayRateDoubletime>
          </CPR:hrlyPayRate>
          <CPR:grossAmountEarned>
            <CPR:thisProject>2000.00</CPR:thisProject>
            <CPR:allWork>3000.00</CPR:allWork>
          </CPR:grossAmountEarned>
          <CPR:deductionsContribPay>
            <CPR:fedTax>100.00</CPR:fedTax>
            <CPR:FICA>50.00</CPR:FICA>
            <CPR:stateTax>20.00</CPR:stateTax>
            <CPR:SDI>10.00</CPR:SDI>
            <CPR:vacationHoliday>0.00</CPR:vacationHoliday>
            <CPR:healthWelfare>0.00</CPR:healthWelfare>
            <CPR:pension>0.00</CPR:pension>
            <CPR:training>0.00</CPR:training>
            <CPR:fundAdmin>0.00</CPR:fundAdmin>
            <CPR:dues>0.00</CPR:dues>
            <CPR:travelSubs>0.00</CPR:travelSubs>
            <CPR:savings>0.00</CPR:savings>
            <CPR:other>0.00</CPR:other>
            <CPR:total>180.00</CPR:total>
            <CPR:notes></CPR:notes>
          </CPR:deductionsContribPay>
        </CPR:payroll>
      </CPR:employee>
    </CPR:employees>
  </CPR:payrollInfo>
</CPR:eCPR>
`);
    // top-level order: contractorInfo -> projectInfo -> payrollInfo
    expect(xml.indexOf("<CPR:contractorInfo>")).toBeLessThan(xml.indexOf("<CPR:projectInfo>"));
    expect(xml.indexOf("<CPR:projectInfo>")).toBeLessThan(xml.indexOf("<CPR:payrollInfo>"));
    expect(xml.startsWith(`<?xml version="1.0" encoding="utf-8"?>\n<CPR:eCPR xmlns:CPR="${ECPR_NAMESPACE}">`)).toBe(true);
  });

  it("normalizes SSN (strips dashes) and upper-cases only the id attribute", () => {
    const xml = serializeEcpr({
      contractor: contractor(),
      project: project(),
      forWeekEnding: "2015-01-09",
      employees: [employee({ name: "Miguel de la Cruz", ssn: "111-22-3333" })],
    });
    expect(xml).toContain('<CPR:name id="111223333::MIGUEL DE LA CRUZ">Miguel de la Cruz</CPR:name>');
    expect(xml).toContain("<CPR:ssn>111223333</CPR:ssn>");
  });

  it("escapes XML special characters in text and attributes", () => {
    const xml = serializeEcpr({
      contractor: contractor({ name: "Smith & Sons <Builders>" }),
      project: project(),
      forWeekEnding: "2015-01-09",
      employees: [employee({ name: 'Joe "Bo" O\'Neil & Co' })],
    });
    expect(xml).toContain("<CPR:contractorName>Smith &amp; Sons &lt;Builders&gt;</CPR:contractorName>");
    expect(xml).toContain('id="111223333::JOE &quot;BO&quot; O\'NEIL &amp; CO"');
    expect(xml).not.toMatch(/<CPR:contractorName>[^<]*&(?!amp;|lt;|gt;|quot;|apos;)/);
  });

  it("defaults the deduction total to the sum of provided fields", () => {
    const xml = serializeEcpr({
      contractor: contractor(),
      project: project(),
      forWeekEnding: "2015-01-09",
      employees: [employee({ deductions: { fedTax: 100.5, FICA: 49.5 } })],
    });
    expect(xml).toContain("<CPR:total>150.00</CPR:total>");
  });

  it("formats fractional hours without padding and money with two decimals", () => {
    const xml = serializeEcpr({
      contractor: contractor(),
      project: project(),
      forWeekEnding: "2015-01-09",
      employees: [
        employee({
          days: [{ date: "2015-01-09", straightTime: 6.5, overtime: 0, doubletime: 0 }],
          grossThisProject: 325,
          grossAllWork: 325,
        }),
      ],
    });
    expect(xml).toContain("<CPR:straightTime>6.5</CPR:straightTime>");
    expect(xml).toContain("<CPR:totHrsStraightTime>6.5</CPR:totHrsStraightTime>");
    expect(xml).toContain("<CPR:thisProject>325.00</CPR:thisProject>");
  });
});

describe("serializeEcpr — DIR validation rules", () => {
  const base = { contractor: contractor(), project: project(), forWeekEnding: "2015-01-09", employees: [employee()] };

  it("rejects an empty or over-long contractorName (schema: 1..56 chars)", () => {
    expect(() => serializeEcpr({ ...base, contractor: contractor({ name: "" }) })).toThrow(/contractorName/);
    expect(() => serializeEcpr({ ...base, contractor: contractor({ name: "x".repeat(57) }) })).toThrow(/contractorName/);
    expect(() => serializeEcpr({ ...base, contractor: contractor({ name: "x".repeat(56) }) })).not.toThrow();
  });

  it("rejects a licenseType outside CSLB | PL | OTHER", () => {
    expect(() =>
      serializeEcpr({ ...base, contractor: contractor({ licenseType: "DMV" as never }) }),
    ).toThrow(/licenseType/);
  });

  it("rejects a missing projectID — the one mandatory projectInfo field", () => {
    expect(() => serializeEcpr({ ...base, project: project({ projectID: "" }) })).toThrow(/projectID/);
  });

  it("rejects forWeekEnding not in yyyy-mm-dd", () => {
    expect(() => serializeEcpr({ ...base, forWeekEnding: "01/09/2015" })).toThrow(/forWeekEnding/);
    expect(() => serializeEcpr({ ...base, forWeekEnding: "2015-13-40" })).toThrow(/forWeekEnding/);
  });

  it("rejects a statement of non-performance that still lists employees", () => {
    expect(() => serializeEcpr({ ...base, statementOfNP: true })).toThrow(/non-performance/);
  });

  it("rejects an SSN that is not 9 digits", () => {
    expect(() => serializeEcpr({ ...base, employees: [employee({ ssn: "12345" })] })).toThrow(/SSN/);
  });

  it("rejects a day date not in yyyy-mm-dd", () => {
    expect(() =>
      serializeEcpr({
        ...base,
        employees: [employee({ days: [{ date: "Jan 9", straightTime: 8, overtime: 0, doubletime: 0 }] })],
      }),
    ).toThrow(/day date/);
  });
});

describe("ecprEmployeeFromRow — bridge from extraction/generator rows", () => {
  const extras = {
    ssn: "111-22-3333",
    address: { street: "33 Elm Ave", city: "Oakland", state: "CA", zip: "94612" },
  };
  const row = (over: Partial<EmployeeRow> = {}): EmployeeRow => ({
    name: "Miguel Ramirez",
    classification: "Electrician - Journeyman",
    daily_hours: [8, 8, 8, 10, 9, 0, 0],
    reg_hours: 40,
    ot_hours: 3,
    hourly_rate: 50,
    gross_pay: 2225,
    fringe_total: null,
    ...over,
  });

  it("builds 7 dated days ending at weekEnding with federal ST/OT split", () => {
    const e = ecprEmployeeFromRow(row(), extras, "2026-08-09");
    expect(e.days).toHaveLength(7);
    expect(e.days[0].date).toBe("2026-08-03"); // Monday
    expect(e.days[6].date).toBe("2026-08-09"); // week ending Sunday
    // splitDaily semantics: day 5 (9h) crosses the 40h budget -> 6 ST + 3 OT
    expect(e.days[4]).toMatchObject({ straightTime: 6, overtime: 3, doubletime: 0 });
    expect(e.workClass).toBe("Electrician - Journeyman");
    expect(e.rateStraightTime).toBe(50);
    expect(e.rateOvertime).toBe(75);
    expect(e.rateDoubletime).toBe(100);
    expect(e.grossThisProject).toBe(2225);
  });

  it("crosses month boundaries when dating the week", () => {
    const e = ecprEmployeeFromRow(row(), extras, "2026-08-02");
    expect(e.days[0].date).toBe("2026-07-27");
  });

  it("computes gross when the row has none", () => {
    const e = ecprEmployeeFromRow(row({ gross_pay: null }), extras, "2026-08-09");
    expect(e.grossThisProject).toBe(40 * 50 + 3 * 75);
  });

  it("throws when mandatory eCPR inputs are missing from the row", () => {
    expect(() => ecprEmployeeFromRow(row({ hourly_rate: null }), extras, "2026-08-09")).toThrow(/rate/);
    expect(() => ecprEmployeeFromRow(row({ daily_hours: null }), extras, "2026-08-09")).toThrow(/daily/);
  });
});
