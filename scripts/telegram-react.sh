#!/bin/bash
# telegram-react.sh - homepage-engine Telegram 応答（ラッパー）
# CONFIG_SH経由でtelegram-react-runner.shに委譲

export CONFIG_SH="${CONFIG_SH:-$HOME/.claude/bots/homepage-engine/config.sh}"
exec bash "$HOME/.claude/bots/lib/telegram-react-runner.sh" "$@"
