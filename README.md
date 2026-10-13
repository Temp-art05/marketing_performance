# Marketing Performance

Kho kiến thức về **UA (User Acquisition) marketing** cho mảng **ứng dụng Android kiếm tiền bằng quảng cáo** (ads-monetized apps).

Mục tiêu: gom mọi thứ đã học được — từ lý thuyết, playbook chạy campaign, đến bài học rút ra từ dữ liệu thật — về một chỗ, viết bằng Markdown để người và Claude đều đọc được.

## Phạm vi

- **Kênh UA**: Google Ads (App Campaigns), Meta, TikTok, Unity, AppLovin, Mintegral...
- **Monetization**: AdMob, AppLovin MAX, mediation, eCPM, ad format, ad placement
- **Đo lường**: MMP (AppsFlyer, Adjust), Firebase, attribution, event tracking
- **Chỉ số & kinh tế unit**: CPI, ROAS, LTV, ARPDAU, retention, payback
- **Creative**: concept, test creative, phân tích hiệu quả
- **ASO** và các yếu tố store ảnh hưởng tới conversion

## Cấu trúc

```
knowledge/              Nguồn sự thật: Markdown + frontmatter
  INDEX.md              Bản đồ toàn bộ tài liệu (sinh tự động, Claude đọc mỗi session)
  00-overview/          Roadmap, glossary chỉ số, trạng thái hiện tại
  01-pre-marketing/     ASO, store listing, creative
  02-ua-channels/       Google Ads, Meta, TikTok, AppLovin...
  03-monetization/      AdMob, MAX, mediation
  04-measurement/       Firebase, MMP, attribution
  05-optimization/      Đọc chỉ số theo mốc, tối ưu
  playbooks/            Checklist từng bước
  lessons/              Bài học từ việc thật (có ngày, bối cảnh)
  decisions/            Quyết định + lý do
  apps/<app>/           Hồ sơ app, nhật ký campaign
assets/screenshots/     Ảnh chụp màn hình (YYYY-MM/), manifest chống trùng
scripts/kb/             CLI + hooks Claude Code
site/                   Web app local xem/sửa knowledge
tests/                  unit, hooks, web (API + Chrome), e2e (Claude thật)
.claude/                settings.json (hooks), skills kb-capture / kb-search
```

## Dùng hằng ngày

- **Làm việc với Claude** trong repo này như bình thường (setup campaign, đọc data, dán screenshot...). Claude tự nạp những gì đáng giữ vào `knowledge/` rồi commit + push. Cơ chế:
  - Skill `kb-capture` + quy tắc trong `CLAUDE.md`.
  - Hook `Stop`: nếu đã làm việc thực chất mà chưa nạp → nhắc Claude rà và nạp trước khi dừng.
  - Hook `SessionEnd`/`PreCompact`: agent nền (`claude -p`) rà lại phần chưa nạp khi đóng session hoặc nén context.
  - Hook `PostToolUse`: lint tài liệu ngay khi ghi, sinh lại `INDEX.md`.
- **Xem / sửa trên web**: `npm install` (lần đầu) rồi `npm run web` → http://localhost:4321. Có tìm kiếm có/không dấu, duyệt theo chủ đề/app/GEO, gallery ảnh, timeline bài học, roadmap tick được, trình sửa có dán/kéo thả ảnh. Lưu là tự commit + push.
- **CLI**: `node scripts/kb/cli.mjs help` (index, lint, search, new, images, commit, skip).
- **Test**: `npm test` (unit + hooks + web; cần Chrome cho UI test). `npm run test:e2e -- --runs 3` chạy Claude thật trên bản sao tạm (tốn token).
- Log và trạng thái hook: `.claude/state/` (không commit).

## Quy ước

- Nội dung viết bằng Markdown, tiếng Việt; giữ nguyên thuật ngữ tiếng Anh của ngành (CPI, ROAS, eCPM...).
- **Không commit** dữ liệu thô export từ dashboard, token hay API key — xem `.gitignore`.
- Số liệu đưa vào tài liệu cần ghi rõ nguồn, thời điểm và bối cảnh (app, GEO, kênh).

## License

[Apache 2.0](LICENSE)
