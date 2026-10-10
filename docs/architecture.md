# TRACECHAIN-IN architecture

The browser application is designed as a role-based investigative workspace. Its shipped demo dataset is deliberately separate from the live provider boundary so a presentation is reliable without claiming synthetic data is live.

```text
Victim report → Complaint API → Investigation → Provider / trace service
                                      ↓                 ↓
                                  Risk engine ← transaction graph → VASP attribution
                                      ↓
                              report + draft request + audit log
```

`BlockchainProvider` abstracts balance, transaction, transfer, transaction-detail and timestamp lookup. Ethereum and Bitcoin adapters can be swapped for Polygon, BNB Chain, Tron or Solana adapters without changing the investigation workflow. The rule engine remains deterministic; a future ML scorer can contribute a separately-labelled supplementary signal.

Prisma models cover users, complaints, investigations, wallets, transactions, VASPs, risk assessments/signals, notes, alerts, reports and audit logs. Indexed lookup keys include wallet address, transaction hash, case ID, blockchain, timestamp and VASP wallet address.

Live integrations are placeholders until configured and should never be presented as active otherwise.
