# 交接档（handoff.md）

> 任何 Agent 开工前必读，收工前必更新。

## ⏯️ 目前做到哪

- v1 首次实作完成：教学导入画面、分组设置（摄像头+侦测人数）、10 题/轮游戏流程（题目展示→准备作答→5秒倒数→左右分区判定计分）、轮次结算、localStorage 排行榜。
- 题库已按课本页码核对（见 `src/data/questions.js`），共 16 题（四种句型各 4 题），`pickRound()` 每轮随机抽 10 题。
- `npm run lint`、`npm run build` 均已通过，本机 `npm run dev` 已跑起来（`http://localhost:5173/`）。

## 🚦 目前状态

- **已上线**：https://tahun1-bc-juxing.vercel.app （GitHub `kongsi-idea/tahun1-bc-juxing`，Vercel team `kongsi-idea`）
- 已登记进 `kongsi-idea/app.js` 的 `TOOLS`（含 `prep` 摄像头/4-8人/活动空间/光线需求，`teachingMode` 新增「摄像头体感互动」分类），Hub 已重新部署且手动 `vercel alias set` 校正过 `kongsi-idea.vercel.app` 指向（这个专案有已知的别名不自动更新踩坑，见 memory `eduneo-hub-versioning-and-creator-rules`）。
- 老师本机实测过摄像头启动、3人以上侦测（换 CPU delegate + 降低置信度门槛后确认正常）、10 题流程、声音效果，确认无误后才走部署流程。
- `published-tools-coverage.md` 已加一行，标注「马来文单元名还没核对官方 DSKP PDF，暂缓收录进 `dskp-index.js`」。

## ➡️ 下一步

1. 视实际课堂使用效果决定要不要加开局校准确认步骤（v1 刻意先不做）。
2. 有空时查证 5.4/5.4.1 的官方马来文用词（对照 SK 版 DSKP PDF），核对过再补进 `kongsi-idea/data/dskp-index.js`，让「按学习目标找工具」也能搜到这个工具。
3. 收集课堂实测反馈后，照 `agents.md` 版本规则升版本号+写 changelog。

## ⚠️ 注意事项

- 摄像头隐私是硬性规定，见 `agents.md`，改动摄像头相关代码时不能引入任何上传行为。
- 模型/wasm 是打包进 `public/` 的静态档案，不要改成运行时去 CDN 抓，否则失去「课堂网络不稳也能用」的设计初衷。
- 左右分区判定用 landmark 23/24（左右髋）中点，不是鼻子/头部，是为了转头不影响判定的稳定性考量。

## 🕐 最后更新

- 时间：2026-07-31
- 更新者：Claude
- Git push：尚未建 Git 仓库
