<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- C1 — tách từ po-agent-bundle.md (skill po-metrics-analysis v1.3) -->

# Metrics Plan — [Feature Name]

| **Document Version** | v1.0 |
| --- | --- |
| **Status** | Draft / Approved / In Production |
| **Owner (PO)** | [Your name] |
| **Last Updated** | [YYYY-MM-DD] |
| **Related PRD** | [Link to PRD] |
| **Related Tracking Spec** | [Link to Tracking_Spec doc] |
| **Target Release** | [vX.Y / Sprint N / Q[N] YYYY] |
| **Measurement Window** | [N weeks post-launch, e.g., "4 weeks after GA"] |

---

## 1. Hypothesis & Business Outcome

### 1.1 Hypothesis
> **If we** [build/change] [thing], **then** [metric] **will** [increase/decrease] **by** [magnitude], **because** [reasoning about user behavior].

### 1.2 Business outcome this feature drives
[1-2 sentences. Which company-level metric or strategic goal does this feature support? E.g., "Supports Q3 OKR of D7 retention 25% → 35% to enable ads inventory growth."]

### 1.3 User outcome this feature delivers
[1-2 sentences from user's perspective. E.g., "User finds reason to return daily, building habit in week 1 post-install."]

---

## 2. Primary Success Metric

This is THE number we'll judge the feature by. Only ONE primary metric.

| **Attribute** | **Value** |
| --- | --- |
| **Metric name** | [e.g., D7 Retention Rate (new install cohort)] |
| **Definition (math)** | [Exact formula. E.g., "Users who open app on day 7 after install / Total install cohort on day 0"] |
| **Cohort filter** | [E.g., "New users installed in last 7 days, opened app ≥1 time"] |
| **Baseline (current)** | [E.g., 25%] |
| **Baseline source** | [How we know baseline. E.g., "Firebase Analytics 30-day rolling avg, Mar 1 - Mar 31, 2026"] |
| **Target** | [E.g., 32% (+7pp absolute)] |
| **Target rationale** | [Why this number? Benchmark/competitor data/internal model. E.g., "Industry benchmark for daily-reward mechanic: +5-10pp lift; targeting middle of range"] |
| **Measurement window** | [E.g., 4 weeks post-launch] |
| **Significance threshold** | [E.g., "Statistically significant at p<0.05, requires sample N ≥ 5000 per cohort"] |

---

## 3. Secondary Metrics (Health Indicators)

Metrics that MUST NOT regress. If any goes below acceptable range, treat as a problem regardless of primary metric.

| **Metric** | **Current** | **Acceptable Range** | **Why monitor** |
| --- | --- | --- | --- |
| [Crash-free rate] | [99.7%] | [≥ 99.6%] | Feature must not break stability |
| [D1 Retention] | [42%] | [≥ 41% (no >5% relative drop)] | Don't break top-of-funnel |
| [Session length (median)] | [8 min] | [≥ 7.5 min] | Don't fragment sessions |
| [Time-to-first-action] | [25s] | [≤ 30s] | Don't slow down core flow |
| [App size] | [85 MB] | [≤ 90 MB] | Don't bloat install size |
| [Average FPS in core gameplay] | [58] | [≥ 55] | Don't degrade performance |

---

## 4. Counter-Metrics (Do NOT Optimize)

Explicitly metrics we do NOT want to game. Track but don't optimize.

| **Metric** | **Why NOT optimize** |
| --- | --- |
| [Total session count per user] | [Could lead to fragmenting sessions artificially, bad for ad inventory] |
| [App opens per day] | [Could lead to dark-pattern push notifications] |
| [Clicks on feature CTA] | [Vanity metric — doesn't equal value delivered] |

---

## 5. Segments to Analyze

Don't just look at aggregate — slice by these segments to find hidden patterns.

| **Segment** | **Why segment** |
| --- | --- |
| New users (D0-D7 install) vs Returning users | Feature may impact new vs existing users differently |
| Free users vs Paying users | Paying users may have different sensitivity |
| iOS vs Android | Platform differences common |
| Country: [Top 5 markets, e.g., VN, US, ID, BR, IN] | Geo behavior varies |
| User level/progression | Early-game vs mid-game vs late-game users may react differently |

---

## 6. Decision Criteria

Defined BEFORE launch to avoid moving goalposts.

After [measurement window], we will:

### 🟢 SCALE (roll out to 100%, invest in v2)
**All** of the following must be true:
- Primary metric meets or exceeds target ([≥ 32% D7 retention])
- No secondary metric regresses below acceptable range
- No critical bugs/crashes attributable to feature

### 🟡 ITERATE (keep at current rollout %, fix and re-test)
**Any** of the following:
- Primary metric moves in right direction but doesn't hit target ([27% ≤ D7 < 32%])
- One secondary metric in warning zone (5-10% regression)
- Specific segment underperforms while others succeed

### 🔴 KILL (roll back, don't ship)
**Any** of the following:
- Primary metric does not move or moves opposite direction after 4 weeks
- Any secondary metric regresses >10%
- Critical bugs that cannot be fixed quickly
- Strong negative user feedback (>5% increase in support tickets, ≥0.3 drop in App Store rating)

---

## 7. Analysis Cadence

| **Day post-launch** | **Action** | **Owner** |
| --- | --- | --- |
| Day 1 | Tracking sanity check (events firing? data flowing?) | PO + Dev |
| Day 3 | Early signal check (any catastrophic regression?) | PO |
| Day 7 | First milestone review (D1 retention available for first cohort) | PO + Team |
| Day 14 | Mid-checkpoint (D7 retention available, trend visible) | PO |
| Day 28 | Final analysis → Decision (Scale/Iterate/Kill) | PO + Stakeholders |

---

## 8. Risks & Mitigations

| **Risk** | **Likelihood** | **Impact** | **Mitigation** |
| --- | --- | --- | --- |
| [Sample size too small for significance in 4 weeks] | [Medium] | [High - can't make confident decision] | [Extend window to 6 weeks if needed; pre-calculate required N] |
| [Confounding event (holiday, marketing campaign)] | [Medium] | [Medium - hard to attribute lift] | [Hold against same-day-of-week baseline; control for known campaigns] |
| [Tracking implementation bug → bad data] | [Low] | [Very High] | [QA tracking in staging; Day 1 sanity check; PO reviews event payloads] |
| [Selection bias (only engaged users see feature)] | [Medium] | [Medium] | [Compare cohorts by install date, not feature-exposure date] |

---

## 9. Dependencies

| **Need** | **Owner** | **Status** | **Notes** |
| --- | --- | --- | --- |
| Tracking events implemented (per Tracking Spec doc) | Eng | [☐] | See Tracking_Spec_[Feature].md |
| Firebase Analytics events validated in DebugView | Eng + PO | [☐] | Before release |
| BigQuery export enabled | Data | [☐] | For deep analysis post-launch |
| Custom Firebase dashboard set up | PO | [☐] | One-pager view of all metrics |
| Baseline measurement completed | Data + PO | [☐] | Min 30-day window |

---

## 10. Sign-off

| **Role** | **Name** | **Approved** | **Date** |
| --- | --- | --- | --- |
| Product Owner | | | |
| Engineering Lead | | | |
| Data / Analytics | | | |
| GM / Product Head | | | |
