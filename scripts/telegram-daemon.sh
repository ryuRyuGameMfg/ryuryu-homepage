#!/bin/bash
# telegram-daemon.sh - homepage-engine Telegram デーモン（ラッパー）
# 共通ロジック: ~/.claude/scripts/telegram-daemon-core.sh

CONFIG_SH="$HOME/.claude/bots/homepage-engine/config.sh"
exec bash "$HOME/.claude/scripts/telegram-daemon-core.sh" "$CONFIG_SH"
