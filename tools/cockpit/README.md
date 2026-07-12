# 早會駕駛艙模板 `cockpit`

> ⚠️ 資料夾**不能**用底線開頭（`_cockpit`）—— GitHub Pages 的 Jekyll 會忽略底線開頭資料夾，導致 css/js 在線上 404、簡報版面全垮。故命名為 `cockpit`。

所有早會專題共用的**簡報引擎**。寫好投影片內容，就自動有：
- 🎲 **抽夥伴**（可設座號範圍、不重複）
- ⏱️ **演練計時器**（1/2/3/5 分快捷、時間到嗶聲＋紅字閃爍）
- ✏️ **畫筆**（5 色＋板擦，在投影片上即時圈重點；翻頁自動清除）
- ⌨️ **翻頁**（← →／空白／點畫面左右／Home/End），**F 全螢幕**

## 檔案
| 檔案 | 作用 |
|------|------|
| `cockpit.css` | 全部樣式（主題、投影片版型元件、工具列） |
| `cockpit.js` | 引擎，自動注入工具列與所有互動 |
| `TEMPLATE.html` | 起手式範例（複製即用，也可直接開來看效果） |

## 怎麼開一個新專題（3 步）
1. 在 `tools/` 下建你的專題資料夾，例如 `tools/objection-handling/`
2. 複製 `TEMPLATE.html` 進去改名 `index.html`，把 `<link>`／`<script>` 路徑改成 `../cockpit/cockpit.css`、`../cockpit/cockpit.js`
3. 只改 `#stage` 裡的 `.slide` 內容即可

> 也可以直接跟 Claude 說「**我想做一個 XXX 早會專題**」，會自動用這套模板生出來。

## 版型元件（照抄 class 就好）
- 封面／結語：`<section class="slide dark">`（深色底）
- 標準內頁：`<section class="slide">` + `<h2>` + `<ul class="points">`
- 步驟卡：`.steps > .step`（要強調的加 `.step.focus`）
- 對比框：`.grid2 > .box.cross`（✕）／`.box.tick`（✓）
- 金句：`.quote`（內含 `.who` 當出處）
- 編號問句：`.three-q > .q`
- 行動框：`.action`（深色）
- 循環圖：`.cycle > .node` + `.arrow`

## 設定（可選，放在載入 cockpit.js 前）
```html
<script>
  window.COCKPIT_CONFIG = {
    seatMin: 1, seatMax: 30,   // 抽夥伴座號範圍
    timerDefault: 3,           // 計時器預設分鐘
    handout: 'handout.html'    // 有單頁手卡才填，會顯示左上角連結
  };
</script>
```

## 換色
在頁面 `<head>` 加一小段覆寫 CSS 變數即可：
```html
<style>:root{ --accent:#0a5588; --ink:#12303f; }</style>
```

## 範例
`tools/warm-market-development/`（緣故開發）就是用這套引擎做的，可當參考。
