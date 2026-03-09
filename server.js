require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------
// API Routes
// ---------------------

// Step 1 — Create lead with email
app.post('/api/lead/email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            email,
            created_at: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Airtable create error:', err);
      return res.status(500).json({ error: 'Failed to create lead' });
    }

    const data = await response.json();
    res.json({ recordId: data.id });
  } catch (err) {
    console.error('POST /api/lead/email error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Step 13 — Update lead with quiz answers + score
app.post('/api/lead/quiz', async (req, res) => {
  try {
    const { recordId, ...fields } = req.body;

    if (!recordId) {
      return res.status(400).json({ error: 'recordId is required' });
    }

    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Airtable quiz update error:', err);
      return res.status(500).json({ error: 'Failed to update quiz data' });
    }

    const data = await response.json();
    res.json({ success: true, recordId: data.id });
  } catch (err) {
    console.error('POST /api/lead/quiz error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Step 13 — Update lead with personal info + trigger email
app.post('/api/lead/profile', async (req, res) => {
  try {
    const { recordId, first_name, date_of_birth, city, phone, email, profileName, profileDescription, stockPct, bondPct } = req.body;

    if (!recordId) {
      return res.status(400).json({ error: 'recordId is required' });
    }

    // Build personal info fields
    const fields = {
      first_name,
      date_of_birth,
      city,
      quiz_completed: true,
    };
    if (phone) fields.phone = phone;

    // Update Airtable with personal info
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Airtable profile update error:', err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    // Trigger result email (non-blocking — don't let email failure block the response)
    if (email && profileName) {
      sendResultEmail({
        toEmail: email,
        firstName: first_name,
        profileName,
        profileDescription,
        stockPct,
        bondPct,
      }).catch((err) => console.error('Email send error:', err));
    }

    res.json({ success: true });
  } catch (err) {
    console.error('POST /api/lead/profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send result email via Postmark
app.post('/api/send-email', async (req, res) => {
  try {
    const { toEmail, firstName, profileName, profileDescription, stockPct, bondPct } = req.body;

    await sendResultEmail({ toEmail, firstName, profileName, profileDescription, stockPct, bondPct });

    res.json({ success: true });
  } catch (err) {
    console.error('POST /api/send-email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ---------------------
// Email Helper
// ---------------------

function buildEmailHtml({ firstName, profileName, profileDescription, stockPct, bondPct }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#f5f5f7; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; max-width:600px; width:100%; border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background:#ffffff; padding: 30px 40px; text-align:center; border-bottom: 1px solid #e5e7eb;">
              <img src="https://advantisbroker.com/wp-content/uploads/2024/09/Advantis-logo.svg"
                   alt="Advantis Broker" height="40" style="height:40px;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; color:#212121;">
              <p style="margin:0 0 10px 0; font-size:16px; color:#6b7280;">Pozdrav, ${firstName}!</p>
              <h1 style="margin:0 0 20px 0; font-size:28px; color:#0e0e0e; font-weight:700;">
                Vaš investicijski profil je spreman
              </h1>
              <p style="margin:0 0 30px 0; font-size:16px; color:#6b7280; line-height:1.6;">
                Na osnovu vaših odgovora, utvrdili smo vaš investicijski profil:
              </p>

              <!-- Profile Card -->
              <div style="background:#f5f5f7; border:2px solid #EE7B2B; border-radius:10px; padding:30px; margin-bottom:30px; text-align:center;">
                <p style="margin:0 0 8px 0; font-size:13px; text-transform:uppercase; letter-spacing:2px; color:#EE7B2B;">
                  Vaš profil
                </p>
                <h2 style="margin:0 0 20px 0; font-size:32px; color:#0e0e0e; font-weight:700;">
                  ${profileName}
                </h2>
                <p style="margin:0; font-size:15px; color:#6b7280; line-height:1.7;">
                  ${profileDescription}
                </p>
              </div>

              <!-- Allocation -->
              <div style="background:#f5f5f7; border-radius:10px; padding:25px; margin-bottom:30px;">
                <p style="margin:0 0 15px 0; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#6b7280;">
                  Preporučena alokacija portfelja
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 10px 0; border-bottom:1px solid #e5e7eb;">
                      <span style="color:#EE7B2B; font-size:16px;">■</span>
                      <span style="color:#212121; font-size:15px; margin-left:10px;">Dionice</span>
                    </td>
                    <td style="text-align:right; padding:10px 0; border-bottom:1px solid #e5e7eb;">
                      <strong style="color:#0e0e0e; font-size:15px;">${stockPct}%</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0;">
                      <span style="color:#3a7bd5; font-size:16px;">■</span>
                      <span style="color:#212121; font-size:15px; margin-left:10px;">Obveznice i fondovi</span>
                    </td>
                    <td style="text-align:right; padding:10px 0;">
                      <strong style="color:#0e0e0e; font-size:15px;">${bondPct}%</strong>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA -->
              <p style="font-size:15px; color:#6b7280; line-height:1.6; margin-bottom:25px;">
                Naši stručnjaci u Advantis Brokeru mogu vam pomoći da realizujete ovu strategiju.
                Razgovor je potpuno besplatan i bez obaveza.
              </p>
              <div style="text-align:center; margin-bottom:30px;">
                <a href="https://advantisbroker.com/kontakt"
                   style="display:inline-block; background:#EE7B2B; color:#ffffff; font-weight:700;
                          font-size:16px; padding:16px 40px; border-radius:8px; text-decoration:none;">
                  Kontaktirajte nas →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 25px 40px; border-top:1px solid #e5e7eb; text-align:center;">
              <p style="margin:0; font-size:12px; color:#9ca3af; line-height:1.6;">
                Ova procjena je informativnog karaktera i ne predstavlja investicijski savjet.<br>
                © Advantis Broker d.o.o. | <a href="https://advantisbroker.com" style="color:#EE7B2B;">advantisbroker.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendResultEmail({ toEmail, firstName, profileName, profileDescription, stockPct, bondPct }) {
  const html = buildEmailHtml({ firstName, profileName, profileDescription, stockPct, bondPct });

  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY,
    },
    body: JSON.stringify({
      From: process.env.POSTMARK_FROM_EMAIL,
      To: toEmail,
      Subject: 'Vaš investicijski profil — Advantis Broker',
      HtmlBody: html,
      TextBody: `Pozdrav ${firstName}! Vaš investicijski profil: ${profileName}. ${profileDescription} Kontaktirajte nas: https://advantisbroker.com/kontakt`,
      MessageStream: 'outbound',
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Postmark error: ${JSON.stringify(err)}`);
  }

  return response.json();
}

// ---------------------
// Start Server
// ---------------------

app.listen(PORT, () => {
  console.log(`Advantis Quiz server running on http://localhost:${PORT}`);
});

module.exports = app;
