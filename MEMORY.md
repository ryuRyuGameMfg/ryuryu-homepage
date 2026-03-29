# MEMORY - 常時コンテキスト

**管理方針: iterate モードで昇格/降格。100行以下を維持。**
**3層構造: hot（毎回参照）/ warm（数週間有効）/ cold（アーカイブ）**

---

## [HOT] 直近の状態（常時参照）

- 初期化済み（Iter0）、3モードサイクル稼働開始
- エンジンリポジトリ: ~/repository/homepage-engine/
- ホームページリポジトリ: ~/repository/ryuryu-homepage/
- update / seo / report の3モードサイクルで運用中

---

## [WARM] 連携エンジン情報（数週間スパン）

| エンジン | state.json パス | 連携内容 |
|---------|----------------|---------|
| note-engine | ~/repository/note-engine/state.json | 新記事 → news.csv 追加 |
| zenn-engine | ~/repository/zenn-engine/state.json | 新記事 → news.csv 追加 |
| strategy-room | ~/repository/strategy-room/DAILY.md | KPI数値 → sections.csv 更新 |

---

## [WARM] CSV ファイルマップ

| ファイル | パス | 更新モード |
|---------|------|-----------|
| news.csv | data/csv/news.csv | update |
| services.csv | data/csv/services.csv | seo |
| testimonials.csv | data/csv/testimonials.csv | update |
| sections.csv | data/csv/sections.csv | update |

---

## [COLD] 更新履歴・学んだパターン

（初回サイクル完了後に記録予定）

---

## 昇格/降格ルール

| 判定 | 処理 |
|------|------|
| 30日以上価値がある情報 | HOT/WARM に昇格 |
| 2週間参照されない HOT 情報 | WARM に降格 |
| 1ヶ月参照されない WARM 情報 | COLD または削除 |
| 100行超過時 | COLD を memory/long-term/ に移動 |
