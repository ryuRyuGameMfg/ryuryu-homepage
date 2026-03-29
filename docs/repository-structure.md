# リポジトリ構造定義書 (Repository Structure Document)

## プロジェクト構造

```
ryuryu-homepage/
├── app/                       # Next.js App Router
│   ├── api/                   # API Routes
│   │   ├── contact/           # お問い合わせAPI
│   │   ├── faq/               # FAQ API
│   │   ├── news/              # ニュースAPI
│   │   ├── sections/          # セクション情報API
│   │   ├── services/          # サービスAPI
│   │   └── testimonials/      # テスティモニアルAPI
│   ├── globals.css            # グローバルCSS
│   ├── layout.tsx             # ルートレイアウト
│   ├── loading.tsx            # ローディングUI
│   ├── not-found.tsx          # 404ページ
│   ├── page.tsx               # ホームページ
│   └── sitemap.ts             # サイトマップ生成
├── components/                # Reactコンポーネント
├── data/                      # 静的データ
│   └── csv/                   # CSVデータファイル
│       ├── ja/                # 日本語データ
│       └── en/                # 英語データ
├── docs/                      # プロジェクトドキュメント
│   ├── ideas/                 # アイデア・下書き
│   └── gas/                   # GAS関連ドキュメント
├── e2e/                       # E2Eテスト (Playwright)
├── hooks/                     # カスタムReact Hooks
├── lib/                       # ユーティリティライブラリ
├── public/                    # 静的アセット
│   ├── fonts/                 # フォントファイル
│   ├── images/                # 画像ファイル
│   ├── locales/               # 翻訳ファイル
│   │   ├── ja/                # 日本語翻訳
│   │   └── en/                # 英語翻訳
│   ├── logos/                 # ロゴファイル
│   └── services/              # サービス画像
├── scripts/                   # ビルド・ユーティリティスクリプト
├── styles/                    # 追加スタイル
├── utils/                     # ユーティリティ関数
├── .steering/                 # ステアリングファイル（作業管理）
├── CLAUDE.md                  # Claude Code設定
├── netlify.toml               # Netlify設定
├── next.config.ts             # Next.js設定
├── package.json               # 依存関係定義
├── playwright.config.ts       # Playwright設定
├── postcss.config.mjs         # PostCSS設定
├── tailwind.config.ts         # Tailwind CSS設定
└── tsconfig.json              # TypeScript設定
```

## ディレクトリ詳細

### app/ (Next.js App Router)

**役割**: ページとAPIルートの定義

**配置ファイル**:
- `page.tsx`: ページコンポーネント
- `layout.tsx`: レイアウトコンポーネント
- `loading.tsx`: ローディングUI
- `error.tsx`: エラーUI
- `not-found.tsx`: 404ページ

**命名規則**:
- ファイル名は Next.js の規約に従う
- 動的ルートは `[param]` 形式

#### app/api/

**役割**: API Routes（サーバーサイドエンドポイント）

**構造**:
```
app/api/
├── contact/
│   └── route.ts          # POST /api/contact
├── faq/
│   └── route.ts          # GET /api/faq
├── news/
│   └── route.ts          # GET /api/news
├── sections/
│   └── route.ts          # GET /api/sections
├── services/
│   └── route.ts          # GET /api/services
└── testimonials/
    └── route.ts          # GET /api/testimonials
```

### components/ (Reactコンポーネント)

**役割**: 再利用可能なUIコンポーネント

**配置ファイル**:
- `*.tsx`: Reactコンポーネント

**命名規則**:
- PascalCase（例: `ContactForm.tsx`, `HeroSection.tsx`）
- セクションコンポーネント: `*Section.tsx`
- UI部品: 機能を表す名前（例: `Navigation.tsx`）

**分類**:
```
components/
├── [SectionName]Section.tsx   # セクションコンポーネント
├── [UIComponent].tsx          # UIコンポーネント
├── [Animation].tsx            # アニメーションコンポーネント
└── [Provider].tsx             # プロバイダーコンポーネント
```

