# AI Capability Dashboard

A lightweight, browser-based, **aggregate dashboard** for examining patterns and trends in AI capability over time, grounded in the **CloudPedagogy AI Capability Framework**.

The AI Capability Signals Dashboard supports **sense-making, reflection, and governance-aligned conversation** about how AI capability is developing across an organisation — without surveillance, benchmarking, or individual assessment.

It is designed to help teams **notice patterns**, **surface tensions**, and **ask better questions**, not to measure performance or enforce compliance.

This tool is part of the **CloudPedagogy AI Capability Tools** suite.

---
## 🌐 Live Application

👉 http://cloudpedagogy-ai-capability-dashboard.s3-website.eu-west-2.amazonaws.com/

---
## 🛠️ Getting Started

### Clone the repository

```bash
git clone [repository-url]
cd [repository-folder]
```

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Once running, your terminal will display a local URL (often http://localhost:5173). Open this in your browser to use the application.

### Build for production

```bash
npm run build
```

The production build will be generated in the `dist/` directory and can be deployed to any static hosting service.

---

## 🔐 Privacy & Security

- **Fully local**: All data remains in the user's browser  
- **No backend**: No external API calls or database storage  
- **Privacy-preserving**: No tracking or data exfiltration  
- Suitable for use in sensitive organisational and governance contexts  

---

## What this application is

The AI Capability Signals Dashboard helps individuals, teams, and organisations:

- observe **aggregate patterns** in AI capability across the six framework domains  
- explore **trends over time**, rather than one-off snapshots  
- surface **imbalances or tensions** (e.g. innovation accelerating faster than governance)  
- support **leadership, governance, and strategic discussions** without performance anxiety  
- turn AI-related data into **reflection and dialogue**, not action-by-default  
- document shared understanding for committees, workshops, and reviews  

The tool is **capability-led, reflective, and interpretive**.  
It is explicitly designed to support **professional judgement**, not replace it.

---

## What this application is not

This tool is **not**:

- a monitoring or surveillance system  
- a performance dashboard or KPI tracker  
- a benchmarking or maturity-scoring tool  
- a compliance or audit instrument  
- a risk register or legal assessment  
- an automated decision-making or recommendation system  

All outputs are **signals, patterns, and prompts for discussion** — not verdicts or decisions.

---

## The AI Capability domains

The dashboard is grounded in the six interdependent domains of the CloudPedagogy AI Capability Framework:

### Awareness & Orientation  
Shared understanding, boundaries, risks, and realistic expectations of AI in context

### Human–AI Co-Agency  
Role clarity, partnership practices, human judgement in the loop, and responsible prompting

### Applied Practice & Innovation  
Practical use of AI in workflows, experimentation, iteration, and improvement of practice

### Ethics, Equity & Impact  
Fairness, inclusion, harm reduction, transparency, and downstream impact awareness

### Decision-Making & Governance  
Oversight, accountability, policy alignment, approvals, and decision hygiene

### Reflection, Learning & Renewal  
Review cycles, learning from experience, capability renewal, and institutional memory

These domains act as **lenses**, not checklists.

---

## How the tool works (user overview)

1. Enter basic context information (e.g. team, programme, or organisational unit; optional notes)  
2. Record **aggregate capability signals** across the six domains  
   - Signals may be derived from prior assessments, workshops, surveys, or agreed reflections  
   - No individual-level data is required or supported  
3. Optionally add **timepoints** to compare capability signals over time  
4. View the dashboard to explore:
   - domain-level patterns and trends  
   - emerging imbalances or tensions  
   - areas of acceleration, stagnation, or lag  
5. Use the built-in **reflective prompts** to support discussion, sense-making, and governance conversations  
6. Export or print summaries for committee papers, workshops, or documentation  

The tool is designed to be used **collectively and deliberatively**, not mechanically.

---

## Outputs

The AI Capability Signals Dashboard provides:

- aggregate domain profiles (no individual or unit drill-down)  
- trend visualisations over time  
- imbalance and tension indicators  
- explanatory “why this matters” context  
- structured discussion prompts for groups and committees  
- printable, shareable summaries for governance use  

---

## Typical use cases

- AI steering groups and working groups  
- Curriculum review and programme-level discussions  
- Research governance and ethics boards  
- Leadership workshops and away-days  
- Capability retrospectives and annual reviews  
- Cross-functional sense-making conversations  

The dashboard is especially effective in contexts where **trust, ethics, and accountability** matter.

---

## Data handling and privacy

- The application runs entirely client-side  
- No accounts, analytics, or tracking  
- No data is uploaded or transmitted  
- All inputs exist only within the user’s browser session  
- Clearing the browser resets the session  
- Suitable for static hosting (e.g. AWS S3)

The tool is explicitly designed to **avoid surveillance and performance monitoring**.

---

## Disclaimer

This repository contains exploratory, framework-aligned tools developed for reflection, learning, and discussion.

These tools are provided **as-is** and are not production systems, audits, or compliance instruments. Outputs are indicative only and should be interpreted in context using professional judgement.

All applications are designed to run locally in the browser. No user data is collected, stored, or transmitted.

---

## Licensing & Scope

This repository contains open-source software released under the MIT License.

CloudPedagogy frameworks and related materials are licensed separately and are not embedded or enforced within this software.

---

## About CloudPedagogy

CloudPedagogy develops open, governance-credible resources for building confident, responsible AI capability across education, research, and public service.

- Website: https://www.cloudpedagogy.com/
- Framework: https://github.com/cloudpedagogy/cloudpedagogy-ai-capability-framework
