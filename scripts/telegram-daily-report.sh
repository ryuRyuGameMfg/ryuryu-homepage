#!/bin/bash
# telegram-daily-report.sh - 日次進捗レポート
# Usage: bash telegram-daily-report.sh [--progress "進捗メッセージ"]

WORK_DIR="$HOME/repository/homepage-engine"
source "$WORK_DIR/.telegram.conf" 2>/dev/null || exit 0

STATE_FILE="$WORK_DIR/data/state.json"
NOTIFY_SCRIPT="$WORK_DIR/scripts/telegram-notify.sh"

# HTML特殊文字エスケープ
html_escape() {
  local s="$1"
  s="${s//&/&amp;}"
  s="${s//</&lt;}"
  s="${s//>/&gt;}"
  echo "$s"
}

# 日付を「M月D日」形式に変換（YYYY-MM-DD を入力）
format_date() {
  local raw="$1"
  if [[ "$raw" =~ ^([0-9]{4})-([0-9]{2})-([0-9]{2}) ]]; then
    local m="${BASH_REMATCH[2]#0}"
    local d="${BASH_REMATCH[3]#0}"
    echo "${m}月${d}日"
  else
    echo "$raw"
  fi
}

# 進捗通知モード
if [[ "${1:-}" == "--progress" ]]; then
  ESCAPED=$(html_escape "${2:-}")
  MSG="<b>進捗報告</b>

${ESCAPED}"
  bash "$NOTIFY_SCRIPT" "$MSG"
  exit 0
fi

# state.json から情報取得
MODE=$(jq -r '.mode // "?"' "$STATE_FILE" 2>/dev/null || echo "?")
STATUS=$(jq -r '.status // "?"' "$STATE_FILE" 2>/dev/null || echo "?")
LAST_RUN_RAW=$(jq -r '.last_run // ""' "$STATE_FILE" 2>/dev/null | cut -c1-10 || echo "")
LAST_DEPLOYED_RAW=$(jq -r '.last_deployed // ""' "$STATE_FILE" 2>/dev/null | cut -c1-10 || echo "")

DATE_LABEL=$(date '+%-m月%-d日')
LAST_RUN_LABEL=$(format_date "$LAST_RUN_RAW")
LAST_DEPLOYED_LABEL=$(format_date "$LAST_DEPLOYED_RAW")

# モードを自然文に変換
case "$MODE" in
  update) MODE_TEXT="ホームページのコンテンツ更新" ;;
  seo)    MODE_TEXT="ホームページのSEO最適化" ;;
  report) MODE_TEXT="ホームページのレポート生成" ;;
  *)      MODE_TEXT="ホームページの作業" ;;
esac

# ステータスで3パターン分岐
case "$STATUS" in
  running)
    if [[ -n "$LAST_DEPLOYED_RAW" ]]; then
      DEPLOYED_LINE="最終デプロイは${LAST_DEPLOYED_LABEL}に実施済みです。"
    else
      DEPLOYED_LINE=""
    fi
    MSG="<b>${DATE_LABEL}の報告</b>

${MODE_TEXT}を進めています。

${DEPLOYED_LINE}

引き続き作業を進めます。"
    ;;
  error)
    if [[ -n "$LAST_DEPLOYED_RAW" ]]; then
      DEPLOYED_LINE="最終デプロイは${LAST_DEPLOYED_LABEL}です。"
    else
      DEPLOYED_LINE=""
    fi
    MSG="<b>${DATE_LABEL}の報告</b>

処理中にエラーが発生しています。確認をお願いします。

${DEPLOYED_LINE}"
    ;;
  *)
    # idle およびその他
    if [[ -n "$LAST_RUN_RAW" ]]; then
      LAST_RUN_LINE="前回は${LAST_RUN_LABEL}に実施しました。"
    else
      LAST_RUN_LINE=""
    fi
    if [[ -n "$LAST_DEPLOYED_RAW" ]]; then
      DEPLOYED_LINE="最終デプロイは${LAST_DEPLOYED_LABEL}です。"
    else
      DEPLOYED_LINE=""
    fi
    MSG="<b>${DATE_LABEL}の報告</b>

本日は稼働していません。
${LAST_RUN_LINE}

${DEPLOYED_LINE}"
    ;;
esac

bash "$NOTIFY_SCRIPT" "$MSG"
exit 0
