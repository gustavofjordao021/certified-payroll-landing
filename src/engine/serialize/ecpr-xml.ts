import { EmployeeRow } from "../types";
import { splitDaily } from "../render/wh347-official";

// CA DIR eCPR XML serializer — implements docs/ecpr-xml-spec.md (extracted
// from the official DIR XML Guidelines v2.0). Element order, the empty
// system-assigned payrollNum/amendmentNum, and the SSN::UPPERCASE-NAME id
// attribute are all part of the DIR contract and are golden-tested.
//
// Namespace: the Guidelines' own sample files use the Prod-Test URI below;
// the doc never shows a plain-Prod one (spec Open Question 1). Overridable
// here if DIR publishes a different production namespace.
export const ECPR_NAMESPACE = "http://www.dir.ca.gov/dlse/CPR-Prod-Test/CPR.xsd";

export interface EcprAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface EcprContractor {
  name: string;
  licenseType: "CSLB" | "PL" | "OTHER";
  licenseNum: string;
  pwcr: string;
  fein: string;
  address: EcprAddress;
  insuranceNum: string;
  email: string;
}

export interface EcprProject {
  projectID: string; // the only DIR-mandatory projectInfo field
  awardingBody?: string;
  contractAgency?: string;
  projectName?: string;
  awardingBodyID?: string;
  projectNum?: string;
  contractID?: string;
  location?: Partial<EcprAddress & { description: string; county: string }>;
}

export interface EcprDay {
  date: string; // yyyy-mm-dd
  straightTime: number;
  overtime: number;
  doubletime: number;
}

// Per DIR rule 12: tax fields are lump sums for the period, fringe fields are
// hourly amounts. `total` defaults to the sum of provided fields (the
// Guidelines state no formula — spec Open Question 10).
export interface EcprDeductions {
  fedTax?: number;
  FICA?: number;
  stateTax?: number;
  SDI?: number;
  vacationHoliday?: number;
  healthWelfare?: number;
  pension?: number;
  training?: number;
  fundAdmin?: number;
  dues?: number;
  travelSubs?: number;
  savings?: number;
  other?: number;
  total?: number;
  notes?: string;
}

export interface EcprEmployee {
  name: string;
  ssn: string; // digits, dashes tolerated
  address: EcprAddress;
  numWithholdingExemp: number;
  workClass: string;
  days: EcprDay[];
  rateStraightTime: number;
  rateOvertime: number;
  rateDoubletime: number;
  grossThisProject: number;
  grossAllWork: number;
  deductions?: EcprDeductions;
}

export interface EcprPayrollInput {
  contractor: EcprContractor;
  project: EcprProject;
  forWeekEnding: string; // yyyy-mm-dd
  statementOfNP?: boolean;
  employees: EcprEmployee[];
}

const LICENSE_TYPES = ["CSLB", "PL", "OTHER"] as const;
const DEDUCTION_FIELDS = [
  "fedTax", "FICA", "stateTax", "SDI", "vacationHoliday", "healthWelfare",
  "pension", "training", "fundAdmin", "dues", "travelSubs", "savings", "other",
] as const;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const fmtHours = (n: number) => String(+n.toFixed(2));
const fmtMoney = (n: number) => n.toFixed(2);

function isIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

