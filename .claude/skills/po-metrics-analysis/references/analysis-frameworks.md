<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- C6 — tách từ po-agent-bundle.md (skill po-metrics-analysis v1.3) -->

# Analysis Frameworks

Đọc file này khi cần chọn framework phù hợp cho phân tích metrics.

---

## 1. AARRR (Pirate Metrics)

Framework cổ điển cho consumer app, vẫn rất hữu dụng.

| **Stage** | **Question** | **Key metrics** |
| --- | --- | --- |
| **A**cquisition | How do users find us? | CPI, install source, store conversion |
| **A**ctivation | Do users have great first experience? | First-session completion, time-to-first-action, D1 retention |
| **R**etention | Do users come back? | D1/D7/D30 retention, stickiness, habit rate |
| **R**eferral | Do users tell others? | K-factor, NPS, share rate, organic install lift |
| **R**evenue | Can we monetize? | ARPDAU, conversion to paying, LTV |

**Khi nào dùng AARRR:**
- Health check tổng thể của product
- Bắt đầu cho product mới
- Identify nơi nào leak biggest trong funnel

**Khi NÀO không dùng AARRR:**
- Feature-level analysis (quá rộng)
- Khi feature không touch toàn funnel

---

## 2. RARRA (Modified AARRR)

Reorder của AARRR ưu tiên Retention. Phù hợp cho mobile app B2C.

| **Order** | **Stage** | **Rationale** |
| --- | --- | --- |
| 1 | Retention | Most important — users don't return = nothing else matters |
| 2 | Activation | Get them to "aha moment" |
| 3 | Referral | Happy users recruit others (cheaper than ads) |
| 4 | Revenue | Monetize engaged users |
| 5 | Acquisition | Pour into a leaky bucket only after fixing leaks |

**Khi nào dùng RARRA:**
- Product đã có user nhưng chưa giữ chân được
- Khi UA cost cao, retention thấp
- Khi cần convince leadership tập trung vào retention trước marketing spend

---

## 3. Retention Curves

Curve hiển thị % users vẫn active over time.

### Cách đọc curve

```
Retention %
 100 |●
  80 |  ●
  60 |    ●
  40 |       ●●
  20 |          ●●●●●●  ← plateau
   0 +───────────────────→ Days
     0  1  3  7  14  30  60  90
```

**Yếu tố quan trọng:**
- **Slope of initial drop** (D0→D7): độ sâu của valley
- **Plateau level**: nơi curve flatten = % users "engaged forever"
- **Plateau timing**: khi nào flatten? Healthy: D14-D30

### Pattern recognition

**Pattern 1: Healthy curve**
- Initial drop ~60% trong week 1
- Plateau forms quanh D14-D30 ở ~15-25%
- → App có core loyal users

**Pattern 2: Smiling curve (resurrection)**
- Initial drop
- Sau đó retention TĂNG trở lại
- Hiếm gặp, thường do major feature launch, viral moment, hoặc holiday

**Pattern 3: Death curve**
- Drop liên tục, không plateau
- → Core loop broken, không ai stick

**Pattern 4: Cliff**
- Drop bình thường, rồi DROP đột ngột tại 1 điểm cụ thể (vd D5)
- → Có blocker tại điểm đó (vd hết content, hết motivation)
- Cần investigate event D5 trong cohort

### Tính toán

```sql
-- Day-N retention for install cohort
WITH cohort AS (
  SELECT user_pseudo_id, MIN(PARSE_DATE('%Y%m%d', event_date)) AS install_date
  FROM events
  WHERE event_name = 'first_open'
    AND event_date BETWEEN '20260501' AND '20260507'
  GROUP BY user_pseudo_id
),
return_events AS (
  SELECT DISTINCT user_pseudo_id, PARSE_DATE('%Y%m%d', event_date) AS active_date
  FROM events
  WHERE event_name = 'session_start'
)
SELECT
  DATE_DIFF(r.active_date, c.install_date, DAY) AS days_since_install,
  COUNT(DISTINCT c.user_pseudo_id) AS active_users
FROM cohort c
JOIN return_events r USING (user_pseudo_id)
WHERE DATE_DIFF(r.active_date, c.install_date, DAY) BETWEEN 0 AND 30
GROUP BY days_since_install
ORDER BY days_since_install;
```

