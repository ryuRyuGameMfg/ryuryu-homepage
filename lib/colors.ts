/**
 * Color Regulation - サイト全体のカラーパレット定義
 *
 * このファイルはカラーの一貫性を保つためのリファレンスです。
 * 実際のスタイリングはTailwindクラスを使用します。
 *
 * カラースキーム: 水色（シアン）〜 濃い青
 *
 * HEX値リファレンス:
 * - cyan-400: #22d3ee
 * - cyan-500: #06b6d4
 * - cyan-600: #0891b2
 * - blue-400: #60a5fa
 * - blue-500: #3b82f6
 * - blue-600: #2563eb
 * - blue-700: #1d4ed8
 */

export const colorRegulation = {
  // ========================================
  // BRAND COLORS - ブランドカラー
  // ========================================
  brand: {
    // Primary: シアン系 - メインアクセント
    primary: {
      light: 'cyan-400',    // ホバー、リンク
      base: 'cyan-500',     // ボーダー、インジケーター
      dark: 'cyan-600',     // アクティブ状態
    },
    // Secondary: ブルー系 - サブアクセント
    secondary: {
      light: 'blue-400',    // ホバー
      base: 'blue-500',     // 装飾
      dark: 'blue-600',     // 強調
    },
    // Gradient: セクション区切り、装飾
    gradient: 'from-cyan-400 to-blue-600',
  },

  // ========================================
  // ACTION COLORS - アクションカラー
  // ========================================
  action: {
    // CTA Primary: メインボタン
    cta: {
      base: 'from-blue-600 to-cyan-600',
      hover: 'from-blue-700 to-cyan-700',
    },
    // Featured: 特別なアイテム（VR/ARなど）
    featured: {
      base: 'from-blue-600 to-cyan-600',
      hover: 'from-blue-700 to-cyan-700',
    },
  },

  // ========================================
  // SEMANTIC COLORS - 意味的カラー
  // ========================================
  semantic: {
    success: {
      text: 'green-400',
      bg: 'green-500',
      gradient: 'from-green-500 to-emerald-600',
    },
    error: {
      text: 'red-400',
      bg: 'red-500',
      border: 'red-500',
    },
    warning: {
      text: 'yellow-400',
      bg: 'yellow-500',
    },
    info: {
      text: 'blue-400',
      bg: 'blue-500',
    },
  },

  // ========================================
  // NEUTRAL COLORS - ニュートラルカラー
  // ========================================
  neutral: {
    text: {
      primary: 'white',       // メインテキスト
      secondary: 'gray-300',  // サブテキスト
      muted: 'gray-400',      // 薄いテキスト
      disabled: 'gray-500',   // 無効テキスト
    },
    border: {
      light: 'gray-600',
      base: 'gray-700',
    },
    surface: {
      base: 'gray-800',
      glass: 'gray-800/50',   // ガラス効果
      elevated: 'gray-700',
    },
    background: 'gray-900',
  },

  // ========================================
  // CATEGORY COLORS - カテゴリーカラー
  // ========================================
  category: {
    update: {
      bg: 'blue-500/20',
      text: 'blue-400',
      border: 'blue-500/30',
    },
    service: {
      bg: 'green-500/20',
      text: 'green-400',
      border: 'green-500/30',
    },
    event: {
      bg: 'blue-500/20',
      text: 'blue-400',
      border: 'blue-500/30',
    },
    achievement: {
      bg: 'yellow-500/20',
      text: 'yellow-400',
      border: 'yellow-500/30',
    },
  },

  // ========================================
  // EXTERNAL BRAND COLORS - 外部ブランドカラー
  // ========================================
  external: {
    coconala: 'from-green-500 to-emerald-500',  // ココナラ（緑）
    lancers: 'from-blue-600 to-cyan-600',       // ランサーズ（青→シアン）
    youtube: 'red-600',                          // YouTube
    line: 'from-green-500 to-emerald-500',      // LINE
  },
} as const

/**
 * Tailwind CSS クラス名のチートシート
 *
 * セクション区切り線:
 *   bg-gradient-to-r from-cyan-400 to-blue-600
 *
 * CTAボタン:
 *   bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700
 *
 * 成功状態:
 *   bg-gradient-to-r from-green-500 to-emerald-600
 *
 * リンクホバー:
 *   text-gray-400 hover:text-cyan-400
 *
 * フォーカスリング:
 *   focus:ring-2 focus:ring-cyan-500
 *
 * Q/Aアイコン:
 *   Q: bg-gradient-to-br from-cyan-500 to-cyan-600
 *   A: bg-gradient-to-br from-blue-500 to-blue-600
 *
 * グロー効果:
 *   shadow-[0_0_20px_rgba(6,182,212,0.3)]  // シアン
 *   shadow-[0_0_20px_rgba(37,99,235,0.3)]  // ブルー
 *
 * スクロールバー (globals.css):
 *   linear-gradient(135deg, #06b6d4, #2563eb)  // cyan-500 to blue-600
 */
