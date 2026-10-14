<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- C4 — tách từ po-agent-bundle.md (skill po-metrics-analysis v1.3) -->

# Product Health Report — [Product Name] · [Period]

| **Period** | [Week of YYYY-MM-DD] / [Month of YYYY-MM] / [Q[N] YYYY] |
| --- | --- |
| **Author (PO)** | [Your name] |
| **Date sent** | [YYYY-MM-DD] |
| **Audience** | [Team / Leadership / CEO / Board / Investor] |
| **Previous report** | [Link] |

---

## 🎯 TL;DR

Read this section in 30 seconds.

1. **[Headline #1]**: [Most important metric movement with delta. E.g., "DAU grew 8% WoW to 145K — strongest week in 3 months."]
2. **[Headline #2]**: [Second most important. E.g., "D7 retention dropped from 32% → 29%; investigating tutorial change in v4.2."]
3. **[Headline #3]**: [Third item. E.g., "Daily Reward feature shipped to 100% Tuesday. Early signal positive on D1 retention."]
4. **[Risk or Ask]**: [E.g., "Need decision by Friday on whether to extend A/B test on monetization tier change."]

---

## 1. Headline Metrics

Show the metrics that matter most. Compare to previous period and same period last year (if available).

| **Metric** | **This period** | **Previous period** | **Δ vs prev** | **Same period last year** | **Δ YoY** | **Target** |
| --- | --- | --- | --- | --- | --- | --- |
| **DAU** | 145K | 134K | +8.2% 📈 | 98K | +48% | 150K |
| **MAU** | 850K | 820K | +3.7% 📈 | 620K | +37% | 900K |
| **D1 Retention** | 42% | 41% | +1pp | 38% | +4pp | 45% |
| **D7 Retention** | 29% | 32% | -3pp 📉 | 24% | +5pp | 32% |
| **D30 Retention** | 14% | 15% | -1pp | 11% | +3pp | 15% |
| **Stickiness (DAU/MAU)** | 17.1% | 16.3% | +0.8pp | 15.8% | +1.3pp | 18% |
| **Avg session length** | 8.2 min | 8.0 min | +2.5% | 7.5 min | +9% | 8 min |
| **Sessions per DAU** | 3.4 | 3.3 | +3% | 3.1 | +10% | 3.5 |
| **App rating (rolling 30d)** | 4.4 | 4.5 | -0.1 | 4.3 | +0.1 | 4.5 |
| **Crash-free rate** | 99.7% | 99.6% | +0.1pp | 99.5% | +0.2pp | ≥99.5% |

📈 = improved meaningfully · 📉 = regressed meaningfully · → = stable

---

## 2. What's Working

[2-4 items. Be specific, include numbers.]

### ✅ [Item 1 - e.g., DAU growth accelerating]
[1-3 sentences explanation. Why is this happening? What contributed?]

### ✅ [Item 2 - e.g., Tutorial completion rate up]
[Explanation]

### ✅ [Item 3]
[Explanation]

---

## 3. What's NOT Working

[2-4 items. Be honest. Don't hide bad news.]

### ⚠️ [Item 1 - e.g., D7 retention dropped 3pp]
**What we observed**: [Specific data. E.g., "D7 retention dropped from 32% to 29% over the past 2 weeks, driven primarily by Android users (US/BR markets)."]

**Hypothesis**: [E.g., "v4.2 tutorial change introduced friction in onboarding step 3. Analytics shows step 3 conversion dropped from 78% to 65%."]

**What we're doing**: [Specific action with owner and deadline. E.g., "Eng team reverting tutorial change in v4.2.1 hotfix shipping Thursday. PO will re-analyze D7 retention 2 weeks after rollout."]

### ⚠️ [Item 2]
[Same structure]

---

## 4. Shipped This Period

| **Feature** | **Release date** | **Rollout %** | **Status** | **Notes** |
| --- | --- | --- | --- | --- |
| [Daily Reward v1] | [YYYY-MM-DD] | 100% | ✅ Healthy | D1 retention +2pp, on track for D7 target |
| [Tutorial Refactor] | [YYYY-MM-DD] | 100% | ⚠️ Issue | Step 3 conversion dropped; hotfix in progress |
| [Crop Variety Pack] | [YYYY-MM-DD] | 50% (A/B test) | 🔬 Testing | Decision date: [YYYY-MM-DD] |

---

## 5. In Flight (Coming Next Period)

| **Feature** | **Stage** | **Target release** | **Risk level** |
| --- | --- | --- | --- |
| [Feature 1] | [Discovery / Spec / Build / QA / Beta] | [Date] | [Low/Med/High] |
| [Feature 2] | [Stage] | [Date] | [Low/Med/High] |
| [Feature 3] | [Stage] | [Date] | [Low/Med/High] |

---

## 6. Experiment Status

| **Experiment** | **Variant** | **Allocation** | **Days running** | **Current signal** | **Decision date** |
| --- | --- | --- | --- | --- | --- |
| [Daily reward escalation] | Control / Linear / Exponential | 33/33/33 | 14 | Exponential variant lifts D7 by 4pp (p=0.03) | [Date] |
| [Tutorial v3] | Control / Variant A | 50/50 | 7 | Too early, awaiting D7 cohort | [Date] |

---

## 7. Risks & Asks

[What does PO need from leadership/team? Be specific.]

### 🚨 Risks

#### [Risk 1]
**Description**: [What could go wrong, with impact estimate]
**Current mitigation**: [What we're doing]
**Help needed**: [What we need from this audience, if anything]

#### [Risk 2]
[Same structure]

### 🙋 Asks

#### [Ask 1]
**What we need**: [Specific decision, resource, or action]
**By when**: [Deadline]
**Why it matters**: [Consequence if not done]

#### [Ask 2]
[Same structure]

---

## 8. Deep Dive: [Topic of the Period]

> Each report should have ONE deep dive — a single area that warrants 2-3 paragraphs of detailed analysis. Rotate topics each report.

**Topic**: [E.g., "Why is D30 retention plateauing at 14% despite D7 improvements?"]

[2-4 paragraphs of analysis with data. Include 1-2 charts/tables. End with hypothesis and next steps.]

**Next steps**:
- [Action 1]
- [Action 2]

---

## 9. Glossary (for leadership audience)

> Include only if audience needs reminders. Optional for team-only reports.

- **DAU** — Daily Active Users (unique users opening app in a day)
- **MAU** — Monthly Active Users
- **Stickiness** — DAU/MAU; higher = users return more often
- **D1/D7/D30 Retention** — % of new users returning on day 1, 7, 30 after install
- **ARPDAU** — Average Revenue Per Daily Active User
- **pp** — percentage points (e.g., 32% → 29% = -3pp, not -3%)

---

## 10. Appendix

### Data sources
- Firebase Analytics console: [link]
- BigQuery dashboards: [link]
- App Store Connect / Play Console: [link]
- Internal BI: [link]

### Related reports
- Previous report: [link]
- Quarterly review: [link]
