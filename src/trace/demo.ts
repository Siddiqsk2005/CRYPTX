export type Role = "VICTIM" | "INVESTIGATOR" | "ADMIN";
export type Risk = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type DemoCase = {
  id: string; fraudType: string; wallet: string; blockchain: string; risk: Risk; score: number;
  amount: string; vasp: string; confidence: number; status: string; createdAt: string; investigator: string;
  patterns: { name: string; severity: Risk; evidence: string; score: number }[];
};

export const DEMO_USERS = [
  { email: "victim@tracechain.demo", password: "Victim@123", name: "Priya Sharma", role: "VICTIM" as Role },
  { email: "investigator@tracechain.demo", password: "Investigator@123", name: "A. Verma", role: "INVESTIGATOR" as Role },
  { email: "admin@tracechain.demo", password: "Admin@123", name: "System Administrator", role: "ADMIN" as Role },
];

export const CASES: DemoCase[] = [
  { id: "TCIN-DEMO-001", fraudType: "Investment Scam", wallet: "0x1111111111111111111111111111111111111111", blockchain: "Ethereum", risk: "CRITICAL", score: 92, amount: "2.84 ETH", vasp: "Demo Exchange Alpha", confidence: 94, status: "VASP_IDENTIFIED", createdAt: "07 Sep 2026", investigator: "A. Verma", patterns: [
    { name: "Five-layer laundering path", severity: "CRITICAL", evidence: "Funds moved through five sequential intermediary wallets before a tagged destination.", score: 20 },
    { name: "Rapid fund movement", severity: "HIGH", evidence: "Six transfers completed in a 16-minute window.", score: 20 },
    { name: "High-value transfer", severity: "HIGH", evidence: "2.84 ETH exceeds the configured investigative threshold.", score: 10 },
    { name: "Multiple intermediaries", severity: "HIGH", evidence: "Five sequential non-custodial wallet layers were identified.", score: 10 },
  ] },
  { id: "TCIN-DEMO-002", fraudType: "Phishing", wallet: "0x2222222222222222222222222222222222222222", blockchain: "Ethereum", risk: "HIGH", score: 76, amount: "1.72 ETH", vasp: "Demo Exchange Beta", confidence: 91, status: "UNDER_ANALYSIS", createdAt: "06 Sep 2026", investigator: "A. Verma", patterns: [{ name: "Fan-out detected", severity: "HIGH", evidence: "Funds distributed to multiple counterparties.", score: 15 }, { name: "Rapid movement", severity: "HIGH", evidence: "Outgoing transfer 3 minutes after receipt.", score: 20 }] },
  { id: "TCIN-DEMO-003", fraudType: "Task Scam", wallet: "0x3333333333333333333333333333333333333333", blockchain: "Ethereum", risk: "HIGH", score: 68, amount: "4.31 ETH", vasp: "Unknown", confidence: 0, status: "UNDER_ANALYSIS", createdAt: "05 Sep 2026", investigator: "Unassigned", patterns: [{ name: "High transaction frequency", severity: "HIGH", evidence: "24 transfers observed within the analysis period.", score: 15 }] },
  { id: "TCIN-DEMO-004", fraudType: "Ransomware", wallet: "0x4444444444444444444444444444444444444444", blockchain: "Ethereum", risk: "CRITICAL", score: 96, amount: "8.65 ETH", vasp: "Demo Exchange Gamma", confidence: 96, status: "FREEZE_RECOMMENDED", createdAt: "04 Sep 2026", investigator: "N. Singh", patterns: [{ name: "Multi-hop layering", severity: "CRITICAL", evidence: "Four linked hops prior to VASP destination.", score: 20 }, { name: "Consolidation", severity: "HIGH", evidence: "Multiple inputs settled into one wallet.", score: 15 }] },
];

export const shortWallet = (wallet: string) => `${wallet.slice(0, 8)}...${wallet.slice(-6)}`;
export const riskClass = (risk: Risk) => ({ LOW: "low", MEDIUM: "medium", HIGH: "high", CRITICAL: "critical" }[risk]);

export const graphNodes = [
  { id: "victim", label: "Victim report", kind: "victim", x: 7, y: 50, detail: "Complaint reference CR-2026-1187" },
  { id: "suspect", label: "Suspect wallet", kind: "suspect", x: 19, y: 50, detail: "0x1111...1111 • Ethereum" },
  { id: "intermediary-a", label: "Layer 1", kind: "intermediary", x: 31, y: 29, detail: "0xAAAA...AAAA • Layer 1" },
  { id: "intermediary-b", label: "Layer 2", kind: "intermediary", x: 43, y: 68, detail: "0xBBBB...BBBB • Layer 2" },
  { id: "intermediary-c", label: "Layer 3", kind: "intermediary", x: 55, y: 29, detail: "0xCCCC...CCCC • Layer 3" },
  { id: "intermediary-d", label: "Layer 4", kind: "intermediary", x: 67, y: 68, detail: "0xDDDD...DDDD • Layer 4" },
  { id: "intermediary-e", label: "Layer 5", kind: "intermediary", x: 79, y: 29, detail: "0xEEEE...EEEE • Layer 5" },
  { id: "vasp", label: "Demo Exchange Alpha", kind: "vasp", x: 91, y: 50, detail: "Tagged VASP destination • 94% confidence" },
];
