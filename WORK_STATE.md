# PHANTOM UI

## 2026-10-23 发布任务

目标：将 `sites/phantom-ui` 作为 `Kalsook041/P5R_UI` 仓库，并部署到 GitHub Pages。

验收：仓库 `main` 收到站点源文件和构建产物；Pages 工作流成功发布 `dist/`；公开 URL 能返回站点入口及其相对资源。

已确认：远端仓库为空、公开，默认分支 `main`，当前账号有 admin/push 权限；父级研究包约 1.5 GB，因此 Git 仓库根设为本目录，避免把未要求的网站外档案一并发布。`dist/index.html` 使用相对资源路径。

已完成：在本目录初始化 Git 并推送到 `https://github.com/Kalsook041/P5R_UI.git` 的 `main`，首个提交为 `31671bc673c2a2ed3186e13f3b5160c0d8343b07`。Pages 发布源已设为 GitHub Actions；Actions run `39887599077` 第 2 次尝试成功。公开地址 `https://kalsook041.github.io/P5R_UI/` 已返回 200，站点、ES 模块和场景图片均可访问，浏览器已显示完整页面。

约束：原作游戏图像及测量资源保留原权利，MIT 许可仅适用于项目代码。不得把素材描述为 MIT。

## 网站开发状态

Latest correction: user rejected v1 as unlike original. Replaced the generic shell with cut-paper composition and original command-scene artwork. Added original (default) / editable modes to title and pause. Original mode embeds the accepted renderer, measurements, sprites, compositing and background; custom text stays in the explicitly labeled adapted mode. Game assets retain original rights; do not claim they are MIT. Revision implemented and verified; visual acceptance remains subject to user feedback. See ROYAL_REVISION.md. Original archives remain untouched.

Goal: build a P5R-inspired open-source UI playground from the existing reverse-engineering research.

Acceptance: eight distinct usable effects; editable text, color and numeric controls; exact standalone HTML/CSS/JS export and copying; pause/replay/speed; filtering; responsive and keyboard-accessible UI; browser verification of interactions and exports.

Decisions: buildless ES modules in dist/, no third-party runtime dependencies. Native title and pause use original game images retained from the local research; editable versions use generated web graphics. Code MIT and game asset rights are separate. Existing accepted archives remain untouched. GitHub Pages publishes dist/ from the public P5R_UI repository, as requested.

Completed: eight effects, editable text/numeric/color controls, filtering, local persistence, same-generator sandboxed previews and standalone exports, copy/download, pause/replay/speed, adaptive fixed-height canvas and keyboard controls. Sources and MIT license included; 8 default HTML examples generated. Known source: title V3 runtime.json (1.05 s fitted period, four harmonics), place-motion.mjs ENTER/EXIT tracks (75/55 ms). These are fitted observations, not recovered engine constants.

Verification: 9 node tests and syntax checks pass. V2 original title/pause interaction and standalone exports checked in Chromium at desktop and 390×844. Original clipboard and title download exactly match the generator; independent original exports run and accept selection/keys. Archive hash unchanged. V1 eight-effect regression record remains in VERIFICATION.md; current revision evidence is ROYAL_REVISION.md and evidence/royal-*.

Delivery: local server on 127.0.0.1:18770 (exec session 57177); python serve.py restarts it. Public site: https://kalsook041.github.io/P5R_UI/. Default mode is original title/pause; editable parameters remain separate. Current review/repair prompts are at the end of ROYAL_REVISION.md. No outstanding verified functional issues; cross-browser, actual touch and reduced-motion browser emulation remain outside verified coverage. Do not equate functional tests with final visual acceptance.