---

## 4. Cohort Analysis

Group users by shared attribute (vd install week), so sánh behavior over time.

### Cohort table format

```
Install Week | D1   | D3   | D7   | D14  | D30
W1 (May 1-7) | 42%  | 33%  | 25%  | 18%  | 12%
W2 (May 8-14)| 44%  | 35%  | 27%  | 20%  | 14%
W3 (May 15-21)| 41% | 32%  | 24%  | --   | --
W4 (May 22-28)| 43% | --   | --   | --   | --
```

### Cách đọc cohort table

- **Đọc theo hàng**: 1 cohort cụ thể (W1) hành xử thế nào over time
- **Đọc theo cột**: cùng day-since-install nhưng các cohort khác nhau → so sánh cải thiện
- **Diagonal**: nếu metric tăng dần qua cohorts → trend tốt

### Khi nào dùng cohort
- So sánh trước vs sau release feature: cohort cũ vs cohort mới
- So sánh acquisition source: paid_facebook cohort vs organic cohort
- Detect seasonality: holiday cohort vs normal week cohort
- Validate A/B test: variant_A cohort vs variant_B cohort

### Common cohort dimensions

| **Dimension** | **Example values** | **Use case** |
| --- | --- | --- |
| Install week/month | 2026-W18, 2026-05 | Time-based comparison |
| Acquisition source | organic, paid_facebook, paid_google | UA quality |
| Platform | iOS, Android | Platform health |
| Country | VN, US, ID | Geo expansion |
| First feature used | farm, shop, social | Onboarding path |
| Device tier | premium, mid, budget | Performance segments |

---

## 5. Funnel Analysis

Track conversion at each step of multi-step flow.

### Funnel example: "User completes first harvest"

```
Step 1: App opened (100%, 10000 users)
       ↓
Step 2: Farm screen viewed (85%, 8500 users)  [-15%]
       ↓
Step 3: Plot selected (70%, 7000 users)        [-18%]
       ↓
Step 4: Crop planted (60%, 6000 users)         [-14%]
       ↓
Step 5: Returned to harvest (35%, 3500 users)  [-42% ← BIGGEST DROP]
       ↓
Step 6: Crop harvested (33%, 3300 users)       [-6%]
```

### Reading funnel

- **Drop-off %**: focus on biggest drop (Step 4→5 above)
- **Cumulative conversion**: Step 6 / Step 1 = 33%
- **Step-to-step conversion**: each step's loss
- **Time between steps**: long gap = friction (Step 4→5 = users need to wait for crop to grow, expected)

### Funnel improvement hypothesis