export function serializeEcpr(input: EcprPayrollInput): string {
  const { contractor, project, forWeekEnding, employees } = input;
  const statementOfNP = input.statementOfNP ?? false;

  if (!contractor.name || contractor.name.length > 56)
    throw new Error("contractorName must be 1-56 characters (CPR.xsd restriction)");
  if (!LICENSE_TYPES.includes(contractor.licenseType))
    throw new Error('licenseType must be "CSLB", "PL", or "OTHER"');
  if (!project.projectID)
    throw new Error("projectID is required — the only mandatory projectInfo field for eCPR submission");
  if (!isIsoDate(forWeekEnding))
    throw new Error("forWeekEnding must be a valid yyyy-mm-dd date");
  if (statementOfNP && employees.length > 0)
    throw new Error("a statement of non-performance week must not include employees");

  const out: string[] = [];
  const line = (indent: number, s: string) => out.push("  ".repeat(indent) + s);
  const el = (indent: number, tag: string, text: string, attrs = "") =>
    line(indent, `<CPR:${tag}${attrs}>${esc(text)}</CPR:${tag}>`);

  out.push('<?xml version="1.0" encoding="utf-8"?>');
  out.push(`<CPR:eCPR xmlns:CPR="${ECPR_NAMESPACE}">`);

  // contractorInfo — full element order per spec §1.3
  line(1, "<CPR:contractorInfo>");
  el(2, "contractorName", contractor.name);
  line(2, "<CPR:contractorLicense>");
  el(3, "licenseType", contractor.licenseType);
  el(3, "licenseNum", contractor.licenseNum);
  line(2, "</CPR:contractorLicense>");
  el(2, "contractorPWCR", contractor.pwcr);
  el(2, "contractorFEIN", contractor.fein);
  line(2, "<CPR:contractorAddress>");
  el(3, "street", contractor.address.street);
  el(3, "city", contractor.address.city);
  el(3, "state", contractor.address.state);
  el(3, "zip", contractor.address.zip);
  line(2, "</CPR:contractorAddress>");
  el(2, "insuranceNum", contractor.insuranceNum);
  el(2, "contractorEmail", contractor.email);
  line(1, "</CPR:contractorInfo>");

  // projectInfo — all optional except projectID, empties emitted per sample
  const loc = project.location ?? {};
  line(1, "<CPR:projectInfo>");
  el(2, "awardingBody", project.awardingBody ?? "");
  el(2, "contractAgency", project.contractAgency ?? "");
  el(2, "projectName", project.projectName ?? "");
  el(2, "projectID", project.projectID);
  el(2, "awardingBodyID", project.awardingBodyID ?? "");
  el(2, "projectNum", project.projectNum ?? "");
  el(2, "contractID", project.contractID ?? "");
  line(2, "<CPR:projectLocation>");
  el(3, "description", loc.description ?? "");
  el(3, "street", loc.street ?? "");
  el(3, "city", loc.city ?? "");
  el(3, "county", loc.county ?? "");
  el(3, "state", loc.state ?? "");
  el(3, "zip", loc.zip ?? "");
  line(2, "</CPR:projectLocation>");
  line(1, "</CPR:projectInfo>");

  // payrollInfo — payrollNum/amendmentNum system-assigned, MUST be empty
  line(1, "<CPR:payrollInfo>");
  el(2, "statementOfNP", statementOfNP ? "true" : "false");
  el(2, "payrollNum", "");
  el(2, "amendmentNum", "");
  el(2, "forWeekEnding", forWeekEnding);
  line(2, "<CPR:employees>");
  for (const emp of employees) serializeEmployee(emp);
  line(2, "</CPR:employees>");
  line(1, "</CPR:payrollInfo>");
  out.push("</CPR:eCPR>");
  out.push("");
  return out.join("\n");

  function serializeEmployee(emp: EcprEmployee) {
    const ssn = emp.ssn.replace(/\D/g, "");
    if (ssn.length !== 9) throw new Error(`employee "${emp.name}": SSN must be 9 digits`);
    for (const day of emp.days)
      if (!isIsoDate(day.date)) throw new Error(`employee "${emp.name}": day date must be yyyy-mm-dd`);

    line(3, "<CPR:employee>");
    // id attribute: SSN::NAME with the name upper-cased (DIR rule 8);
    // element content keeps the original casing per the official sample
    line(4, `<CPR:name id="${esc(`${ssn}::${emp.name.toUpperCase()}`)}">${esc(emp.name)}</CPR:name>`);
    line(4, "<CPR:address>");
    el(5, "street", emp.address.street);
    el(5, "city", emp.address.city);
    el(5, "state", emp.address.state);
    el(5, "zip", emp.address.zip);
    line(4, "</CPR:address>");
    el(4, "ssn", ssn);
    el(4, "numWithholdingExemp", String(emp.numWithholdingExemp));
    el(4, "workClass", emp.workClass);
    line(4, "<CPR:payroll>");
    line(5, "<CPR:hrsWorkedEachDay>");
    emp.days.forEach((day, i) => {
      line(6, `<CPR:day id="${i + 1}">`);
      el(7, "date", day.date);
      el(7, "straightTime", fmtHours(day.straightTime));
      el(7, "overtime", fmtHours(day.overtime));
      el(7, "doubletime", fmtHours(day.doubletime));
      line(6, "</CPR:day>");
    });
    line(5, "</CPR:hrsWorkedEachDay>");
    const sum = (pick: (d: EcprDay) => number) => emp.days.reduce((a, d) => a + pick(d), 0);
    line(5, "<CPR:totHrs>");
    el(6, "totHrsStraightTime", fmtHours(sum((d) => d.straightTime)));
    el(6, "totHrsOvertime", fmtHours(sum((d) => d.overtime)));
    el(6, "totHrsDoubletime", fmtHours(sum((d) => d.doubletime)));
    line(5, "</CPR:totHrs>");
    line(5, "<CPR:hrlyPayRate>");
    el(6, "hrlyPayRateStraightTime", fmtMoney(emp.rateStraightTime));
    el(6, "hrlyPayRateOvertime", fmtMoney(emp.rateOvertime));
    el(6, "hrlyPayRateDoubletime", fmtMoney(emp.rateDoubletime));
    line(5, "</CPR:hrlyPayRate>");
    line(5, "<CPR:grossAmountEarned>");
    el(6, "thisProject", fmtMoney(emp.grossThisProject));
    el(6, "allWork", fmtMoney(emp.grossAllWork));
    line(5, "</CPR:grossAmountEarned>");
    const ded = emp.deductions ?? {};
    line(5, "<CPR:deductionsContribPay>");
    for (const f of DEDUCTION_FIELDS) el(6, f, fmtMoney(ded[f] ?? 0));
    const total = ded.total ?? DEDUCTION_FIELDS.reduce((a, f) => a + (ded[f] ?? 0), 0);
    el(6, "total", fmtMoney(total));
    el(6, "notes", ded.notes ?? "");
    line(5, "</CPR:deductionsContribPay>");
    line(4, "</CPR:payroll>");
    line(3, "</CPR:employee>");
  }
}

