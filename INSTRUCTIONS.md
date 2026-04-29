# AI Capability Dashboard — User Instructions

---
### 2. What This Tool Does
This dashboard aggregates individual capability assessments into a system-wide view. It provides leadership with a bird's-eye view of organizational AI readiness, highlighting broad trends, strong domains, and institutional weaknesses.

---
### 3. Role in the Ecosystem
- **Phase:** Phase 3 — Capability System
- **Role:** Multi-stakeholder view of capability benchmarks and trends.
- **Reference:** [../SYSTEM_OVERVIEW.md](../SYSTEM_OVERVIEW.md)

---
### 4. When to Use This Tool
- When you need to understand the big picture of AI capability across multiple teams.
- When reporting to committees or leadership on the progress of AI literacy initiatives.
- To switch to "Reflective Mode" to generate discussion prompts based on aggregate data.

---
### 5. Inputs
- Takes aggregated datasets of JSON files produced by the **Capability Assessment** tool.

---
### 6. How to Use (Step-by-Step)
1. Load your institutional or departmental assessment dataset.
2. View the overall distribution across the six core capability domains.
3. Check the "Institutional Insights" panel to immediately determine the mathematically strongest and weakest domains.
4. Switch the interface from "Descriptive" to "Reflective" mode.
5. Review the 'Signals Workspace' to access guided discussion prompts based on the detected patterns.

---
### 7. Key Outputs
- High-level, aggregated visualizations of systemic capability marked as Low, Developing, or Strong.
- Actionable discussion prompts for leadership based on the data shape.

---
### 8. How It Connects to Other Tools
- **Upstream:** Consumes data entirely produced by the **Capability Assessment** tool.
- **Downstream:** Signals identified here usually trigger deep-dives using the **Gaps & Risk** diagnostic tool.

---
### 9. Limitations
- Does not identify the specific individuals failing or succeeding; it relies on aggregate patterns to protect privacy.
- It is a descriptive engine and does not prescribe specific policy fixes.

---
### 10. Tips
- Always use the "Reflective" mode during meetings to turn dry data into productive inquiries.

---
### 11. Capability and Governance

**What the tool does**
This tool allows users to aggregate capability datasets and explore macro patterns across six core AI domains, translating numeric trends into reflective prompts.

**How capability is developed through use**
Capability is not developed by simply viewing the data, but through the structured sense-making and dialog that occurs when users interact with the dashboard's reflective modes. The interface guides teams to interpret systemic patterns together.

**How governance is supported**
Governance is supported by making the rationale and context behind the data visible. This ensures that the insights drawn from the dashboard are critically analyzed and bounded by documented constraints, avoiding automated assumptions.

**Explanation of optional fields**
The tool provides optional fields (e.g., Capability Notes, Governance Notes) allowing users to document specific assumptions, risks, and rationale related to the data or their interpretation of it. These fields exist to ensure that the human judgement and context surrounding the insights are explicitly captured and reviewable.
