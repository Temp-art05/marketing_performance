<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- C3 — tách từ po-agent-bundle.md (skill po-metrics-analysis v1.3) -->

# Analysis Report — [Feature Name]

| **Document Version** | v1.0 |
| --- | --- |
| **Author (PO)** | [Your name] |
| **Date** | [YYYY-MM-DD] |
| **Feature release date** | [YYYY-MM-DD] |
| **Days post-release at analysis** | [N days] |
| **Related PRD** | [Link] |
| **Related Metrics Plan** | [Link] |
| **Data sources** | [Firebase Analytics console, BigQuery, internal BI, App Store reviews] |
| **Analysis window** | [YYYY-MM-DD to YYYY-MM-DD] |

---

## 🎯 Recommendation

> **DECISION: 🟢 SCALE / 🟡 ITERATE / 🔴 KILL**

[1-2 sentence summary of the decision and why. This is the TL;DR — stakeholders read this first.]

**Confidence level**: [High / Medium / Low] — [brief reason]

**Next steps**:
1. [Concrete action item with owner]
2. [Concrete action item with owner]
3. [Concrete action item with owner]

---

## 1. Hypothesis Recap

### What we predicted
> **If we** [built X], **then** [primary metric] **would** [change by Y], **because** [reasoning].

### What we measured
| **Aspect** | **Predicted** | **Actual** | **Delta** |
| --- | --- | --- | --- |
| Primary metric | [Target value] | [Observed value] | [+/- delta, % change] |
| Direction | [Increase/Decrease] | [Same/Opposite] | [Match/Miss] |

---

## 2. Primary Metric Result

| **Attribute** | **Value** |
| --- | --- |
| **Metric** | [Name] |
| **Baseline (pre-launch)** | [X] |
| **Target** | [Y (delta from baseline)] |
| **Observed** | [Z (delta from baseline)] |
| **Verdict** | ✅ Hit / ⚠️ Partial / ❌ Miss |
| **Statistical significance** | [p-value if available, or "directional only — N too small for significance"] |
| **Sample size** | [N users in test cohort, N in control if A/B test] |

### Chart / Visualization
[Embed chart image OR describe: "D7 retention for new installs, weeks since launch. Trend visible from week 2."]

### Context & caveats
[Explain confounders: holiday season, parallel marketing campaign, app store update, other releases. What might have influenced the number aside from this feature?]

---

## 3. Secondary Metrics Health Check

| **Metric** | **Baseline** | **Acceptable** | **Observed** | **Status** |
| --- | --- | --- | --- | --- |
| [Crash-free rate] | [99.7%] | [≥ 99.6%] | [99.5%] | ⚠️ Warning |
| [D1 Retention] | [42%] | [≥ 41%] | [42.5%] | ✅ OK |
| [Session length median] | [8 min] | [≥ 7.5 min] | [8.2 min] | ✅ OK |
| [ARPDAU] | [$0.18] | [≥ $0.17] | [$0.19] | ✅ OK |

[Any 🔴 or ⚠️ status → deep-dive in §5 below]

---

## 4. Segment Analysis

How does the feature perform across different user groups?

### 4.1 By install cohort
| **Cohort** | **Sample size** | **Primary metric** | **Notes** |
| --- | --- | --- | --- |
| New users (D0-D7 install) | [N] | [Value] | [Observation] |
| Returning users (existing pre-launch) | [N] | [Value] | [Observation] |
| Reactivated (churned, came back) | [N] | [Value] | [Observation] |

### 4.2 By platform
| **Platform** | **Sample size** | **Primary metric** | **Notes** |
| --- | --- | --- | --- |
| iOS | [N] | [Value] | [Any divergence from Android?] |
| Android | [N] | [Value] | [Any divergence from iOS?] |

### 4.3 By geography (top markets)
| **Country** | **Sample size** | **Primary metric** | **Notes** |
| --- | --- | --- | --- |
| [VN] | [N] | [Value] | [Observation] |
| [US] | [N] | [Value] | [Observation] |
| [ID] | [N] | [Value] | [Observation] |
| [BR] | [N] | [Value] | [Observation] |
| [IN] | [N] | [Value] | [Observation] |

### 4.4 By user progression
| **User segment** | **Sample size** | **Primary metric** | **Notes** |
| --- | --- | --- | --- |
| Early game (level 1-10) | [N] | [Value] | [Observation] |
| Mid game (level 11-50) | [N] | [Value] | [Observation] |
| Late game (level 51+) | [N] | [Value] | [Observation] |

