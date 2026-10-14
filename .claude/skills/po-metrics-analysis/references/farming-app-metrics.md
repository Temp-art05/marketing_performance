<!-- Nguồn: AI Knownledge APR-026, owner Hoài Nguyễn Thị Vĩnh, nhập 2026-10-14 -->
<!-- C7 — tách từ po-agent-bundle.md (skill po-metrics-analysis v1.3) -->

# Farming App Metrics Catalog

Đọc file này khi cần chọn metrics phù hợp cho feature trong app farming. Catalog này tổ chức theo AARRR framework + farming-specific.

---

## 1. Acquisition Metrics

| **Metric** | **Definition** | **Healthy range** | **Tools** |
| --- | --- | --- | --- |
| Installs | Total app installs in period | Depends on UA spend | Store Console + Firebase |
| Install source breakdown | % installs by source (organic, paid_facebook, paid_google, referral) | Organic ≥30% healthy | Firebase + UA platform |
| CPI (Cost per Install) | Paid spend / paid installs | Varies by market: $0.5-3 (VN), $2-7 (US) | UA platform |
| Click-to-install conversion | Store page views → installs | iOS: 25-35%, Android: 30-40% | Store Console |
| Store rating | App Store / Play Store average rating | ≥ 4.3 to maintain ASO | Store Console |
| Store review velocity | # reviews per week | Trend up = healthy | Store Console |

---

## 2. Activation Metrics

Activation = user passed "aha moment" và setup thành công.

| **Metric** | **Definition** | **Healthy range** | **Notes** |
| --- | --- | --- | --- |
| First-session completion rate | % installs that complete tutorial in first session | ≥75% | Below 70% = tutorial broken |
| Tutorial step completion rates | % completing each tutorial step | Each step ≥85% | Identify drop-off step |
| Time-to-first-action | Seconds from install to first meaningful action (plant first crop) | ≤90s | Faster = better |
| First-session length | Median seconds in first session | 5-10 min healthy | <3 min = bouncing |
| Activated rate (D0) | % installs that perform N core actions in first session | ≥60% | "N" varies by app |

### Farming-specific activation events
- First plot planted
- First crop harvested
- First building constructed
- Level 2 reached
- First quest completed

---

## 3. Retention Metrics

**Most important category for farming app** vì app sống bằng repeat users.

### Classic retention
| **Metric** | **Definition** | **Industry benchmark (casual/farming)** | **Your target** |
| --- | --- | --- | --- |
| D1 Retention | % new users return next day | 35-45% | ≥40% |
| D3 Retention | % new users return on day 3 | 25-32% | ≥28% |
| D7 Retention | % new users return on day 7 | 20-30% | ≥25% |
| D14 Retention | % new users return on day 14 | 12-18% | ≥15% |
| D30 Retention | % new users return on day 30 | 8-12% | ≥10% |
| D90 Retention | % new users return on day 90 | 3-6% | ≥4% |

**Important**: "Return on day N" = user opened app on EXACTLY day N (calendar). Some tools dùng "by day N" (any day ≤ N) → check definition!

### Rolling retention (alternative)
- N-day rolling retention: % users still active in N-day window
- Less spike-prone than calendar retention

### Habit formation
| **Metric** | **Definition** | **Target** |
| --- | --- | --- |
| Habit rate (3+ days in week 1) | % new users who open app on 3+ different days in first 7 days | ≥40% |
| Habit rate (5+ days in week 1) | Strong habit signal | ≥25% |
| Power user rate | % DAU who play 30+ min/day | ≥15% |

### Curve health signals
- D1→D7 ratio: D7 retention / D1 retention. Healthy: ≥0.6 (means at least 60% of D1 users stick to D7)
- Plateau detection: when retention curve flattens → engaged user identified
- Cliff detection: sudden drop indicates broken loop at specific point

---

## 4. Engagement Metrics

