# Design System

## Brand Reference
https://advantisbroker.com — dark, professional financial aesthetic.

## Colours
```css
/* Backgrounds */
--bg-primary:    #0f1923;   /* main dark background */
--bg-secondary:  #1a2535;   /* card / container background */
--bg-tertiary:   #243040;   /* input fields, hover states */

/* Accent */
--gold:          #C9A84C;   /* primary CTA, highlights, borders on focus */
--gold-light:    #e8c96e;   /* hover state on gold */

/* Text */
--text-primary:  #ffffff;
--text-secondary:#e8eaf0;
--text-muted:    #9aa5b8;
--text-disabled: #4a5a70;

/* Semantic */
--border:        #2a3a50;
--blue-accent:   #3a7bd5;   /* used for bond/safe allocation in charts */
--success:       #2ecc71;
--error:         #e74c3c;
```

## Typography
```css
font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;

/* Load Inter from Google Fonts */
/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"> */

--font-xs:    12px;
--font-sm:    14px;
--font-base:  16px;
--font-lg:    18px;
--font-xl:    24px;
--font-2xl:   32px;
--font-3xl:   40px;
```

## Spacing
Use multiples of 8px: 8, 16, 24, 32, 40, 48, 64.

## Border Radius
- Cards/containers: 12px
- Buttons: 8px
- Pills/tags: 100px (full round)
- Inputs: 8px

## Logo
```html
<img src="https://advantisbroker.com/wp-content/uploads/2024/09/Advantis-logo.svg" 
     alt="Advantis Broker" class="logo">
```
Height: 36px on desktop, 28px on mobile. Always on dark background.

## Components

### Progress Bar
```
[████████░░░░░░░░░░░] Step 4 / 12
```
- Full width at top of screen (below header)
- Gold fill (#C9A84C), dark track (#243040)
- Height: 4px
- Small text below or above: "Korak 4 od 12"

### Question Card
- Background: `--bg-secondary`
- Padding: 40px (desktop), 24px (mobile)
- Border-radius: 12px
- Max-width: 640px, centered
- Label above question (uppercase, muted, letter-spacing 2px, gold)
- Question text: 22px, white, font-weight 600

### Option Buttons (single select)
- Default: background `--bg-tertiary`, border `--border`, text `--text-secondary`
- Hover: border `--gold`, text `--text-primary`
- Selected: background `rgba(201,168,76,0.15)`, border `--gold`, text `--text-primary`, gold checkmark icon
- Border-radius: 10px
- Padding: 14px 20px
- Full width for list-style options
- Grid 2–3 cols for pill/icon options

### Primary Button
```css
.btn-primary {
  background: #C9A84C;
  color: #0f1923;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #e8c96e; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
```

### Text Input
```css
.input-field {
  background: #243040;
  border: 1.5px solid #2a3a50;
  border-radius: 8px;
  color: #ffffff;
  font-size: 16px;
  padding: 14px 18px;
  width: 100%;
  transition: border-color 0.2s;
}
.input-field:focus {
  outline: none;
  border-color: #C9A84C;
}
.input-field::placeholder { color: #4a5a70; }
```

## Layout

### Quiz Shell
```
┌─────────────────────────────┐
│ [Logo]           [Step X/12]│  Header — fixed height 64px
├─────────────────────────────┤
│ ████████░░░░░░░░░░░░░░░░░  │  Progress bar — 4px
├─────────────────────────────┤
│                             │
│   ┌───────────────────┐     │
│   │   Question Card   │     │  Centered, vertically + horizontally
│   └───────────────────┘     │
│        [Continue →]         │
│                             │
└─────────────────────────────┘
```

Max content width: 640px, horizontally centered.
Min viewport height for card area: calc(100vh - 64px - 4px).
Vertically center card with flexbox.

## Animations / Transitions
- Step transition: fade out current step (opacity 0, translateX -20px), fade in next (opacity 1, translateX 0)
- Duration: 250ms ease
- Option select: instant border/bg change (no delay)

## Mobile
- Breakpoint: 640px
- Full-width card with 16px side padding
- Stacked layout
- Touch-friendly option buttons: min height 52px
- Bottom-anchored CTA button on very small screens

## Step 14 — Result Page Specific
- Profile name: 36px, white, bold, centered
- Donut chart: 200px diameter, centered, canvas element
- Allocation legend: horizontal pill badges below chart
- Description: 16px, muted, max-width 480px, centered
- CTA button: prominent, gold, centered, min-width 220px

## Accessibility
- All interactive elements keyboard navigable
- Selected state communicated via aria-pressed or aria-selected
- Form inputs have associated labels
- Sufficient colour contrast (gold on dark: passes AA)
