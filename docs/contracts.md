# NEXUS Smart Contract

**File:** `contracts/nexus.py`  
**Address:** `0xD2d27d4Ca5cD0F38461a991E1F290173c30C292f`  
**Network:** GenLayer Studio (Chain ID: 61999)  
**Deploy TX:** `0x0acea451ca423998a5cc1fd607ff35e1698707837e7c1adf495b49ea273c0672`

## Functions

### Write

#### `submit_audit(repo_url: str, claim: str) → None`
Submits a repository for auditing. Triggers the full nondet pipeline synchronously.
- Validates inputs (non-empty, claim ≤ 500 chars)
- Fetches README + source files via GitHub raw API
- Calls `exec_prompt` with structured, injection-hardened prompt
- Stores result in `audits[audit_count]`

### Read

#### `get_audit(audit_id: int) → str`
Returns a single audit as JSON string.

#### `get_all_audits(limit: int) → str`
Returns up to `limit` audits as a JSON array.

#### `get_total() → str`
Returns `{"total": "<count>"}`.

## AuditReport Fields

| Field | Type | Description |
|---|---|---|
| audit_id | u256 | Auto-incrementing ID |
| submitter | str | Wallet address |
| repo_url | str | GitHub repository URL |
| claim | str | Submitter's claim |
| verdict | str | PASS / FAIL / NEEDS_REVIEW |
| risk_score | u256 | 1 (low) to 10 (high) |
| findings | str | JSON array of strings |
| summary | str | One-sentence result summary |
| status | str | COMPLETE |
| created_at | str | Block timestamp |

## Patterns Used

- `@allow_storage + @dataclass` for all storage structs
- `TreeMap` for primary storage (never DynArray for key-value)
- All views return `str` via `json.dumps()`
- `gl.message_raw["datetime"]` for timestamps
- `gl.nondet.web.get(url).body.decode("utf-8")` for fetching
- Pipe-delimited prompt response (never `strict_eq` on LLM output)
- All storage writes outside nondet block
