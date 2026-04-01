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
# タスク: report モード

本日（{{TODAY}}）の report モードを実行してください。

AGENT.md の「report モード アルゴリズム」に従い、以下を実行してください：

1. ~/repository/homepage-engine/memory/hot/ の直近 7日分を読んでサマリー作成
2. 週次レポートを ~/repository/strategy-room/auto-reports/homepage-daily/{{TODAY_UNDERSCORE}}.md に保存
   （フォーマット: 現状サマリー / 更新履歴 / SEO進捗 / 次サイクルの方針）
3. ~/repository/homepage-engine/HEARTBEAT.md の各チェック項目を実際に確認して更新
4. ~/repository/homepage-engine/MEMORY.md を見直し
   （古い情報を降格、新しい重要情報を昇格、100行以内に維持）
5. ~/repository/homepage-engine/memory/hot/{{TODAY}}.md に実行記録を保存

iteration のインクリメントは homepage-engine.sh が自動で行います（不要）。

## 完了報告（必須）
作業完了時、必ず以下のマーカーで囲んで3〜5行のサマリーを出力すること:
PHASE_SUMMARY_START
（やったこと・成果・次のアクション を箇条書きで）
PHASE_SUMMARY_END