function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + delta)).toISOString().slice(0, 10);
}

// Bridge an extraction/generator EmployeeRow into an eCPR employee: dates the
// 7-day week ending at weekEnding (Mon-start, matching the WH-347 renderer)
// and applies the federal weekly-OT split. SSN/address/withholding are not on
// the WH-347 and must be supplied by the caller — DIR makes them mandatory.
export function ecprEmployeeFromRow(
  row: EmployeeRow,
  extras: { ssn: string; address: EcprAddress; numWithholdingExemp?: number; grossAllWork?: number },
  weekEnding: string,
): EcprEmployee {
  if (row.hourly_rate == null) throw new Error(`"${row.name}": hourly rate is required for eCPR`);
  if (!row.daily_hours) throw new Error(`"${row.name}": daily hours are required for eCPR`);
  const { st, ot } = splitDaily(row.daily_hours);
  const days: EcprDay[] = st.map((s, d) => ({
    date: addDays(weekEnding, -(6 - d)),
    straightTime: s,
    overtime: ot[d],
    doubletime: 0,
  }));
  const rate = row.hourly_rate;
  const stTotal = st.reduce((a, b) => a + b, 0);
  const otTotal = ot.reduce((a, b) => a + b, 0);
  const gross = row.gross_pay ?? +(stTotal * rate + otTotal * rate * 1.5).toFixed(2);
  return {
    name: row.name,
    ssn: extras.ssn,
    address: extras.address,
    numWithholdingExemp: extras.numWithholdingExemp ?? 0,
    workClass: row.classification ?? "",
    days,
    rateStraightTime: rate,
    rateOvertime: +(rate * 1.5).toFixed(2),
    rateDoubletime: +(rate * 2).toFixed(2),
    grossThisProject: gross,
    grossAllWork: extras.grossAllWork ?? gross,
  };
}