### Session metrics
| **Metric** | **Definition** | **Healthy range** |
| --- | --- | --- |
| DAU | Unique users opening app per day | Trend up over time |
| WAU | Unique users opening app per 7-day rolling | DAU × ~3-4 |
| MAU | Unique users opening app per 30-day rolling | DAU × ~6-8 |
| Stickiness (DAU/MAU) | Ratio | 15-25% casual, 25-40% high-frequency |
| Sessions per DAU | Total sessions / DAU | 2-4 for casual games |
| Average session length | Median or mean seconds per session | 5-15 min for casual |
| Time between sessions | Median minutes between sessions same day | 60-180 min healthy |
| Sessions per week (per active user) | Total sessions / WAU | 7-15 |

### Activity depth
| **Metric** | **Definition** | **Notes** |
| --- | --- | --- |
| Actions per session | Core actions performed per session | Varies by feature |
| Screens per session | Unique screens visited per session | 5-15 healthy for game |
| Feature adoption rate | % DAU using feature X | Target ≥40% for core features |

---

## 5. Farming-Specific Engagement

### Core game loop metrics
| **Metric** | **Definition** | **Why matters** |
| --- | --- | --- |
| Plant → Harvest completion rate | % planted crops harvested before rot | <70% = users not returning fast enough |
| Average crops planted per DAU | Daily | Engagement depth |
| Harvest events per DAU | Daily | Direct value capture |
| Idle time before next action | Time between actions in session | Pacing health |
| Resource utilization rate | % of available coins/gems spent | Stuck if too low (>80% unused) |

### Progression metrics
| **Metric** | **Definition** | **Healthy range** |
| --- | --- | --- |
| Level at D1 | Median player level after 1 day | ≥3 (means progressing) |
| Level at D7 | Median player level after 7 days | ≥10 |
| Level at D30 | Median player level after 30 days | ≥25 |
| Time to level N | Days to reach key milestone level | Varies by design |
| Stuck rate at level X | % users at level X for >7 days | <15% per level |

### Inventory/Economy
| **Metric** | **Definition** | **Watch for** |
| --- | --- | --- |
| Soft currency balance (coins) median | Median coins held | Too high = nothing to buy, too low = grinding too hard |
| Soft currency earned vs spent ratio | Daily | ≈1.0 healthy |
| Hard currency (gems) usage rate | % users spending gems weekly | Low = monetization problem |

---

## 6. Quality Metrics

| **Metric** | **Definition** | **Target** |
| --- | --- | --- |
| Crash-free users rate | % users not experiencing crash in session | ≥99.5% |
| Crash-free sessions rate | % sessions without crash | ≥99.7% |
| ANR rate (Android) | App Not Responding events | ≤0.5% |
| App start time | Cold start time (median) | ≤3s |
| Critical user journey time | Time from app open to core action | Specific per feature |
| Error rate per session | App errors / sessions | <1% |
| Support ticket rate | Tickets per 1000 DAU | <2 per 1000 |

---

## 7. Vanity Metrics to AVOID

❌ Avoid these as primary metrics — they don't measure value:
- Total downloads (vanity, không lock-in)
- Total registered users (không nói gì về active)
- Total sessions (inflated by spam)
- Total page views / screen views (depend on UI complexity, not value)
- Likes / follows on social (not in-app value)
- Time on app (could be stuck, not engaged)
- # features built (output metric, not outcome)

Khi nào dùng được: như supporting metric, không phải primary success metric.

---

## 8. Choosing Right Metric for Feature Type

### Feature giúp ACQUISITION (vd: invite friend)
- Primary: Viral coefficient (K-factor) = invites sent × conversion rate
- Secondary: Organic install lift, share rate

### Feature giúp ACTIVATION (vd: tutorial improvement)
- Primary: First-session completion rate
- Secondary: Time-to-first-action, D1 retention

### Feature giúp RETENTION (vd: daily reward)
- Primary: D7 retention (new users)
- Secondary: Habit rate, D1 retention, session frequency

