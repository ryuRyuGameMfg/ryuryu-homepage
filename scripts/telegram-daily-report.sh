#!/bin/bash
# telegram-daily-report.sh - homepage-engine 日次進捗レポート
# Usage: bash telegram-daily-report.sh [--progress "進捗メッセージ"]

WORK_DIR="$HOME/repository/homepage-engine"
source "$WORK_DIR/.telegram.conf" 2>/dev/null || exit 0

STATE_FILE="$WORK_DIR/state.json"
NOTIFY_SCRIPT="$WORK_DIR/scripts/telegram-notify.sh"

# 進捗通知モード
if [[ "${1:-}" == "--progress" ]]; then
  MSG="進捗

${2:-}"
  bash "$NOTIFY_SCRIPT" "$MSG"
  exit 0
fi

# state.json から情報取得
MODE=$(jq -r '.mode // "?"' "$STATE_FILE" 2>/dev/null || echo "?")
ITER=$(jq -r '.iteration // "?"' "$STATE_FILE" 2>/dev/null || echo "?")
STATUS=$(jq -r '.status // "?"' "$STATE_FILE" 2>/dev/null || echo "?")
LAST_RUN=$(jq -r '.last_run // "?"' "$STATE_FILE" 2>/dev/null | cut -c1-10 || echo "?")
LAST_DEPLOYED=$(jq -r '.last_deployed // "?"' "$STATE_FILE" 2>/dev/null | cut -c1-10 || echo "?")

DATE=$(date '+%Y-%m-%d')
TIME=$(date '+%H:%M')

# モード名をビジネス言語に変換
case "$MODE" in
  update) MODE_LABEL="コンテンツ更新" ;;
  seo)    MODE_LABEL="SEO最適化" ;;
  report) MODE_LABEL="レポート生成" ;;
  *)      MODE_LABEL="待機" ;;
esac

# ステータスをビジネス言語に変換
case "$STATUS" in
  idle)    STATUS_LABEL="完了・次サイクル待機中" ;;
  running) STATUS_LABEL="現在実行中" ;;
  error)   STATUS_LABEL="エラーが発生しています（要確認）" ;;
  *)       STATUS_LABEL="状態確認中" ;;
esac

MSG="日次レポート ${DATE}

【現在の状況】
作業フェーズ: ${MODE_LABEL}（第${ITER}サイクル）
状態: ${STATUS_LABEL}

【直近の活動】
最終処理日: ${LAST_RUN}
最終デプロイ日: ${LAST_DEPLOYED}

【次のアクション】
${MODE_LABEL}の次サイクルを予定通り実行します。

特別な連絡事項があればいつでもメッセージください。"

bash "$NOTIFY_SCRIPT" "$MSG"
exit 0
