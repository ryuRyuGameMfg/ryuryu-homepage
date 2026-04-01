## SOUL（不変原則）
{{SOUL}}

## STRATEGY（運用戦略）
{{STRATEGY}}

## MEMORY（コンテキスト）
{{MEMORY}}

## AGENT（行動アルゴリズム）
{{AGENT}}

## 本日の記録（あれば）
{{DAILY_MEMORY}}

## 昨日の記録（あれば）
{{YESTERDAY_MEMORY}}

---
# タスク: update モード

本日（{{TODAY}}）の update モードを実行してください。

AGENT.md の「update モード アルゴリズム」に従い、以下を実行してください：

1. ~/repository/note-engine/state.json を読み、前回 update 以降の新規記事を確認
2. ~/repository/zenn-engine/state.json を読み、前回 update 以降の新規記事を確認
3. 新記事があれば ~/repository/ryuryu-homepage/data/csv/news.csv に追記
   （既存フォーマットを必ず確認してから追記すること）
4. ~/repository/strategy-room/DAILY.md から KPI 数値を読み、
   ~/repository/ryuryu-homepage/data/csv/sections.csv の実績数値を更新
5. 変更があれば ~/repository/ryuryu-homepage/ で git commit && git push
   （コミットメッセージ: homepage: iter{{ITERATION}}_update {変更概要}）
6. ~/repository/homepage-engine/memory/hot/{{TODAY}}.md に実行記録を保存
7. ~/repository/homepage-engine/state.json の last_deployed を更新

変更がなかった場合も daily memory に「変更なし」と記録してください。

## 完了報告（必須）
作業完了時、必ず以下のマーカーで囲んで3〜5行のサマリーを出力すること:
PHASE_SUMMARY_START
（やったこと・成果・次のアクション を箇条書きで）
PHASE_SUMMARY_END