**Key segment insight**: [What's the most important finding across segments? E.g., "Feature lifts retention 10pp in early-game users but only 2pp in late-game — suggests onboarding hook works but progression value is weak."]

---

## 5. Deep Dives (for warnings/anomalies)

### 5.1 [Issue 1 — e.g., Crash rate warning]

**What we observed**: [Crash-free rate dropped from 99.7% → 99.5% in week 2 post-launch.]

**Investigation**:
- Crashlytics shows new crash in [stack trace, function]
- Affects [N]% of users on [iOS version X / Android version Y]
- Triggered by [specific user action — e.g., tapping reward modal when offline]

**Root cause hypothesis**: [Likely cause based on evidence]

**Mitigation**: [Hotfix in v[X.Y+1] / monitoring increased / accepted risk because limited population]

### 5.2 [Issue 2 — if any]

[Repeat structure]

---

## 6. Funnel Analysis

Conversion at each step of the feature flow.

| **Step** | **Users** | **% of previous step** | **% of total** | **Drop-off vs target** |
| --- | --- | --- | --- | --- |
| 1. App opened | [N] | 100% | 100% | - |
| 2. Feature visible | [N] | [%] | [%] | [observation] |
| 3. Feature opened | [N] | [%] | [%] | [observation] |
| 4. Core action taken | [N] | [%] | [%] | [observation] |
| 5. Goal reached | [N] | [%] | [%] | [observation] |

**Biggest drop-off**: [Step X → Step Y, dropped from Z% to W%. Hypothesis why.]

**Recommended action**: [E.g., "Reduce friction in step 3 by removing intermediate modal."]

---

## 7. Retention Curves

Show D1/D7/D30 retention for users exposed to feature vs control (or vs pre-launch baseline).

| **Day** | **Pre-launch baseline** | **Post-launch cohort** | **Delta** |
| --- | --- | --- | --- |
| D1 | [42%] | [44%] | [+2pp] |
| D3 | [33%] | [36%] | [+3pp] |
| D7 | [25%] | [32%] | [+7pp ✅ hit target] |
| D14 | [18%] | [22%] | [+4pp] |
| D30 | [12%] | [14%] | [+2pp] |

**Curve shape observation**: [Where does the lift come from? E.g., "Lift primarily in D3-D7 window, suggesting feature drives habit formation in week 1. After D14, lift diminishes — feature may need stronger long-term hook."]

---

## 8. Qualitative Signals

Numbers alone don't tell full story. What are users saying?

### App Store / Play Store reviews
- **Rating change**: [4.5 → 4.4, -0.1 from pre-launch baseline]
- **New reviews mentioning feature**: [N reviews]
- **Top positive themes**: [Bullet list]
- **Top negative themes**: [Bullet list]
- **Sample positive review**: > "[Quote with date]"
- **Sample negative review**: > "[Quote with date]"

### Support tickets
- **Tickets mentioning feature**: [N tickets in window]
- **% of total tickets**: [X%]
- **Top issue categories**: [Bullets]

### Social listening / Community
- [Discord/Reddit/Twitter sentiment notes]

---

## 9. What We Got Right

[Bulleted list of predictions that proved correct, design decisions that worked]
- [Item 1]
- [Item 2]
- [Item 3]

---

## 10. What We Got Wrong

[Bulleted list — be honest. What did we predict that didn't happen? What did we miss?]
- [Item 1]
- [Item 2]
- [Item 3]

---

## 11. Decision & Justification

### Decision: [🟢 SCALE / 🟡 ITERATE / 🔴 KILL]

**Decision criteria from Metrics Plan**:
- [Criterion 1]: [Met / Not met] — [evidence]
- [Criterion 2]: [Met / Not met] — [evidence]
- [Criterion 3]: [Met / Not met] — [evidence]

### Rationale
[2-4 sentences justifying the decision. Reference data, not opinion.]

### What this means
- **Engineering**: [What dev team needs to do next]
- **Design**: [What design team needs to do next]
- **Marketing**: [Should we promote? Should we hide?]
- **Stakeholders**: [Any communication needed?]

---

## 12. Next Actions

| **Action** | **Owner** | **Deadline** | **Success Criteria** |
| --- | --- | --- | --- |
| [Action 1] | [Name] | [Date] | [How we know it's done] |
| [Action 2] | [Name] | [Date] | [How we know it's done] |
| [Action 3] | [Name] | [Date] | [How we know it's done] |

---

## 13. Open Questions for Next Iteration

[List things we want to investigate further — leads for next cycle]
- [Question 1: e.g., "Why does feature lift not extend past D14? Is it satiation?"]
- [Question 2]
- [Question 3]

---

## 14. Appendix

### A. Data quality notes
[Any caveats about the data — incomplete tracking in first 2 days, missing iOS data, etc.]

### B. Query references
[Links to BigQuery queries used, Looker dashboards, etc.]

### C. Related analyses
[Links to other relevant analyses or context docs]
