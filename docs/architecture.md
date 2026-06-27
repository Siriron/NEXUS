# NEXUS Architecture

## Overview

NEXUS is a single-actor dApp. One submitter provides a GitHub repo + claim. No adversarial parties, no financial mechanics.

## Contract Storage

```python
audits: TreeMap[u256, AuditReport]  # audit_id → report
audit_count: u256                    # auto-incrementing ID
```

## Nondet Pipeline

```
leader_fn()
  → gl.nondet.web.get(raw_github_url/README.md)
  → gl.nondet.web.get(raw_github_url/src/index.ts)  # tries multiple candidates
  → gl.nondet.exec_prompt(structured_prompt)
  → returns "AUDIT=PASS|3|finding1;finding2|summary"

validator_fn(leader_result)
  → re-runs leader_fn() independently
  → compares verdict (exact match) + risk_score (±2 tolerance)
  → returns True/False
```

## Response Format

Pipe-delimited single line (more reliable than JSON for LLM output):
```
AUDIT=<verdict>|<risk_score>|<finding1>;<finding2>;<finding3>|<summary>
```

## Security

- All user inputs wrapped in BEGIN/END markers
- Inputs truncated before prompt injection surface (repo_url: 300 chars, claim: 500 chars)
- No admin functions, no owner, no upgradeable proxy
- All storage writes outside nondet block (GenLayer E025/E026 compliance)

## Frontend → Contract Flow

```
MetaMask (StudioNet 61999)
  → genlayer-js createClient({ chain: studionet, account })
  → writeContract({ functionName: 'submit_audit', value: BigInt(0) })
  → waitForTransactionReceipt({ status: FINALIZED, retries: 200 })
  → readContract({ functionName: 'get_all_audits' })
  → JSON.parse(result)
```
