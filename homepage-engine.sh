#!/bin/bash
# ============================================================
# homepage-engine.sh — ゲーム開発所RYURYU ホームページ自律運用エンジン
# Architecture: Patrol -> Steering -> Executor -> Reviewer -> Transition
# Modes: update (月) -> seo (水) -> report (土) -> update ...
# ============================================================

set -euo pipefail

# ── 定数 ──────────────────────────────────────────────────────
ENGINE_DIR="$HOME/repository/homepage-engine"
HOMEPAGE_DIR="$HOME/repository/ryuryu-homepage"
STATE_FILE="$ENGINE_DIR/state.json"
LOG_DIR="$ENGINE_DIR/logs"
MEMORY_DIR="$ENGINE_DIR/memory"
AUTO_REPORTS="$HOME/repository/strategy-room/auto-reports/homepage-daily"

TELEGRAM_CONF="$ENGINE_DIR/.telegram.conf"
TELEGRAM_NOTIFY="$ENGINE_DIR/scripts/telegram-notify.sh"

MODE_TIMEOUT=3600        # 60分
ERROR_RETRY_SECONDS=1800 # 30分
MAX_CONSECUTIVE_ERRORS=3

ALLOWED_TOOLS="Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch,Agent,Task"

# ── 環境 ──────────────────────────────────────────────────────
export TZ="Asia/Tokyo"
export HOME="${HOME:-/Users/okamotoryuya}"
export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:$PATH"

TODAY=$(date +%Y-%m-%d)
NOW=$(date +%Y-%m-%dT%H:%M:%SZ)
LOG_FILE="$LOG_DIR/${TODAY}.log"

mkdir -p "$LOG_DIR" "$MEMORY_DIR/daily" "$AUTO_REPORTS"

# ── ログ ──────────────────────────────────────────────────────
log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }

# ── Telegram通知 ──────────────────────────────────────────────
telegram_notify() {
  local message="$1"
  if [[ -f "$TELEGRAM_NOTIFY" && -f "$TELEGRAM_CONF" ]]; then
    bash "$TELEGRAM_NOTIFY" "$message" || true
  fi
}

# ── 排他制御 ──────────────────────────────────────────────────
LOCK_FILE="/tmp/homepage_engine.lock"
if [ -f "$LOCK_FILE" ]; then
  log "別のhomepage-engineが実行中です。終了します。"
  exit 0
fi
echo $$ > "$LOCK_FILE"
trap "rm -f '$LOCK_FILE'" EXIT

# ── state.json 操作 ───────────────────────────────────────────
get_state() { python3 -c "import json,sys; d=json.load(open('$STATE_FILE')); print(d.get('$1',''))" 2>/dev/null || echo ""; }
set_state() {
  python3 - "$1" "$2" "$STATE_FILE" <<'EOF'
import json, sys
key, val, path = sys.argv[1], sys.argv[2], sys.argv[3]
with open(path) as f: d = json.load(f)
# 数値変換
try: val = int(val)
except: pass
d[key] = val
with open(path, 'w') as f: json.dump(d, f, ensure_ascii=False, indent=2)
EOF
}
next_mode() {
  case "$1" in
    update) echo "seo" ;;
    seo)    echo "report" ;;
    report) echo "update" ;;
    *)      echo "update" ;;
  esac
}

# ── Phase 0: 初期化 ───────────────────────────────────────────
log "=== homepage-engine 起動 ($TODAY) ==="

if [ ! -f "$STATE_FILE" ]; then
  log "state.json が見つかりません。終了します。"
  exit 1
fi

CURRENT_MODE=$(get_state mode)
CURRENT_STATUS=$(get_state status)
ITERATION=$(get_state iteration)
CONSECUTIVE_ERRORS=$(get_state consecutive_errors)

log "モード: $CURRENT_MODE | ステータス: $CURRENT_STATUS | Iter: $ITERATION | エラー: $CONSECUTIVE_ERRORS"

# ── Phase 1: Patrol ───────────────────────────────────────────
log "--- Phase 1: Patrol ---"

