# Investigation workflow

1. A victim registers a report with the fraud type, suspect wallet, blockchain, amount, optional transaction hash and narrative.
2. The system validates the address and creates a `TCIN-2026-######` case reference. The included demo journey uses `TCIN-DEMO-001` for explicitly synthetic records.
3. An investigator runs tracing at an authorized depth. The trace service records source, destination, asset, amount, timestamp, hash and hop.
4. The rule engine emits explainable signals: layering, rapid movement, fan-in/out, high-value and intermediary-wallet behaviour.
5. VASP intelligence distinguishes confirmed attribution, probable attribution, analytical cluster and unknown. Behaviour alone never proves ownership.
6. The investigator reviews the graph, evidence timeline and risk signals, adds notes, then creates a report or a **DRAFT — FOR INVESTIGATOR REVIEW** request.
7. Important actions are recorded in the audit log. The platform recommends actions but makes no automatic legal decision.