When biggest drop is identified, generate hypothesis:
1. Friction at that step? (UI, UX, performance, requirement)
2. Wrong expectation? (User thought something else)
3. Natural waiting? (Game timer, day boundary)
4. Bug? (Action doesn't work)
5. Motivation? (User doesn't see value)

### When NOT to use funnel
- Free-form usage không linear
- User có multiple valid paths
- Behavior xảy ra song song, không sequential

---

## 6. A/B Test Analysis (Brief — full skill `po-ab-testing` sau)

### Required for A/B analysis
- **Pre-defined success metric** (chỉ 1)
- **Pre-defined sample size** (statistical significance)
- **Random assignment** (50/50 hoặc 33/33/33)
- **Pre-defined test duration** (≥1 week, full retention window)
- **Pre-defined decision threshold** (vd p < 0.05)

### Common pitfalls
- **Peeking**: nhìn data trong khi test chưa đủ N → false positive
- **Multiple metrics**: test 10 metrics, 1 trong số đó "significant" by chance
- **Selection bias**: variant A và B không thực sự random
- **Time confounder**: A chạy tuần này, B chạy tuần sau → không so sánh fair
- **Sample ratio mismatch**: A/B chia 50/50 nhưng actual 55/45 → có vấn đề

### Confidence interpretation
- p < 0.05 và sample size đủ: significant
- p < 0.05 nhưng sample nhỏ: directional, not conclusive
- p > 0.05: not significant, KHÔNG có nghĩa "no difference" — có thể test underpowered

---

## 7. Segmentation Analysis

Slice metric by attribute để tìm hidden pattern.

### Standard segments to always check

1. **Platform**: iOS vs Android (UI/UX differences common)
2. **OS version**: latest vs older (compatibility issues)
3. **Country/Region**: top 5 markets
4. **Acquisition source**: organic vs paid vs referral (paid users often different)
5. **Device tier**: premium (latest iPhone) vs budget (3+ year old Android)
6. **User tenure**: new vs returning vs reactivated
7. **Engagement tier**: casual vs regular vs power user

### Insight pattern

> "Aggregate metric looks fine, but [segment X] has very different behavior."

Examples:
- D7 retention 28% overall, but new Vietnam users at 18% → onboarding issue in VN
- ARPDAU $0.18 overall, but Android budget tier at $0.05 → IAP not affordable
- Session length 8 min, but power users at 25 min, casual at 3 min → bimodal distribution

### Segmentation traps

- **Simpson's Paradox**: aggregate looks good, but every segment looks bad (or vice versa)
- **Small segment, big claim**: 1 segment với N=50 không đủ
- **Confounding segments**: paid_facebook và US overlap heavily → can't isolate effect

---

## 8. Anomaly Detection

### Spot anomalies in dashboards

| **Signal** | **Possible cause** |
| --- | --- |
| Sudden DAU drop | App store policy block, tracking break, server outage |
| Sudden spike | Viral moment, bot traffic, tracking duplicate |
| Plateau where growth expected | Saturation, blocker reached |
| Day-of-week pattern change | User behavior shift, calendar event |
| Sudden country shift | Featured by store, regional issue |
| Crash spike | New OS version, new app version bug |
| Funnel step regression | Recent code change broke flow |

### Investigation checklist

When anomaly detected:
1. **Confirm data quality**: tracking broken? Sample issue?
2. **Check timing**: align with any release/deploy?
3. **Segment**: which platform/country/version affected?
4. **Compare**: vs same day last week, same period last year
5. **Look at related metrics**: confirm signal in multiple metrics

---

## 9. Choosing Framework — Decision Tree

```
What's the question?
│
├─ "Overall product health?" → AARRR or RARRA
│
├─ "Are users coming back?" → Retention curves + Cohort analysis
│
├─ "Where do users drop off?" → Funnel analysis
│
├─ "Did feature X work?" → A/B Test (if testable) or Cohort comparison (before/after)
│
├─ "Why does aggregate look weird?" → Segmentation
│
├─ "Sudden metric change?" → Anomaly detection
│
└─ "What's our North Star?" → NSM framework (see farming-app-metrics.md §11)
```

---

## 10. Interpretation Principles

### Always ask "compared to what?"
A metric value alone is meaningless. Always provide reference:
- vs baseline (pre-launch)
- vs target
- vs previous period
- vs competitor benchmark
- vs control group

### Look at distribution, not just mean
Mean ARPDAU $0.18 could be:
- 100% of users pay $0.18 each (uniform)
- 1% of users pay $18 each, 99% pay $0 (whales)
- These need very different strategies

Always check median, p95, p99, distribution histogram.

### Significance ≠ practical impact
- p < 0.001 with 1M users, lift 0.1% = statistically significant but practically tiny
- p = 0.08 with 100 users, lift 50% = not significant but could be real
- Always state effect size, not just p-value

### Causation requires experimentation
- "DAU went up after feature X" → correlation, not causation
- Confounders: marketing campaign, seasonality, other releases
- Only A/B test can prove causation

### Beware survivorship bias
Analyzing only active users misses churned users. Always include "user who DIDN'T do X" in denominator when computing rates.