# スタック検出
if [ "$CURRENT_STATUS" = "running" ]; then
  LAST_RUN=$(get_state last_run)
  if [ -n "$LAST_RUN" ]; then
    LAST_TS=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$LAST_RUN" "+%s" 2>/dev/null || echo 0)
    NOW_TS=$(date +%s)
    ELAPSED=$((NOW_TS - LAST_TS))
    if [ $ELAPSED -gt $MODE_TIMEOUT ]; then
      log "スタック検出（${ELAPSED}秒経過）。ステータスをリセットします。"
      set_state status "idle"
      CURRENT_STATUS="idle"
    else
      log "前回実行から ${ELAPSED}秒。まだ実行中の可能性があります。"
      exit 0
    fi
  fi
fi

# 連続エラー上限チェック
if [ "$CONSECUTIVE_ERRORS" -ge "$MAX_CONSECUTIVE_ERRORS" ]; then
  log "連続エラー ${CONSECUTIVE_ERRORS}回。モード ${CURRENT_MODE} をスキップします。"
  NEXT_MODE=$(next_mode "$CURRENT_MODE")
  set_state mode "$NEXT_MODE"
  set_state consecutive_errors 0
  set_state status "idle"
  log "次モード: $NEXT_MODE"
  exit 0
fi

# ── Phase 2: Steering ─────────────────────────────────────────
log "--- Phase 2: Steering ---"
set_state status "running"
set_state last_run "$NOW"

# ── Phase 3: Executor ─────────────────────────────────────────
log "--- Phase 3: Executor ($CURRENT_MODE) ---"

# ワークスペース読み込み
SOUL=$(cat "$ENGINE_DIR/SOUL.md" 2>/dev/null || echo "")
STRATEGY=$(cat "$ENGINE_DIR/STRATEGY.md" 2>/dev/null || echo "")
MEMORY=$(cat "$ENGINE_DIR/MEMORY.md" 2>/dev/null || echo "")
AGENT=$(cat "$ENGINE_DIR/AGENT.md" 2>/dev/null || echo "")
DAILY_MEMORY=$(cat "$MEMORY_DIR/daily/${TODAY}.md" 2>/dev/null || echo "")
YESTERDAY=$(date -v-1d +%Y-%m-%d 2>/dev/null || date --date='yesterday' +%Y-%m-%d 2>/dev/null || echo "")
YESTERDAY_MEMORY=$(cat "$MEMORY_DIR/daily/${YESTERDAY}.md" 2>/dev/null || echo "")

# モード別プロンプト構築
build_prompt() {
  local mode="$1"
  local base_ctx="## SOUL（不変原則）
${SOUL}

## STRATEGY（運用戦略）
${STRATEGY}

## MEMORY（コンテキスト）
${MEMORY}

## AGENT（行動アルゴリズム）
${AGENT}

## 本日の記録（あれば）
${DAILY_MEMORY}

## 昨日の記録（あれば）
${YESTERDAY_MEMORY}

---
"

  case "$mode" in
    update)
      echo "${base_ctx}
# タスク: update モード

本日（${TODAY}）の update モードを実行してください。

AGENT.md の「update モード アルゴリズム」に従い、以下を実行してください：

1. ~/repository/note-engine/state.json を読み、前回 update 以降の新規記事を確認
2. ~/repository/zenn-engine/state.json を読み、前回 update 以降の新規記事を確認
3. 新記事があれば ~/repository/ryuryu-homepage/data/csv/news.csv に追記
   （既存フォーマットを必ず確認してから追記すること）
4. ~/repository/strategy-room/DAILY.md から KPI 数値を読み、
   ~/repository/ryuryu-homepage/data/csv/sections.csv の実績数値を更新
5. 変更があれば ~/repository/ryuryu-homepage/ で git commit && git push
   （コミットメッセージ: homepage: iter${ITERATION}_update {変更概要}）
6. ~/repository/homepage-engine/memory/daily/${TODAY}.md に実行記録を保存
7. ~/repository/homepage-engine/state.json の last_deployed を更新

変更がなかった場合も daily memory に「変更なし」と記録してください。
"
      ;;
    seo)
      echo "${base_ctx}
# タスク: seo モード

本日（${TODAY}）の seo モードを実行してください。

AGENT.md の「seo モード アルゴリズム」に従い、以下を実行してください：

1. WebSearch で「Unity 開発 外注」「VR 開発 受託」の競合上位サイトを3件調査
2. ~/repository/homepage-engine/memory/seo-queue.json の未実施タスクを確認
3. ~/repository/ryuryu-homepage/data/csv/services.csv のコピーを改善
   （ターゲットキーワードを自然に含める、数値を具体的に）