**例**:
```
components/
├── HeroSection.tsx
├── AboutSection.tsx
├── ServicesSection.tsx
├── ContactSection.tsx
├── NewsSection.tsx
├── FAQSection.tsx
├── Navigation.tsx
├── Footer.tsx
├── ContactForm.tsx
├── FixedCTA.tsx
├── AnimatedText.tsx
├── GlitchTitle.tsx
├── ParticleBackground.tsx
├── I18nProvider.tsx
├── LenisProvider.tsx
└── GoogleAnalytics.tsx
```

### data/ (静的データ)

**役割**: CSVベースのコンテンツデータ

**構造**:
```
data/
└── csv/
    ├── ja/                    # 日本語コンテンツ
    │   ├── services.csv
    │   ├── news.csv
    │   ├── faq.csv
    │   └── testimonials.csv
    └── en/                    # 英語コンテンツ
        ├── services.csv
        ├── news.csv
        ├── faq.csv
        └── testimonials.csv
```

**命名規則**:
- kebab-case（例: `services.csv`）
- 言語別ディレクトリで管理

### docs/ (ドキュメント)

**配置ドキュメント**:
- `product-requirements.md`: プロダクト要求定義書
- `functional-design.md`: 機能設計書
- `architecture.md`: アーキテクチャ設計書
- `repository-structure.md`: リポジトリ構造定義書（本ドキュメント）
- `development-guidelines.md`: 開発ガイドライン
- `glossary.md`: 用語集

**サブディレクトリ**:
- `ideas/`: アイデア・下書き
- `gas/`: Google Apps Script関連

### e2e/ (E2Eテスト)

**役割**: Playwrightによるエンドツーエンドテスト

**構造**:
```
e2e/
├── home.spec.ts              # ホームページテスト
├── navigation.spec.ts        # ナビゲーションテスト
├── i18n.spec.ts              # 多言語テスト
├── services.spec.ts          # サービスセクションテスト
├── contact-form.spec.ts      # フォームテスト
├── news-faq.spec.ts          # ニュース・FAQテスト
├── cta-footer.spec.ts        # CTA・フッターテスト
└── mobile.spec.ts            # モバイル対応テスト
```

**命名規則**:
- kebab-case + `.spec.ts`（例: `contact-form.spec.ts`）

### hooks/ (カスタムHooks)

**役割**: 再利用可能なReact Hooks

**命名規則**:
- `use` プレフィックス + PascalCase（例: `useScrollPosition.ts`）

### lib/ (ライブラリ)

**役割**: ユーティリティライブラリ、設定

**配置ファイル**:
- `i18n.ts`: i18next設定
- `csvLoader.ts`: CSVローダー
- その他共通ライブラリ

### public/ (静的アセット)

**役割**: 静的ファイル（画像、フォント、翻訳など）

**構造**:
```
public/
├── fonts/                     # Webフォント
├── images/                    # 一般画像
├── locales/                   # 翻訳JSON
│   ├── ja/common.json
│   └── en/common.json
├── logos/                     # ロゴ画像
├── services/                  # サービス関連画像
├── favicon.ico
├── icon.png
├── apple-icon.png
├── opengraph-image.png
└── twitter-image.png
```

### utils/ (ユーティリティ)

**役割**: 汎用ユーティリティ関数

**命名規則**:
- camelCase（例: `formatDate.ts`）

## ファイル配置規則

### ソースファイル

| ファイル種別 | 配置先 | 命名規則 | 例 |
|------------|--------|---------|-----|
| ページ | app/ | page.tsx | app/page.tsx |
| APIルート | app/api/[name]/ | route.ts | app/api/contact/route.ts |
| コンポーネント | components/ | PascalCase.tsx | ContactForm.tsx |
| Hooks | hooks/ | usePascalCase.ts | useScrollPosition.ts |
| ライブラリ | lib/ | camelCase.ts | csvLoader.ts |
| ユーティリティ | utils/ | camelCase.ts | formatDate.ts |

