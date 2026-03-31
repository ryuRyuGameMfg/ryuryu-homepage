# HEARTBEAT.md — 自律チェックリスト

> このファイルは report モードで AI が自己更新する。

## コンテンツチェック

- [ ] news.csv の最新エントリは 30日以内か
- [ ] sections.csv の KPI 数値は最新か（DAILY.md と照合）
- [ ] note/zenn-engine の新記事が news.csv に反映されているか
- [ ] testimonials.csv に重複エントリはないか

## SEO チェック

- [ ] services.csv のコピーにターゲットキーワードが含まれているか
- [ ] meta description に数値が含まれているか
- [ ] news.csv のタイトルは検索意図に合っているか

## 戦略チェック

- [ ] STRATEGY.md の OKR 進捗は確認したか
- [ ] seo-queue.json に 3件以上のタスクがあるか
- [ ] content-queue.json に積み残しはないか

## 自己改善チェック

- [ ] エラーが続いているモードはないか（consecutive_errors 確認）
- [ ] AGENT.md のアルゴリズムに改善点はないか
- [ ] MEMORY.md が 100行を超えていないか
- [ ] memory/hot/ に今日の記録があるか
