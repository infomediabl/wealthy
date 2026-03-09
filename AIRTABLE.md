# Airtable Integration

## Table Name
`Leads` (configure via AIRTABLE_TABLE_NAME env var)

## When to Write

| Event | API call | Fields written |
|-------|----------|---------------|
| User submits email (Step 1) | POST /api/lead/email | email, created_at |
| User finishes quiz (Step 13 submit) | POST /api/lead/quiz | all quiz fields + risk_profile + risk_score |
| User submits personal info (Step 13) | POST /api/lead/profile | first_name, date_of_birth, city, phone, quiz_completed |

All three events PATCH the same record. The recordId returned on email capture is
passed in the request body of subsequent calls.

---

## Field Definitions

Create these fields in your Airtable base:

| Field Name | Airtable Type | Notes |
|------------|--------------|-------|
| `email` | Email | Captured on Step 1 |
| `created_at` | Date (include time) | Auto-set on record creation |
| `goal` | Single line text | Step 2 — e.g. "Penzija / mirovina" |
| `amount` | Single line text | Step 3 — free text, e.g. "500 KM" |
| `duration` | Single line text | Step 4 — e.g. "10 godina" |
| `source_of_funds` | Single line text | Step 5 |
| `personal_status` | Single line text | Step 6 |
| `monthly_income` | Single line text | Step 8 |
| `credit_obligations` | Single line text | Step 9 |
| `investment_knowledge` | Single line text | Step 10 |
| `investment_experience` | Single line text | Step 11 |
| `risk_percentage` | Single line text | Step 12 Q9 |
| `acceptable_drop` | Single line text | Step 12 Q10 |
| `risk_score` | Number | Computed score (7–35) |
| `risk_profile` | Single line text | e.g. "Uravnoteženi ulagač" |
| `first_name` | Single line text | Step 13 |
| `date_of_birth` | Date | Step 13 |
| `city` | Single line text | Step 13 |
| `phone` | Phone number | Step 13 (optional) |
| `quiz_completed` | Checkbox | Set to true after Step 13 submit |

---

## API Integration Notes

Use the Airtable REST API v0 directly (no SDK needed — keeps dependencies minimal).

### Create record (Step 1)
```
POST https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}
Authorization: Bearer {AIRTABLE_API_KEY}
Content-Type: application/json

{
  "fields": {
    "email": "user@example.com",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```
Response contains `id` — this is the recordId to store and reuse.

### Update record (Steps 13 quiz + profile)
```
PATCH https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}/{recordId}
Authorization: Bearer {AIRTABLE_API_KEY}
Content-Type: application/json

{
  "fields": {
    "goal": "...",
    ...
  }
}
```

---

## Setup Checklist
- [ ] Airtable base exists
- [ ] Table named `Leads` created with all fields above
- [ ] Airtable Personal Access Token generated with `data.records:read` and `data.records:write` scopes for the base
- [ ] `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_NAME` set in `.env`
