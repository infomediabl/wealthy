# Screen-by-Screen Flow & Copy

Language: Serbian, Latin script, Ijekavica

---

## Step 1 — Landing Page + Email

**Header:** Advantis logo (top left)  
**Progress:** No progress bar on this step

**Headline:**  
`Otkrijte koja investicijska strategija odgovara vama`

**Subheadline:**  
`Za samo 3 minute odgovorite na nekoliko pitanja i dobijte personalizovanu preporuku ulaganja — potpuno besplatno.`

**What to expect box (3 bullet icons):**
- 📋 12 kratkih pitanja o vašim ciljevima i finansijskoj situaciji
- 🔒 Vaši podaci su sigurni i neće biti dijeljeni trećim stranama
- 🎯 Personalizovana strategija na osnovu vašeg profila

**Input:**  
Label: `Vaša e-mail adresa`  
Placeholder: `ime@email.com`  
Button: `Počnite kviz →`

**On submit:** Validate email, POST /api/lead/email, store recordId, proceed to Step 2.

---

## Step 2 — Goal Selection

**Progress bar:** 1/12  
**Label above question:** `VAŠI CILJEVI`

**Question:**  
`Koji je vaš primarni cilj ulaganja?`

**Options (icon cards, single select):**
| Ikona | Tekst |
|-------|-------|
| 🎓 | Školovanje djece |
| 🏖️ | Penzija / mirovina |
| 🏠 | Kupovina nekretnine |
| 🛡️ | Hitni fond |
| ✈️ | Putovanje i slobodne aktivnosti |
| 💰 | Generalna štednja |
| 🚀 | Pokretanje biznisa |

**Button:** `Nastavi →`

---

## Step 3 — Question 1: Amount

**Progress bar:** 2/12  
**Label:** `POČETNO ULAGANJE`

**Question:**  
`Koliko planiraš jednokratno uplatiti za početak ovog ulaganja?`

**Input:** Free text field  
Placeholder: `npr. 500 KM`  
Helper text: `Unesite okvirni iznos u KM`

**Button:** `Nastavi →`

---

## Step 4 — Question 2: Duration

**Progress bar:** 3/12  
**Label:** `VREMENSKI HORIZONT`

**Question:**  
`Koliko dugo planiraš ulagati za odabrani cilj?`

**Options (single select, pill/button style):**
- 1 godina
- 2 godine
- 5 godina
- 10 godina
- 20 godina
- 25 godina

**Button:** `Nastavi →`

---

## Step 5 — Question 3: Source of Funds

**Progress bar:** 4/12  
**Label:** `IZVOR SREDSTAVA`

**Question:**  
`Koji je najveći izvor sredstava namijenjenih za ovo ulaganje?`

**Options (single select, list style):**
- Dohodak od nesamostalnog rada
- Dohodak od samostalne djelatnosti
- Dohodak od imovine i imovinskih prava
- Dohodak od kapitala
- Dohodak od osiguranja
- Ostalo (stipendije, nasljedstva, naknade i slično)

**Button:** `Nastavi →`

---

## Step 6 — Question 4: Personal Status

**Progress bar:** 5/12  
**Label:** `LIČNI STATUS`

**Question:**  
`Koji je vaš trenutni lični status?`

**Options (single select):**
- Zaposlenik
- Poduzetnik
- Nezaposlen
- Umirovljenik
- Učenik / student
- Ostalo

**Button:** `Nastavi →`

---

## Step 7 — Halfway Break Screen

**Progress bar:** hidden or frozen at 5/12  
**No back button**

**Visual:** Animated checkmark or progress illustration

**Headline:**  
`Odlično! Na pola ste puta! 🎉`

**Body:**  
`Odgovorili ste na prva pitanja. Još nekoliko koraka i imat ćete potpunu sliku vašeg investicijskog profila.`

**Subtext:**  
`Sljedeća pitanja odnose se na vašu finansijsku situaciju i sklonost prema riziku.`

**Button:** `Nastavi dalje →`

---

## Step 8 — Question 5: Monthly Income

**Progress bar:** 6/12  
**Label:** `FINANSIJSKA SITUACIJA`

**Question:**  
`Koji su vaši ukupni prihodi na mjesečnom nivou (od rada, nekretnina, investicija i sl.)?`

**Options (single select):**
- Ispod 700,00 KM
- 700,00 – 1.500,00 KM
- 1.500,00 – 2.000,00 KM
- 2.000,00 – 3.000,00 KM
- Iznad 3.000,00 KM

