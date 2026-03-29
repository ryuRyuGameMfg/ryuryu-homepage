# MEMORY.md — 常時コンテキスト

> このファイルは report モードで AI が昇格/降格を管理。目標 100行以内。

## プロジェクト状態

- 初期化済み（Iter0）
- 3モードサイクル稼働開始
- エンジンリポジトリ: ~/repository/homepage-engine/
- ホームページリポジトリ: ~/repository/ryuryu-homepage/

## 連携エンジン

| エンジン | state.json パス | 連携内容 |
|---------|----------------|---------|
| note-engine | ~/repository/note-engine/state.json | 新記事 → news.csv 追加 |
| zenn-engine | ~/repository/zenn-engine/state.json | 新記事 → news.csv 追加 |
| strategy-room | ~/repository/strategy-room/DAILY.md | KPI数値 → sections.csv 更新 |

## CSV ファイルマップ

| ファイル | パス | 更新モード |
|---------|------|-----------|
| news.csv | data/csv/news.csv | update |
| services.csv | data/csv/services.csv | seo |
| testimonials.csv | data/csv/testimonials.csv | update |
| sections.csv | data/csv/sections.csv | update |

## 直近の更新履歴

（初回 update モード実行後に記録予定）

## 学んだパターン

（初回サイクル完了後に記録予定）
