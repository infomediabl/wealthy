# Postmark Email Integration

## When Sent
After the user submits personal info on Step 13.
Triggered by POST /api/lead/profile on the backend.

## Recipient
The **user** (their email captured on Step 1).

## Email Details

**From:** `noreply@advantiscapital.com` (or configured POSTMARK_FROM_EMAIL)  
**Subject:** `Vaš investicijski profil — Advantis Broker`  
**Message stream:** `outbound` (default transactional)

---

## Email HTML Template

The backend builds this HTML dynamically, injecting the user's profile data.

Variables to inject:
- `{{first_name}}` — from Step 13
- `{{profile_name}}` — e.g. "Uravnoteženi ulagač"
- `{{profile_description}}` — 2-3 sentence description from SCORING.md
- `{{stock_pct}}` — e.g. "50"
- `{{bond_pct}}` — e.g. "50"

### Template (Serbian, Ijekavica):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#0f1923; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f1923; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a2535; border-radius:12px; overflow:hidden; max-width:600px; width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:#0f1923; padding: 30px 40px; text-align:center; border-bottom: 1px solid #2a3a50;">
              <img src="https://advantisbroker.com/wp-content/uploads/2024/09/Advantis-logo.svg" 
                   alt="Advantis Broker" height="40" style="height:40px;">
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; color:#e8eaf0;">
              <p style="margin:0 0 10px 0; font-size:16px; color:#9aa5b8;">Pozdrav, {{first_name}}!</p>
              <h1 style="margin:0 0 20px 0; font-size:28px; color:#ffffff; font-weight:700;">
                Vaš investicijski profil je spreman
              </h1>
              <p style="margin:0 0 30px 0; font-size:16px; color:#9aa5b8; line-height:1.6;">
                Na osnovu vaših odgovora, utvrdili smo vaš investicijski profil:
              </p>
              
              <!-- Profile Card -->
              <div style="background:#0f1923; border:1px solid #C9A84C; border-radius:10px; padding:30px; margin-bottom:30px; text-align:center;">
                <p style="margin:0 0 8px 0; font-size:13px; text-transform:uppercase; letter-spacing:2px; color:#C9A84C;">
                  Vaš profil
                </p>
                <h2 style="margin:0 0 20px 0; font-size:32px; color:#ffffff; font-weight:700;">
                  {{profile_name}}
                </h2>
                <p style="margin:0; font-size:15px; color:#9aa5b8; line-height:1.7;">
                  {{profile_description}}
                </p>
              </div>
              
              <!-- Allocation -->
              <div style="background:#0f1923; border-radius:10px; padding:25px; margin-bottom:30px;">
                <p style="margin:0 0 15px 0; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#9aa5b8;">
                  Preporučena alokacija portfelja
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px 0; border-bottom:1px solid #2a3a50;">
                      <span style="color:#C9A84C; font-size:16px;">■</span>
                      <span style="color:#e8eaf0; font-size:15px; margin-left:10px;">Dionice</span>
                    </td>
                    <td style="text-align:right; padding:10px 0; border-bottom:1px solid #2a3a50;">
                      <strong style="color:#ffffff; font-size:15px;">{{stock_pct}}%</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color:#3a7bd5; font-size:16px;">■</span>
                      <span style="color:#e8eaf0; font-size:15px; margin-left:10px;">Obveznice i fondovi</span>
                    </td>
                    <td style="text-align:right; padding:10px 0;">
                      <strong style="color:#ffffff; font-size:15px;">{{bond_pct}}%</strong>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- CTA -->
              <p style="font-size:15px; color:#9aa5b8; line-height:1.6; margin-bottom:25px;">
                Naši stručnjaci u Advantis Brokeru mogu vam pomoći da realizujete ovu strategiju. 
                Razgovor je potpuno besplatan i bez obaveza.
              </p>
              <div style="text-align:center; margin-bottom:30px;">
                <a href="https://advantisbroker.com/kontakt" 
                   style="display:inline-block; background:#C9A84C; color:#0f1923; font-weight:700; 
                          font-size:16px; padding:16px 40px; border-radius:8px; text-decoration:none;">
                  Kontaktirajte nas →
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 25px 40px; border-top:1px solid #2a3a50; text-align:center;">
              <p style="margin:0; font-size:12px; color:#4a5a70; line-height:1.6;">
                Ova procjena je informativnog karaktera i ne predstavlja investicijski savjet.<br>
                © Advantis Broker d.o.o. | <a href="https://advantisbroker.com" style="color:#C9A84C;">advantisbroker.com</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Postmark API Call (Node.js)

```javascript
async function sendResultEmail({ toEmail, firstName, profileName, profileDescription, stockPct, bondPct }) {
  const html = buildEmailHtml({ firstName, profileName, profileDescription, stockPct, bondPct });

  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY
    },
    body: JSON.stringify({
      From: process.env.POSTMARK_FROM_EMAIL,
      To: toEmail,
      Subject: 'Vaš investicijski profil — Advantis Broker',
      HtmlBody: html,
      TextBody: `Pozdrav ${firstName}! Vaš investicijski profil: ${profileName}. ${profileDescription} Kontaktirajte nas: https://advantisbroker.com/kontakt`,
      MessageStream: 'outbound'
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Postmark error: ${JSON.stringify(err)}`);
  }

  return response.json();
}
```

---

## Setup Checklist
- [ ] Postmark account active, sender domain verified
- [ ] Server API token generated
- [ ] `POSTMARK_API_KEY` and `POSTMARK_FROM_EMAIL` set in `.env`
- [ ] Sender email matches verified sender signature in Postmark
