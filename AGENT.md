# AGENT.md — 行動アルゴリズム

> このファイルは report モードで AI が結晶化・更新する。

## モード定義

| mode 値 | 実行内容 | 曜日 |
|---------|---------|------|
| "update" | コンテンツ更新（CSV）+ git push | 月曜 |
| "seo" | SEO改善（meta/コピー）+ git push | 水曜 |
| "report" | 週次レポート生成 + MEMORY/HEARTBEAT 更新 | 土曜 |

## update モード アルゴリズム

1. ~/repository/note-engine/state.json を読む
   - history の中で前回 update 以降の新記事を抽出
   - 新記事があれば news.csv に追記（title/date/url/description）
2. ~/repository/zenn-engine/state.json を読む
   - 同様に新記事があれば news.csv に追記
3. ~/repository/strategy-room/DAILY.md を読む
   - ★売上・実績件数・ランサーズ件数 を抽出
   - sections.csv の該当数値を更新
4. 変更があれば ~/repository/ryuryu-homepage/ で git add data/csv/ && git commit && git push
5. memory/daily/{DATE}.md に実行記録を保存

**news.csv フォーマット確認（既存フォーマットに合わせること）**

## seo モード アルゴリズム

1. WebSearch で「Unity 開発 外注」「VR 開発 受託」の競合サイトを調査
2. seo-queue.json の未実施タスクを確認
3. services.csv のコピーを改善（ターゲットキーワードを自然に含める）
4. sections.csv の hero/about セクションコピーを確認・改善
5. 変更があれば git add data/csv/ && git commit && git push
6. seo-queue.json の実施済みタスクにマーク

## report モード アルゴリズム

1. memory/daily/ の直近 7日分を読んでサマリー作成
2. 週次レポートを ~/repository/strategy-room/auto-reports/homepage-daily/{DATE}.md に保存
3. HEARTBEAT.md の各チェック項目を確認・更新
4. MEMORY.md を見直し（100行超過なら要約して降格）
5. state.json の iteration インクリメント（seo→report→update サイクル完了時）

## コミットメッセージ規約

```
homepage: iter{N}_{mode} {変更概要}
```

例:
- `homepage: iter0_update news.csv +2件, sections.csv KPI更新`
- `homepage: iter0_seo services.csv コピー改善`

## state.json モード遷移ルール

```
update → seo → report → update（ループ）
```
- report → update 遷移時: iteration インクリメント

## エラーハンドリング

- consecutive_errors が 3 に到達: 現在のモードをスキップ、次モードへ遷移
- エラー後クールダウン: 1800秒
- モード成功後: consecutive_errors を 0 リセット

## memory/daily/ 記録フォーマット

```markdown
# {YYYY-MM-DD} - Mode: {mode}

## 実行結果
- 更新ファイル: {ファイル名と変更概要}
- デプロイ: {成功/スキップ/失敗}
- 実行時刻: {HH:MM}

## 観察・メモ
- {観察内容}

## 課題
- {課題があれば記載}
```
