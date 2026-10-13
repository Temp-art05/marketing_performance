---
title: Skill ios-integrate-revcat — tích hợp paywall RevenueCat cho app iOS
type: reference
topic: 06-tools
tags: [revenuecat, paywall, subscription, iap, remote-config, ios, hybrid-monetization, tool-noi-bo]
app: general
status: verified
confidence: high
sources:
  - AI Knownledge/APR-268 - IOS Apply RevenueCat SDK/README.md (đọc 2026-10-14)
  - AI Knownledge/APR-268 - IOS Apply RevenueCat SDK/references/revenuecat-api-cheatsheet.md (đọc 2026-10-14)
  - AI Knownledge/APR-268 - IOS Apply RevenueCat SDK/templates/paywall-spec.example.yaml (đọc 2026-10-14)
  - https://swiftpackageindex.com/revenuecat/purchases-ios/5.15.1/documentation/revenuecat
created: 2026-10-14
updated: 2026-10-14
related: [03-monetization/paywall-subscription-checklist-policy.md]
summary: Claude Code skill dựng paywall RevenueCat (SDK 5.15.x) vào app Swift — manager, PaywallView, điều hướng, paywall mặc định offline, gate theo placement + remote flag; có chế độ hỏi đáp cho PO/PM.
---

# ios-integrate-revcat (IOS Apply RevenueCat SDK)

## Bối cảnh
- Vị trí: `AI Knownledge/APR-268 - IOS Apply RevenueCat SDK` (SKILL.md, README, templates Swift, scripts, evals).
- Owner: Duy Phạm Đức. Target: Developer, PO/PM, UI/UX, BD.
- Liên quan marketing ở chỗ: app **hybrid (ads + subscription)** — vị trí paywall, placement, remote flag quyết định doanh thu IAP mà UA dùng cho tROAS. Skill dành cho **iOS**; bản Kotlin tương ứng được nhắc (`PaywallNavigation.kt`, `PaywallScreen`) nhưng không có trong folder.

## Làm gì
- Tạo `RevenueCatManager` (configure, `isPremium`, fetch, purchase, restore), và theo từng feature: `PaywallView` (RevenueCatUI), `PaywallNavigation`, `DefaultPaywallView` (fallback khi offline/không có offering), `PaywallGate`.
- Logic hiển thị 3 trạng thái: loading → paywall mặc định viết bằng code (không có offering) → paywall RevenueCatUI (có offering).
- `paywall-spec.yaml`: mỗi **source** (điểm mở paywall: onboarding, home, tính năng…) gắn `placement` (ID placement RevenueCat), `flag` (key remote config để bật/tắt paywall), hành động sau mua / sau đóng, và vị trí code để tự wire.

### Kiến thức monetization rút ra
- `offerings.currentOffering(forPlacement:)` chọn offering theo thứ tự: Targeting Rule khớp placement → Targeting Rule không placement → offering mặc định của project → `nil`. Nghĩa là có thể A/B test giá/paywall theo placement trên dashboard RevenueCat mà không cần release app.
- Mỗi điểm mở paywall nên có 1 remote flag riêng (vd `show_onboarding_paywall`) để tắt nhanh khi paywall làm tụt retention hay doanh thu ads.
- `purchaseCancelledError` im lặng; `networkError` retry; `receiptAlreadyInUseError` = user đăng nhập tài khoản khác.

## Cách chạy
Copy folder skill vào `.claude/skills/ios-integrate-revcat/` (hoặc `~/.claude/skills/`), gọi `/ios-integrate-revcat` (thêm `--dry-run` để xem trước). Input: feature name, entitlement id (vd `pro`), **<RevenueCat public iOS API key `appl_…`>** (public client key, theo README được phép nằm trong binary), 3 product id weekly/monthly/yearly cho paywall mặc định, gate flag tuỳ chọn.

## Giới hạn
- Chỉ iOS Swift; không áp dụng trực tiếp cho app Android của KB.
- `PaywallView` của RevenueCatUI cần paywall đã thiết kế trên dashboard RevenueCat.
