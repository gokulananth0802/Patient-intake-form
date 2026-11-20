# Patient Record Entry — Chrome Extension Test Target

A mock hospital patient-history intake application built with Vite and React. It exposes predictable, controlled React form fields, simulates a 1-second late-rendering SPA mount, displays live React state as formatted JSON, and persists saved patient records to `localStorage`.

## Getting Started

```bash
npm install
npm run dev
```

- **Local development URL (standard Vite default)**: `http://localhost:5173` *(Note: in the AI Studio workspace container, `package.json` runs `vite --port=3000` so the live preview is served at `http://localhost:3000`; run `npx vite --port 5173` if your extension manifest strictly matches port `5173`.)*

## Target Form Field IDs

Your Chrome extension should target these exact element IDs and names (all inputs are controlled React components associated with `<label htmlFor>`):

| Label | Element | `id` | `name` | Required |
|---|---|---|---|---|
| Patient Name | `input type="text"` | `patient-name` | `name` | Yes |
| Date of Birth | `input type="date"` | `patient-dob` | `dateOfBirth` | Yes |
| Allergies | `textarea` | `patient-allergies` | `allergies` | No |
| Current Medications | `textarea` | `patient-medications` | `currentMedications` | No |
| Reason for Visit | `textarea` | `patient-reason` | `reasonForVisit` | Yes |

Additional realistic optional fields (ignored by the extension, also controlled React inputs):
- **Gender** (`select`, `id="patient-gender"`, `name="gender"`)
- **Phone** (`input type="tel"`, `id="patient-phone"`, `name="phone"`)
- **Insurance ID** (`input type="text"`, `id="patient-insurance-id"`, `name="insuranceId"`)

## Late-Rendering SPA Simulation

On initial page load (and whenever you click **Replay 1s Load** in the top bar), the app renders a `"Loading patient record…"` skeleton for **1 second (1000ms)** before mounting the form fields. This verifies your extension's wait-for-field / `MutationObserver` logic.

## Extension Test Checklist

1. Load the extension and open this site.
2. Upload the sample intake form (**Daniel Hughes**, DOB **04/12/1985**, allergy **penicillin**, **Lisinopril 10mg daily**, **persistent cough 2 weeks**).
3. Click **"Fill it"**.
4. Confirm all 5 fields show the values **AND** the **"Form State (live)"** panel matches.
5. Click **Save Record** and confirm it appears in the **Saved Records** table (and persists across page reload).
