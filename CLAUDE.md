# Advantis Quiz App — Claude Code Instructions

## Project Overview
A multi-step investment profile quiz for Advantis Broker (advantisbroker.com).
Users answer questions, get an investment risk profile, and are captured as leads in Airtable.
The completed quiz triggers a Postmark email to the user with their result.

**Live URL:** https://wealthy.advantiscapital.com  
**Brand reference:** https://advantisbroker.com  
**Logo:** https://advantisbroker.com/wp-content/uploads/2024/09/Advantis-logo.svg

---

## Tech Stack
- **Runtime:** Node.js (Express)
- **Frontend:** Plain HTML + CSS + Vanilla JS (no framework, no build step)
- **Backend:** Express API routes for Airtable and Postmark integrations
- **Deployment:** Single `node server.js` command, runs on any VPS or DO Droplet
- **No database** — Airtable is the only data store

## Project Structure to Build
```
advantis-quiz/
├── server.js              # Express server — serves static files + API routes
├── package.json
├── .env.example           # Template for environment variables
├── public/
│   ├── index.html         # Single-page quiz app (all steps in one HTML file)
│   ├── style.css          # All styles
│   └── quiz.js            # All frontend logic (step navigation, scoring, API calls)
└── README.md
```

## Environment Variables (see .env.example)
```
PORT=3000
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Leads
POSTMARK_API_KEY=your_postmark_api_key
POSTMARK_FROM_EMAIL=noreply@advantiscapital.com
```

---

## API Routes (server.js)

### POST /api/lead/email
Called on Step 1 when user submits email.
- Creates new Airtable record with email + timestamp
- Returns `{ recordId }` to frontend (stored in JS, used for subsequent updates)

### POST /api/lead/quiz
Called on Step 13 (after all quiz questions answered).
- Updates existing Airtable record (by recordId) with all quiz answers + computed risk profile
- Fields: goal, amount, duration, source_of_funds, personal_status, monthly_income,
  credit_obligations, investment_knowledge, investment_experience, risk_percentage,
  acceptable_drop, risk_profile, risk_score

### POST /api/lead/profile
Called on Step 13 when user submits name/DOB/city/phone.
- Updates Airtable record with: first_name, date_of_birth, city, phone
- Triggers Postmark email to user

### POST /api/send-email
Called internally by /api/lead/profile.
- Sends Postmark email to user containing their risk profile result

---

## Step-by-Step Flow

See FLOW.md for full details. Summary:
1. Landing + email capture
2. Goal selection
3–6. Questions 1–4 (amount, duration, source of funds, personal status)
7. Halfway congratulations screen
8–12. Questions 5–9 (income, credit, knowledge, experience, risk %)  
    + Question 10 combined on Step 12 (acceptable drop shown alongside risk %)
13. Personal info form (name, DOB, city, phone)
14. Strategy result page

---

## Scoring & Strategy Logic

See SCORING.md for full scoring details.
All scoring is done in `quiz.js` on the frontend — NO external API call needed.
Score is computed after Step 12, stored in JS variable, sent to server via /api/lead/quiz.

---

## Design Guidelines

- Match the look of https://advantisbroker.com — dark navy/charcoal background, gold/amber accent color (#C9A84C or similar), clean sans-serif font
- Logo: always shown in header, loaded from https://advantisbroker.com/wp-content/uploads/2024/09/Advantis-logo.svg
- Progress bar at top showing current step / total steps
- One question per screen (no scrolling needed on desktop)
- Mobile responsive — quiz must work on phone
- Smooth CSS transitions between steps (slide or fade)
- Step 14 (result): show profile name, donut chart (allocation), description, CTA button

---

## Language
All UI text in **Serbian, Latin script, Ijekavica** dialect.
Examples: "ulaganje" not "investicija" where natural, "prihodi" not "primanja" where formal, etc.
See FLOW.md for exact copy for each step.

---

## Important Implementation Notes

1. **recordId persistence** — store the Airtable record ID in a JS variable (not localStorage) after Step 1. Pass it with every subsequent API call so we PATCH the same record, not create duplicates.

2. **Email validation** — simple regex check before allowing progress past Step 1.

3. **Amount field** — free text input, store as string in Airtable (user types "500 KM" etc.)

4. **Step 12 combines Q9 + Q10** — show both risk-related questions on one screen to keep total visible steps at 12 before the personal info screen.

5. **No auth, no sessions** — pure frontend state. If user refreshes, they start over. This is acceptable for MVP.

6. **Donut chart** — implement using pure Canvas API or a small inline SVG — do NOT import a chart library to keep things simple.

7. **Phone number optional** — Step 13 phone field is not required.

8. **Error handling** — if Airtable/Postmark calls fail, log error but do NOT block user from proceeding. UX must never get stuck.
