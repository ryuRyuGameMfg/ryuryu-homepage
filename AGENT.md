# AGENT.md — 行動アルゴリズム

> このファイルは report モードで AI が結晶化・更新する。

## モード定義

| mode 値 | 実行内容 | 曜日 |
|---------|---------|------|
| "weekly_report" | トレンド調査・SEO評価・デザイン提案・週次レポート生成 | 土曜 10:00 |

## weekly_report モード アルゴリズム

**社長への提案型レポート作成（Telegram送信）**

1. **トレンド・競合調査**
   - WebSearch で「Unity 開発 外注」「VR 開発 受託」の競合サイトを調査
   - ゲーム開発企業サイトのデザイントレンド分析
   - 競合5社の最新動向チェック

2. **SEO・AEO評価**
   - 検索順位変動確認
   - Schema Markup状況チェック
   - robots.txt確認（AIクローラー許可）

3. **デザイン提案**
   - フォント候補3案
   - 配色最適化案
   - レイアウト改善案

4. **議論トピック作成**
   - A案 vs B案形式でデザイン選択肢を提示
   - 実装難易度・効果予測を明記
   - 優先順位付き

5. **週次レポート保存**
   - ~/repository/homepage-engine/memory/reports/{DATE}.md に保存
   - MEMORY.md を見直し（100行超過なら要約して降格）
   - state.json の iteration インクリメント

6. **Telegram送信**
   - レポートをTelegramに送信
   - 社長からの返信を待機

**コンテンツ更新（note/Zenn記事追加、KPI数値更新）は社長からの指示待機**

## コミットメッセージ規約

```
homepage: iter{N}_weekly_report {変更概要}
```

例:
- `homepage: iter0_weekly_report トレンド調査・デザイン提案`
- `homepage: iter1_weekly_report 競合分析・フォント3案提案`

## state.json モード

```json
{
  "mode": "weekly_report",
  "iteration": 0,
  "status": "idle",
  "last_run": "2026-03-31T10:00:00Z"
}
```

- weekly_report 完了時: iteration インクリメント

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
