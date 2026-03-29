# RYURYU GAME FACTORY ドキュメント

RYURYU GAME FACTORY 公式ホームページのプロジェクトドキュメントです。

## ドキュメント一覧

| ドキュメント | 説明 | 対象読者 |
|------------|------|---------|
| [プロダクト要求定義書](./product-requirements.md) | プロダクトビジョン、ターゲットユーザー、機能要件、KPI | PM、全員 |
| [機能設計書](./functional-design.md) | システム構成、データモデル、コンポーネント設計、API設計 | 開発者 |
| [アーキテクチャ設計書](./architecture.md) | 技術スタック、アーキテクチャパターン、パフォーマンス要件 | 開発者 |
| [リポジトリ構造定義書](./repository-structure.md) | ディレクトリ構造、命名規則、ファイル配置ルール | 開発者 |
| [開発ガイドライン](./development-guidelines.md) | コーディング規約、Git運用、テスト戦略、コードレビュー | 開発者 |
| [用語集](./glossary.md) | ドメイン用語、技術用語、略語の定義 | 全員 |

## プロジェクト概要

### 名称
**RYURYU GAME FACTORY 公式ホームページ** - VR/AR/ゲーム開発スタジオのポートフォリオサイト

### 技術スタック

| 分類 | 技術 | バージョン |
|------|------|-----------|
| フレームワーク | Next.js (App Router) | 15.4.x |
| 言語 | TypeScript | 5.9.x |
| UI | React | 19.1.x |
| スタイリング | Tailwind CSS | 3.4.x |
| アニメーション | Framer Motion | 12.x |
| アニメーション | GSAP (ScrollTrigger) | 3.x |
| 3D | Three.js | 0.182.x |
| 多言語 | i18next / react-i18next | 25.x / 15.x |
| テスト | Playwright | 1.57.x |
| デプロイ | Netlify | - |

### 外部サービス

| サービス | 用途 |
|---------|------|
| Google Apps Script | フォーム送信処理 |
| Google Sheets | お問い合わせデータ保存 |
| Google Analytics 4 | アクセス解析 |
| LINE公式アカウント | 問い合わせ導線 |

## クイックスタート

```bash
# 依存関係のインストール
npm install

# Playwrightブラウザのインストール
npx playwright install

# 開発サーバー起動
npm run dev

# ブラウザで確認
# http://localhost:3000
```

## 開発コマンド

```bash
npm run dev           # 開発サーバー起動
npm run build         # プロダクションビルド
npm run start         # プロダクションサーバー起動
npm run lint          # Lintチェック
npm run test:e2e      # E2Eテスト実行
npm run test:e2e:ui   # E2Eテスト（UIモード）
```

## ディレクトリ構造（概要）

```
ryuryu-homepage/
├── app/                # Next.js App Router
│   ├── api/            # API Routes
│   └── page.tsx        # ホームページ
├── components/         # Reactコンポーネント
├── data/csv/           # CSVデータ（ja/en）
├── docs/               # ドキュメント（本ディレクトリ）
├── e2e/                # E2Eテスト
├── hooks/              # カスタムHooks
├── lib/                # ユーティリティライブラリ
├── public/             # 静的アセット
│   └── locales/        # 翻訳JSON
└── CLAUDE.md           # Claude Code設定
```

詳細は [リポジトリ構造定義書](./repository-structure.md) を参照してください。

## サブディレクトリ

### gas/
Google Apps Script関連のドキュメントとスクリプト。
お問い合わせフォームのバックエンド設定に使用。

### ideas/
アイデアや下書きを格納するディレクトリ。
正式なドキュメントになる前の検討段階の内容を保存。

## 関連リンク

- 本番サイト: (Netlifyデプロイ先)
- リポジトリ: GitHub
- Google Sheets: お問い合わせデータ

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-12-30 | ドキュメント体系を整備（6ドキュメント作成） |
