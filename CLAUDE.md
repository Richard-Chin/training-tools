# training-tools — 早會專題設計與製作

## 對話開始時請先讀
進度與最近更動都在 Obsidian：`training-tools/工作筆記.md`

## 這個專案要做什麼
設計與製作早會專題（簡報、教材、視覺內容等）。

## 工作模式
- **加新工具/專題**：對 Claude 說「我想做一個 XXX」→ Claude 會建 `tools/<名稱>/` 子資料夾，一步步帶著做
- **結束工作**：對 Claude 說「**收工**」→ 自動 commit + push + 更新 Obsidian 工作筆記
- **接續工作**：對 Claude 說「**開工**」→ 讀工作筆記、報告 git 狀態、建議下一步

## 工作桌 + 三個家
- 📋 雲端硬碟工作桌：`G:\我的雲端硬碟\01邦拓\001\training-tools\`（自動跨電腦同步）
- 🐙 GitHub repo：`Richard-Chin/training-tools`（公開，網頁的家）
- 📘 Obsidian 駕駛艙：`training-tools/工作筆記.md`（想法的家）

## 早會駕駛艙模板（共用引擎）
所有早會專題共用 `tools/cockpit/`：`cockpit.css`（樣式＋版型元件）＋`cockpit.js`（自動注入 🎲抽夥伴／⏱️計時器／✏️畫筆＋翻頁）。
> ⚠️ 資料夾名不可用底線開頭（GitHub Pages 的 Jekyll 會忽略 `_` 開頭資料夾 → css/js 線上 404）。已從 `_cockpit` 改名為 `cockpit`。
- 開新專題：複製 `tools/cockpit/TEMPLATE.html`，只改 `.slide` 內容即可（用法見 `tools/cockpit/README.md`）
- 對 Claude 說「我想做一個 XXX 早會專題」→ 會自動用這套模板生成

## 工具/專題清單
（之後加新內容時會自動更新）網址格式：`https://richard-chin.github.io/training-tools/tools/<名稱>/`
- **cockpit**：早會駕駛艙共用模板（引擎＋TEMPLATE＋README）
- **warm-market-development**：緣故開發早會專題（駕駛艙版，`index.html` + 單頁手卡 `handout.html`；重心＝轉介紹延伸；琥珀金）
- **stranger-development**：陌生開發早會專題（駕駛艙版，`index.html` + 手卡 `handout.html`；心態→管道→破冰→轉化；沉穩藍）
- **appointment-setting**：安排約訪早會專題（駕駛艙版，`index.html` + 手卡 `handout.html/pdf`；開場→給理由→二選一敲時間→拒絕處理；活力橙）

## 工作注意事項
- 客戶／員工資料一律去識別化：不放真實姓名、身分證字號、電話、地址
- **含員工個資、佣金、薪資、績效數字、財務／健康資料的內容不可放公開 repo** → 需要時另開私人 repo
- 行銷／話術內容遵守倫理鐵律：不用悲情、恐嚇、貶低式用語
- commit 訊息要寫清楚做了什麼 + 為什麼
- 收工前說「收工」讓 Claude 同步三方