### テストファイル

| テスト種別 | 配置先 | 命名規則 | 例 |
|-----------|--------|---------|-----|
| E2Eテスト | e2e/ | kebab-case.spec.ts | contact-form.spec.ts |

### データファイル

| データ種別 | 配置先 | 命名規則 | 例 |
|-----------|--------|---------|-----|
| CSVデータ | data/csv/[lang]/ | kebab-case.csv | services.csv |
| 翻訳JSON | public/locales/[lang]/ | common.json | common.json |
| 画像 | public/images/ | kebab-case | hero-bg.jpg |

## 命名規則

### ディレクトリ名

- **機能ディレクトリ**: kebab-case（例: `contact-form/`）
- **言語ディレクトリ**: ISO 639-1コード（例: `ja/`, `en/`）

### ファイル名

**TypeScript/React**:
- コンポーネント: PascalCase（例: `ContactForm.tsx`）
- Hooks: usePascalCase（例: `useScrollPosition.ts`）
- ユーティリティ: camelCase（例: `formatDate.ts`）
- 設定ファイル: kebab-case（例: `tailwind.config.ts`）

**テスト**:
- E2Eテスト: kebab-case.spec.ts（例: `contact-form.spec.ts`）

**データ**:
- CSV: kebab-case.csv（例: `services.csv`）
- JSON: kebab-case.json（例: `common.json`）

## 依存関係のルール

### コンポーネント間の依存

```
Page Components (app/)
    ↓ (OK)
Section Components (components/*Section.tsx)
    ↓ (OK)
UI Components (components/*.tsx)
    ↓ (OK)
Hooks (hooks/)
    ↓ (OK)
Utils/Lib (utils/, lib/)
```

**禁止される依存**:
- Utils → Components
- Hooks → Components（Provider除く）
- API Routes → Components

### 循環依存の禁止

循環依存が発生した場合:
1. 共通部分を `lib/` または `utils/` に抽出
2. インターフェースで依存を分離

## スケーリング戦略

### コンポーネントの追加

**セクション追加時**:
1. `components/[Name]Section.tsx` を作成
2. `app/page.tsx` で動的インポート
3. 必要に応じてAPI Route追加

**UI部品追加時**:
1. `components/[Name].tsx` を作成
2. 既存コンポーネントから参照

### データの追加

**コンテンツ追加時**:
1. `data/csv/ja/` と `data/csv/en/` に追加
2. 必要に応じてAPI Route追加
3. 翻訳キーを `public/locales/*/common.json` に追加

### ファイルサイズの管理

**分割の目安**:
- コンポーネント: 300行以下推奨
- 300-500行: サブコンポーネントへの分割を検討
- 500行以上: 必ず分割

## 特殊ディレクトリ

### .steering/ (ステアリングファイル)

**役割**: 作業単位のドキュメント管理

**構造**:
```
.steering/
└── [YYYYMMDD]-[task-name]/
    ├── requirements.md       # 要求内容
    ├── design.md             # 設計
    └── tasklist.md           # タスクリスト
```

**例**: `.steering/20250130-add-blog-feature/`

## 除外設定

### .gitignore

```
# 依存関係
node_modules/

# ビルド成果物
.next/
out/

# テスト結果
playwright-report/
test-results/

# 環境変数
.env
.env.local
.env.*.local

# OS固有
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/

# ステアリングファイル（オプション）
# .steering/

# レガシー（Unity関連）
Assets/
Packages/
ProjectSettings/
```

## レガシーディレクトリ（参考）

以下のディレクトリは過去のUnityプロジェクトの名残であり、Next.jsプロジェクトでは使用しません:

- `Assets/` - Unity アセット
- `Packages/` - Unity パッケージ
- `ProjectSettings/` - Unity 設定

これらは将来的に削除を検討してください。