### Feature giúp ENGAGEMENT (vd: new content)
- Primary: Feature adoption rate (% DAU using)
- Secondary: Session length, actions per session

### Feature giúp PROGRESSION (vd: new levels/content)
- Primary: Level reached at D7/D30
- Secondary: Stuck rate, time to level N

### Feature giúp QUALITY (vd: performance optimization)
- Primary: Crash-free rate, ANR rate
- Secondary: App start time, session length

---

## 9. Counter-Metrics Reference

Mỗi primary metric phải có counter-metric. Common pairs:

| **Optimize this** | **Don't break this** |
| --- | --- |
| DAU | Crash-free rate, session quality |
| D7 Retention | D1 Retention, app rating |
| Session length | Crash rate, perceived bloat |
| Sessions per day | Quality of each session (don't fragment) |
| Tutorial completion | Time-to-fun (don't make tutorial too long) |
| Feature adoption | Core game loop usage (don't cannibalize) |
| Push notification CTR | Opt-out rate, churn |
| In-app purchase rate | Free user retention (don't push too hard) |

---

## 10. Metric Definition Best Practices

### Spec mỗi metric với 5 fields
1. **Name**: snake_case, ngắn gọn
2. **Math definition**: công thức chính xác, KHÔNG mơ hồ
3. **Cohort/Filter**: ai được tính trong tử số và mẫu số
4. **Time window**: measurement period rõ ràng
5. **Edge cases**: bỏ test accounts, bỏ outlier <1s sessions, etc.

### Ví dụ definition tốt
> **D7 Retention (new install cohort)**
> - **Math**: Count(distinct user_pseudo_id with session_start on day 7) / Count(distinct user_pseudo_id with first_open on day 0)
> - **Cohort**: New installs only (no reinstalls)
> - **Window**: Day 0 = install day, Day 7 = exact calendar day 7 after install
> - **Edge cases**: Exclude test accounts (user_properties.is_test_user = true). Exclude users with session_length < 1s.

### Ví dụ definition tệ
> "D7 retention" — đo bao nhiêu user quay lại sau 1 tuần
- Không nói cohort definition
- "1 tuần" = exact day 7 hay any day in 7-day window?
- Có exclude test accounts không?
- → Mỗi người tính sẽ ra số khác

---

## 11. North Star Metric (NSM) Candidates for Farming App

NSM = ONE metric đại diện cho long-term value. Candidates:

| **NSM Option** | **Pros** | **Cons** |
| --- | --- | --- |
| Weekly Active Days per User | Strong habit signal, hard to game | Slow to move |
| D30 Retention | Long-term value signal | Lag indicator (30 days behind) |
| Sessions per Week per WAU | Engagement frequency | Could be gamed by push spam |
| Lifetime sessions | Cumulative value | Vanity-leaning |
| Average revenue per weekly active user | Direct value | Doesn't capture non-paying engagement |

**Khuyến nghị cho app farming**: **Weekly Active Days per User** (số ngày user active trong 7 ngày qua) - balance giữa habit, engagement, retention.

---

## 12. Metric Maturity Levels

Đánh giá team đang ở level nào để biết khi nào upgrade:

### Level 1: Vanity
- Track total installs, total downloads
- "We have N users!"
- Không actionable

### Level 2: Operational
- DAU, MAU, basic retention
- Crash-free rate
- Có dashboard cơ bản

### Level 3: Funnel
- Conversion at each step
- Drop-off analysis
- Segment by source/platform

### Level 4: Cohort
- Retention curves by install cohort
- A/B testing với significance
- Counter-metrics tracked

### Level 5: Predictive
- LTV models
- Churn prediction
- Behavioral cohorts (RFM)

**Khuyến nghị app scale-up**: bắt đầu từ Level 3, hướng tới Level 4 sau 6 tháng. Level 5 chỉ khi data team trưởng thành.
