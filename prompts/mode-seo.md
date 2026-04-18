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
# タスク: seo モード

本日（{{TODAY}}）の seo モードを実行してください。

AGENT.md の「seo モード アルゴリズム」に従い、以下を実行してください：

1. WebSearch で「Unity 開発 外注」「VR 開発 受託」の競合上位サイトを3件調査
2. ~/repository/homepage-agent/memory/seo-queue.json の未実施タスクを確認
3. ~/repository/ryuryu-homepage/data/csv/services.csv のコピーを改善
   （ターゲットキーワードを自然に含める、数値を具体的に）
4. ~/repository/ryuryu-homepage/data/csv/sections.csv の hero/about テキストを確認・改善
5. 変更があれば ~/repository/ryuryu-homepage/ で git commit && git push
   （コミットメッセージ: homepage: iter{{ITERATION}}_seo {変更概要}）
6. seo-queue.json の実施済みタスクのステータスを「done」に更新
7. ~/repository/homepage-agent/memory/hot/{{TODAY}}.md に実行記録を保存

必ず既存の CSV フォーマットを Read で確認してから編集すること。

## 完了報告（必須）
作業完了時、必ず以下のマーカーで囲んで3〜5行のサマリーを出力すること:
PHASE_SUMMARY_START
（やったこと・成果・次のアクション を箇条書きで）
PHASE_SUMMARY_END
