import { jsPDF } from "jspdf";
import type { DemoCase } from "./demo";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 16;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

type ReportType = "INVESTIGATION_REPORT" | "VASP_FREEZE_REQUEST" | "DEMO_FREEZE_RECORD";

function createDocument(type: ReportType) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 18;
  let page = 1;
  const generatedAt = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  const header = () => {
    doc.setFillColor(7, 19, 30);
    doc.rect(0, 0, PAGE_WIDTH, 15, "F");
    doc.setTextColor(73, 221, 207);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TRACECHAIN-IN", MARGIN, 9);
    doc.setTextColor(209, 229, 236);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("CRYPTO FRAUD INTELLIGENCE", MARGIN + 34, 9);
    doc.text("SYNTHETIC DEMO DATA", PAGE_WIDTH - MARGIN, 9, { align: "right" });
  };
  const footer = () => {
    doc.setDrawColor(190, 208, 216);
    doc.line(MARGIN, 282, PAGE_WIDTH - MARGIN, 282);
    doc.setTextColor(91, 117, 130);
    doc.setFontSize(7);
    doc.text("TRACECHAIN-IN - Investigative decision support. Not a legal determination.", MARGIN, 287);
    doc.text(`Page ${page}`, PAGE_WIDTH - MARGIN, 287, { align: "right" });
  };
  const nextPage = () => { footer(); doc.addPage(); page += 1; y = 24; header(); };
  const space = (needed: number) => { if (y + needed > 278) nextPage(); };
  const text = (value: string, size = 9, color: [number, number, number] = [43, 64, 76], indent = 0, gap = 5) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.setTextColor(...color);
    const lines = doc.splitTextToSize(value, CONTENT_WIDTH - indent);
    space(lines.length * (size * 0.48) + gap);
    doc.text(lines, MARGIN + indent, y);
    y += lines.length * (size * 0.48) + gap;
  };
  const title = (value: string, accent = false) => {
    space(15); doc.setTextColor(accent ? 173 : 7, accent ? 82 : 44, accent ? 63 : 59); doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text(value, MARGIN, y); y += 7;
    doc.setDrawColor(accent ? 173 : 65, accent ? 82 : 209, accent ? 63 : 195); doc.setLineWidth(0.5); doc.line(MARGIN, y, MARGIN + 34, y); y += 7;
  };
  const section = (value: string) => { space(11); doc.setFillColor(231, 243, 245); doc.roundedRect(MARGIN, y - 5, CONTENT_WIDTH, 8, 1, 1, "F"); doc.setTextColor(11, 58, 72); doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text(value.toUpperCase(), MARGIN + 3, y); y += 8; };
  const field = (label: string, value: string) => { space(10); doc.setTextColor(88, 113, 126); doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.text(label.toUpperCase(), MARGIN, y); doc.setTextColor(29, 51, 64); doc.setFont("helvetica", "normal"); doc.setFontSize(9); const lines = doc.splitTextToSize(value, 116); doc.text(lines, 75, y); y += Math.max(7, lines.length * 4.5); };
  const bullet = (value: string) => { space(8); doc.setFillColor(69, 221, 207); doc.circle(MARGIN + 2, y - 1.2, 1, "F"); text(value, 8.5, [43, 64, 76], 6, 3); };
  header();
  return { doc, type, generatedAt, text, title, section, field, bullet, footer, setY: (next: number) => { y = next; } };
}