**Button:** `Nastavi →`

---

## Step 9 — Question 6: Credit Obligations

**Progress bar:** 7/12  
**Label:** `KREDITNE OBVEZE`

**Question:**  
`Kakve su vaše trenutne kreditne obveze?`

**Options (single select):**
- Nemam kreditne obveze
- Mjesečna obveza je zanemariva u odnosu na primanja
- Mjesečna obveza iznosi oko trećine primanja
- Mjesečna obveza iznosi oko polovice primanja
- Mjesečna obveza je veća od polovice primanja

**Button:** `Nastavi →`

---

## Step 10 — Question 7: Knowledge

**Progress bar:** 8/12  
**Label:** `POZNAVANJE INSTRUMENATA`

**Question:**  
`Kako biste ocijenili svoje poznavanje jednostavnih investicijskih instrumenata (investicijski fondovi, obveznice, dionice i sl.)?`

**Options (single select):**
- Izvrsno
- Vrlo dobro
- Dobro
- Površno
- Ne poznajem

**Button:** `Nastavi →`

---

## Step 11 — Question 8: Experience

**Progress bar:** 9/12  
**Label:** `ISKUSTVO S ULAGANJEM`

**Question:**  
`Koliko se često baviš investiranjem?`

**Options (single select):**
- Svakodnevno
- Jednom miesečno
- Nekoliko puta godišnje
- Jednom godišnje ili rjeđe
- Nemam nikakvo iskustvo

**Button:** `Nastavi →`

---

## Step 12 — Questions 9 + 10: Risk Preference (combined screen)

**Progress bar:** 10/12  
**Label:** `SKLONOST RIZIKU`

**Question A:**  
`Koliki procenat investicije želiš izdvojiti za investiranje s potencijalno višim prinosom i višim rizikom?`

**Options A (single select, pill style):**
- 0 – 20%
- 20 – 40%
- 40 – 60%
- 60 – 80%
- 80 – 100%

**Divider**

**Question B:**  
`Koliki privremeni pad vrijednosti investicije ti ne bi predstavljao veći problem?`

**Options B (single select, pill style):**
- Do 5%
- Do 10%
- Do 20%
- Do 30%
- Do 40%

**Button:** `Nastavi →` (requires both answered)

---

## Step 13 — Personal Info Form

**Progress bar:** 11/12  
**No question label**

**Headline:**  
`Hvala vam na strpljenju! 🙏`

**Body:**  
`Dok pripremamo vašu personalizovanu strategiju, molimo vas da popunite još nekoliko podataka kako bismo mogli da vam se javimo.`

**Form fields:**
- Ime i prezime* (required) — placeholder: `Vaše ime i prezime`
- Datum rođenja* (required) — date picker
- Grad* (required) — placeholder: `Grad u kojem živite`
- Broj telefona (optional) — placeholder: `+387...` — helper: `Neobavezno — ostavite ako želite da vas kontaktiramo telefonom`

**Button:** `Pogledaj moju strategiju →`

**On submit:** POST /api/lead/quiz (quiz answers + score + profile), then POST /api/lead/profile (personal info + triggers email), then show Step 14.

---

## Step 14 — Strategy Result

**Progress bar:** 12/12 (or hidden)

**Top section:**  
`Vaš investicijski profil:`  
**[PROFILE NAME in large text]**  
e.g. `Uravnoteženi ulagač`

**Donut chart:** Shows portfolio allocation (e.g. 50% dionice / 50% obveznice)
Chart legend below with colored squares + labels + percentages.

**Profile description:**  
2–3 sentence description of the profile (see SCORING.md for text per profile)

**Allocation breakdown box:**  
Simple table or card:  
| Klasa imovine | Udio |
|---|---|
| Dionice | 50% |
| Obveznice i fondovi | 50% |

**CTA Section:**  
Headline: `Spremi ste za sljedeći korak?`  
Body: `Naši stručnjaci u Advantis Brokeru mogu vam pomoći da realizujete ovu strategiju. Razgovor je potpuno besplatan.`  
Button (primary, gold): `Kontaktirajte nas →` — links to `https://advantisbroker.com/kontakt` (or whichever contact URL)  
Button (secondary, outlined): `Pošalji strategiju na e-mail` — triggers /api/send-email manually if needed (optional)

**Footer note:**  
`Ova procjena je informativnog karaktera i ne predstavlja investicijski savjet. Za personalizovane preporuke kontaktirajte licenciranog investicijskog savjetnika.`
