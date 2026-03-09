# Scoring Logic & Investment Profiles

## Overview

Scoring is computed entirely in the frontend (`quiz.js`) after Step 12.
No API call to any AI model — pure deterministic point calculation.

---

## Scored Questions & Point Values

Only 7 of the 10 questions are scored. Questions 1 (amount), 3 (source of funds),
and 4 (personal status) are captured for the lead record but do NOT affect the score.

### Q2 — Investment Duration
| Answer | Points |
|--------|--------|
| 1 godina | 1 |
| 2 godine | 2 |
| 5 godina | 3 |
| 10 godina | 4 |
| 20 godina | 5 |
| 25 godina | 5 |

### Q5 — Monthly Income
| Answer | Points |
|--------|--------|
| Ispod 700,00 KM | 1 |
| 700,00 – 1.500,00 KM | 2 |
| 1.500,00 – 2.000,00 KM | 3 |
| 2.000,00 – 3.000,00 KM | 4 |
| Iznad 3.000,00 KM | 5 |

### Q6 — Credit Obligations
| Answer | Points |
|--------|--------|
| Nemam kreditne obveze | 5 |
| Zanemariva obveza | 4 |
| Oko trećine primanja | 3 |
| Oko polovice primanja | 2 |
| Više od polovice primanja | 1 |

### Q7 — Investment Knowledge
| Answer | Points |
|--------|--------|
| Izvrsno | 5 |
| Vrlo dobro | 4 |
| Dobro | 3 |
| Površno | 2 |
| Ne poznajem | 1 |

### Q8 — Investment Experience
| Answer | Points |
|--------|--------|
| Svakodnevno | 5 |
| Jednom miesečno | 4 |
| Nekoliko puta godišnje | 3 |
| Jednom godišnje ili rjeđe | 2 |
| Nemam nikakvo iskustvo | 1 |

### Q9 — % for High Risk
| Answer | Points |
|--------|--------|
| 80 – 100% | 5 |
| 60 – 80% | 4 |
| 40 – 60% | 3 |
| 20 – 40% | 2 |
| 0 – 20% | 1 |

### Q10 — Acceptable Temporary Drop
| Answer | Points |
|--------|--------|
| Do 40% | 5 |
| Do 30% | 4 |
| Do 20% | 3 |
| Do 10% | 2 |
| Do 5% | 1 |

---

## Score Range
- **Minimum:** 7 points
- **Maximum:** 35 points

---

## Investment Profiles

### Profile 1 — Konzervativni ulagač
**Score range:** 7–13  
**Tagline:** Sigurnost iznad svega  
**Allocation:**
- Obveznice i novčani fondovi: 80%
- Dionice: 20%

**Description:**  
Preferirate sigurnost i stabilnost kapitala. Imate nizak apetit prema riziku i kratkoročne ili nepredvidive potrebe za sredstvima. Vaš portfolio je fokusiran na očuvanje vrijednosti uz skromne, ali stabilne prinose.

**Chart colours:** Blue (80%) + Amber (20%)

---

### Profile 2 — Umjereno konzervativni ulagač
**Score range:** 14–19  
**Tagline:** Stabilnost s blagim rastom  
**Allocation:**
- Obveznice i novčani fondovi: 60%
- Dionice: 40%

**Description:**  
Cijenite sigurnost, ali ste spremni prihvatiti umjereni rizik za nešto bolje prinose. Preferirate stabilnost, ali razumijete da određena izloženost dionicama može poboljšati dugoročne rezultate.

**Chart colours:** Blue (60%) + Amber (40%)

---

### Profile 3 — Uravnoteženi ulagač
**Score range:** 20–25  
**Tagline:** Balans između rasta i sigurnosti  
**Allocation:**
- Dionice: 50%
- Obveznice i fondovi: 50%

**Description:**  
Tražite ravnotežu između rasta i zaštite kapitala. Prihvatate umjerene tržišne oscilacije i razumijete da kratkoročni padovi mogu biti dio dugoročnog rasta. Vaš horizont ulaganja vam daje prostor za oporavak.

**Chart colours:** Amber (50%) + Blue (50%)

---

### Profile 4 — Umjereno agresivni ulagač
**Score range:** 26–30  
**Tagline:** Rast kao prioritet  
**Allocation:**
- Dionice: 70%
- Obveznice i fondovi: 30%

**Description:**  
Fokusirani ste na dugoročni rast kapitala i spremni ste podnijeti značajnije tržišne oscilacije. Imate dobro razumijevanje tržišta i dovoljno dugačak vremenski horizont da prebrodite eventualne padove.

**Chart colours:** Amber (70%) + Blue (30%)

---

### Profile 5 — Agresivni ulagač
**Score range:** 31–35  
**Tagline:** Maksimalni rast, visoki rizik  
**Allocation:**
- Dionice: 90%
- Obveznice i fondovi: 10%

**Description:**  
Cilj vam je maksimizacija dugoročnog rasta kapitala. Imate visoku toleranciju na rizik, dobro poznajete tržište i prihvatate da vrijednost portfelja može privremeno značajno pasti. Investirate s jasnim dugoročnim fokusom.

**Chart colours:** Amber (90%) + Blue (10%)

---

## JavaScript Scoring Function

```javascript
function computeScore(answers) {
  const durationMap = {
    '1 godina': 1, '2 godine': 2, '5 godina': 3,
    '10 godina': 4, '20 godina': 5, '25 godina': 5
  };
  const incomeMap = {
    'Ispod 700,00 KM': 1, '700,00 – 1.500,00 KM': 2,
    '1.500,00 – 2.000,00 KM': 3, '2.000,00 – 3.000,00 KM': 4,
    'Iznad 3.000,00 KM': 5
  };
  const creditMap = {
    'Nemam kreditne obveze': 5,
    'Zanemariva obveza': 4,
    'Oko trećine primanja': 3,
    'Oko polovice primanja': 2,
    'Više od polovice primanja': 1
  };
  const knowledgeMap = {
    'Izvrsno': 5, 'Vrlo dobro': 4, 'Dobro': 3, 'Površno': 2, 'Ne poznajem': 1
  };
  const experienceMap = {
    'Svakodnevno': 5, 'Jednom miesečno': 4, 'Nekoliko puta godišnje': 3,
    'Jednom godišnje ili rjeđe': 2, 'Nemam nikakvo iskustvo': 1
  };
  const riskPctMap = {
    '80 – 100%': 5, '60 – 80%': 4, '40 – 60%': 3, '20 – 40%': 2, '0 – 20%': 1
  };
  const dropMap = {
    'Do 40%': 5, 'Do 30%': 4, 'Do 20%': 3, 'Do 10%': 2, 'Do 5%': 1
  };

  const score =
    (durationMap[answers.duration] || 0) +
    (incomeMap[answers.monthly_income] || 0) +
    (creditMap[answers.credit_obligations] || 0) +
    (knowledgeMap[answers.investment_knowledge] || 0) +
    (experienceMap[answers.investment_experience] || 0) +
    (riskPctMap[answers.risk_percentage] || 0) +
    (dropMap[answers.acceptable_drop] || 0);

  return score;
}

function getProfile(score) {
  if (score <= 13) return 'konzervativni';
  if (score <= 19) return 'umjereno-konzervativni';
  if (score <= 25) return 'uravnotezeni';
  if (score <= 30) return 'umjereno-agresivni';
  return 'agresivni';
}
```