function addCaseDetails(api: ReturnType<typeof createDocument>, c: DemoCase) {
  const { doc, title, section, field, text, bullet } = api;
  title(api.type === "INVESTIGATION_REPORT" ? "INVESTIGATION REPORT" : api.type === "DEMO_FREEZE_RECORD" ? "DEMO ASSET PRESERVATION HOLD RECORD" : "DRAFT VASP / FREEZE REQUEST", api.type !== "INVESTIGATION_REPORT");
  doc.setTextColor(105, 133, 145); doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(`Report ID: ${api.type === "INVESTIGATION_REPORT" ? "RPT" : "VFR"}-${c.id.replace("TCIN-", "")}`, MARGIN, 40);
  doc.text(`Generated: ${api.generatedAt}`, PAGE_WIDTH - MARGIN, 40, { align: "right" });
  if (api.type === "VASP_FREEZE_REQUEST") {
    doc.setFillColor(255, 244, 225); doc.roundedRect(MARGIN, 46, CONTENT_WIDTH, 11, 2, 2, "F"); doc.setTextColor(143, 80, 15); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text("DRAFT - FOR INVESTIGATOR REVIEW. THIS DOCUMENT IS NOT AUTOMATICALLY SENT.", MARGIN + 4, 52); api.setY(63);
  } else if (api.type === "DEMO_FREEZE_RECORD") {
    doc.setFillColor(226, 248, 236); doc.roundedRect(MARGIN, 46, CONTENT_WIDTH, 11, 2, 2, "F"); doc.setTextColor(24, 111, 71); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text("DEMO HOLD RECORDED - NO LIVE ASSETS WERE FROZEN OR TRANSFERRED.", MARGIN + 4, 52); api.setY(63);
  } else api.setY(48);

  section("1. Case information");
  field("Case ID", c.id); field("Fraud type", c.fraudType); field("Investigation status", c.status.replace(/_/g, " ")); field("Assigned investigator", c.investigator); field("Data source", "SYNTHETIC DEMO DATA - demonstration only");
  section("2. Complaint summary");
  text("Victim-reported suspect wallet received in connection with a synthetic demonstration complaint. The case supports an investigative workflow demonstration and does not assert real-world wrongdoing or ownership.");
  section("3. Suspect wallet");
  field("Reported address", c.wallet); field("Blockchain", c.blockchain); field("Approximate reported amount", c.amount); field("Wallet validation", "Valid Ethereum-format address in the synthetic demo dataset");
  section("4. Transaction summary");
  field("Incoming funds", "2.84 ETH"); field("Outgoing funds", "2.78 ETH"); field("Observed synthetic transfers", "7 linked transactions across a five-layer trace"); field("Counterparties", "Victim report, 5 intermediary wallets, 1 attributed VASP destination");
  section("5. Fund flow");
  text("Victim report -> Suspect Wallet -> Layer 1 -> Layer 2 -> Layer 3 -> Layer 4 -> Layer 5 -> Demo Exchange Alpha", 9, [11, 58, 72]);
  field("Hop 0", "Victim report -> Suspect wallet | 2.84 ETH | 10:21 AM | 0xD3MO...A001");
  field("Layer 1", "Suspect wallet -> Intermediary Wallet A | 2.84 ETH | 10:24 AM | 0xD3MO...A002");
  field("Layer 2", "Intermediary Wallet A -> Intermediary Wallet B | 2.83 ETH | 10:27 AM | 0xD3MO...A003");
  field("Layer 3", "Intermediary Wallet B -> Intermediary Wallet C | 2.82 ETH | 10:30 AM | 0xD3MO...A004");
  field("Layer 4", "Intermediary Wallet C -> Intermediary Wallet D | 2.80 ETH | 10:33 AM | 0xD3MO...A005");
  field("Layer 5", "Intermediary Wallet D -> Intermediary Wallet E | 2.79 ETH | 10:36 AM | 0xD3MO...A006");
  field("Destination", "Intermediary Wallet E -> Demo Exchange Alpha | 2.78 ETH | 10:40 AM | 0xD3MO...A007");
  section("6. Intermediary wallets");
  field("Layer 1 - Wallet A", "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA - analytical intermediary layer 1"); field("Layer 2 - Wallet B", "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB - analytical intermediary layer 2"); field("Layer 3 - Wallet C", "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC - analytical intermediary layer 3"); field("Layer 4 - Wallet D", "0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD - analytical intermediary layer 4"); field("Layer 5 - Wallet E", "0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE - analytical intermediary layer 5");
  section("7. VASP attribution");
  field("Possible destination", c.vasp); field("Attribution confidence", `${c.confidence}%`); field("Attribution classification", c.confidence ? "PROBABLE ATTRIBUTION - SYNTHETIC DEMO ATTRIBUTION" : "UNKNOWN");
  text("Attribution describes an analytical association only. It does not establish ownership of the source wallet and must be independently reviewed.", 8, [113, 85, 33]);
  if (api.type === "VASP_FREEZE_REQUEST" || api.type === "DEMO_FREEZE_RECORD") {
    section("8. Five-layer preservation / freeze recommendation");
    field("Trace depth reviewed", "Five intermediary wallet layers plus a possible VASP destination");
    field("Evidence chain", "0xD3MO...A002 through 0xD3MO...A007 - all synthetic demo transaction records");
    field("Requested action", api.type === "DEMO_FREEZE_RECORD" ? "A simulated asset-preservation hold has been recorded for the 2.78 ETH synthetic destination balance, pending authorized VASP/legal review." : "Preserve relevant transaction and account records; review appropriate asset-preservation or freezing measures under applicable authority.");
    text(api.type === "DEMO_FREEZE_RECORD" ? "This record confirms only a demonstration action. TRACECHAIN-IN has not contacted a VASP or frozen any real asset." : "This is a draft recommendation for authorized investigator review. TRACECHAIN-IN does not send requests or freeze assets automatically.", 8, [143, 80, 15]);
  }
  section("8. Risk analysis");
  field("Risk score", `${c.score} / 100`); field("Risk level", c.risk); text("The score is generated by deterministic, explainable rules. It is an analytical indicator and not a legal determination.");
  c.patterns.forEach((pattern) => bullet(`+${pattern.score} ${pattern.name} (${pattern.severity}): ${pattern.evidence}`));
  section("9. Suspicious patterns");
  c.patterns.forEach((pattern) => field(`${pattern.severity} - ${pattern.name}`, pattern.evidence));
  section("10. Cross-chain activity");
  text("No confirmed cross-chain continuation is present in this synthetic scenario. Any potential bridge or wrapped-asset correlation would be shown as a possible continuation, not as certainty.");
  section("11. Transaction evidence");
  ["0xD3MO...A001 - Funds received - 10:21 AM - SYNTHETIC DEMO TRANSACTION", "0xD3MO...A002 - Layer 1 transfer - 10:24 AM - SYNTHETIC DEMO TRANSACTION", "0xD3MO...A003 - Layer 2 transfer - 10:27 AM - SYNTHETIC DEMO TRANSACTION", "0xD3MO...A004 - Layer 3 transfer - 10:30 AM - SYNTHETIC DEMO TRANSACTION", "0xD3MO...A005 - Layer 4 transfer - 10:33 AM - SYNTHETIC DEMO TRANSACTION", "0xD3MO...A006 - Layer 5 transfer - 10:36 AM - SYNTHETIC DEMO TRANSACTION", "0xD3MO...A007 - Deposit at possible VASP destination - 10:40 AM - SYNTHETIC DEMO TRANSACTION"].forEach((e) => bullet(e));
  section("12. Investigator notes");
  text("No additional notes recorded in the demonstration dataset. Investigator review is required before relying on, sharing, or acting on this material.");
  section("13. Recommended actions");
  ["Preserve the complete five-layer transaction evidence and investigation audit trail.", "Review the attribution confidence and underlying VASP label.", "Prepare an appropriate VASP information request for investigator review.", "Consider asset-preservation or freezing procedures only after authorized review of the five-layer evidence chain.", "Continue monitoring downstream addresses where legally authorized."].forEach(bullet);
  section("14. Audit information");
  field("Event log", `CASE_VIEWED; WALLET_ANALYZED; ${api.type === "INVESTIGATION_REPORT" ? "REPORT_GENERATED" : "FREEZE_REQUEST_GENERATED"}`); field("Generated by", c.investigator); field("Timestamp", api.generatedAt);
}

export function downloadInvestigationPdf(caseData: DemoCase) {
  const api = createDocument("INVESTIGATION_REPORT");
  addCaseDetails(api, caseData); api.footer(); api.doc.save(`${caseData.id}-investigation-report.pdf`);
}

export function downloadVaspRequestPdf(caseData: DemoCase) {
  const api = createDocument("VASP_FREEZE_REQUEST");
  addCaseDetails(api, caseData); api.footer(); api.doc.save(`${caseData.id}-draft-vasp-freeze-request.pdf`);
}

export function downloadDemoFreezeRecordPdf(caseData: DemoCase) {
  const api = createDocument("DEMO_FREEZE_RECORD");
  addCaseDetails(api, caseData); api.footer(); api.doc.save(`${caseData.id}-demo-asset-preservation-hold.pdf`);
}
