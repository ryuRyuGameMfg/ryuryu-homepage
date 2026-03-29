#!/bin/bash
# telegram-daily-report.sh - homepage-engine 日次進捗レポート
# Usage: bash telegram-daily-report.sh [--progress "進捗メッセージ"]

WORK_DIR="$HOME/repository/homepage-engine"
source "$WORK_DIR/.telegram.conf" 2>/dev/null || exit 0

STATE_FILE="$WORK_DIR/state.json"
NOTIFY_SCRIPT="$WORK_DIR/scripts/telegram-notify.sh"

# 進捗通知モード
if [[ "${1:-}" == "--progress" ]]; then
  MSG="⚡ *homepage-engine 進捗*
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

MSG="🌐 *homepage-engine 日次レポート* ${DATE} ${TIME}

*ステータス*: ${MODE} mode / Iter${ITER} / ${STATUS}
*最終実行*: ${LAST_RUN}
*最終デプロイ*: ${LAST_DEPLOYED}

*次のアクション*: ${MODE} mode 実行待機中"

bash "$NOTIFY_SCRIPT" "$MSG"
exit 0