4. ~/repository/ryuryu-homepage/data/csv/sections.csv の hero/about テキストを確認・改善
5. 変更があれば ~/repository/ryuryu-homepage/ で git commit && git push
   （コミットメッセージ: homepage: iter${ITERATION}_seo {変更概要}）
6. seo-queue.json の実施済みタスクのステータスを「done」に更新
7. ~/repository/homepage-engine/memory/daily/${TODAY}.md に実行記録を保存

必ず既存の CSV フォーマットを Read で確認してから編集すること。
"
      ;;
    report)
      echo "${base_ctx}
# タスク: report モード

本日（${TODAY}）の report モードを実行してください。

AGENT.md の「report モード アルゴリズム」に従い、以下を実行してください：

1. ~/repository/homepage-engine/memory/daily/ の直近 7日分を読んでサマリー作成
2. 週次レポートを ~/repository/strategy-room/auto-reports/homepage-daily/${TODAY//-/_}.md に保存
   （フォーマット: 現状サマリー / 更新履歴 / SEO進捗 / 次サイクルの方針）
3. ~/repository/homepage-engine/HEARTBEAT.md の各チェック項目を実際に確認して更新
4. ~/repository/homepage-engine/MEMORY.md を見直し
   （古い情報を降格、新しい重要情報を昇格、100行以内に維持）
5. ~/repository/homepage-engine/memory/daily/${TODAY}.md に実行記録を保存

iteration のインクリメントは homepage-engine.sh が自動で行います（不要）。
"
      ;;
  esac
}

PROMPT=$(build_prompt "$CURRENT_MODE")

# Claude 実行
log "Claude 実行開始（タイムアウト: ${MODE_TIMEOUT}秒）"
EXEC_EXIT=0
timeout "$MODE_TIMEOUT" claude --allowedTools "$ALLOWED_TOOLS" -p "$PROMPT" \
  --output-format text \
  2>>"$LOG_FILE" || EXEC_EXIT=$?

if [ $EXEC_EXIT -ne 0 ]; then
  log "Claude 実行失敗 (exit: $EXEC_EXIT)"
  NEW_ERRORS=$((CONSECUTIVE_ERRORS + 1))
  set_state consecutive_errors "$NEW_ERRORS"
  set_state status "error"
  log "連続エラー: ${NEW_ERRORS}/${MAX_CONSECUTIVE_ERRORS}"
  telegram_notify "❌ *homepage-engine エラー*
モード: ${CURRENT_MODE} / Iter: ${ITERATION}
exit code: ${EXEC_EXIT} / 連続エラー: ${NEW_ERRORS}/${MAX_CONSECUTIVE_ERRORS}"
  if [ "$NEW_ERRORS" -lt "$MAX_CONSECUTIVE_ERRORS" ]; then
    log "クールダウン ${ERROR_RETRY_SECONDS}秒後に再試行予定"
  fi
  exit 1
fi

log "Claude 実行完了"
set_state consecutive_errors 0
telegram_notify "✅ *homepage-engine ${CURRENT_MODE} 完了*
モード: ${CURRENT_MODE} / Iter: ${ITERATION}
$(date '+%Y-%m-%d %H:%M')"

# ── Phase 4: Reviewer ─────────────────────────────────────────
log "--- Phase 4: Reviewer ---"
# git push は Claude が実行済み（Executor プロンプトに含まれる）
log "デプロイ（git push）は Claude が実行済み"

# ── Phase 5: Transition ───────────────────────────────────────
log "--- Phase 5: Transition ---"

NEXT_MODE=$(next_mode "$CURRENT_MODE")

# report → update 遷移時は iteration インクリメント
if [ "$CURRENT_MODE" = "report" ]; then
  NEW_ITER=$((ITERATION + 1))
  set_state iteration "$NEW_ITER"
  log "Iteration インクリメント: ${ITERATION} → ${NEW_ITER}"
fi

set_state mode "$NEXT_MODE"
set_state status "idle"
set_state last_run "$NOW"

log "モード遷移: ${CURRENT_MODE} → ${NEXT_MODE}"

# ── Housekeeping ──────────────────────────────────────────────
log "--- Housekeeping ---"
find "$LOG_DIR" -name "*.log" -mtime +7 -delete 2>/dev/null || true
log "7日以上前のログを削除"

log "=== homepage-engine 完了 ($CURRENT_MODE) ==="
exit 0
