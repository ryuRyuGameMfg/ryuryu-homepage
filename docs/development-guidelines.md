# 開発ガイドライン (Development Guidelines)

## コーディング規約

### 命名規則

#### 変数・関数

**原則**:
- 変数: camelCase、名詞または名詞句
- 関数: camelCase、動詞で始める
- 定数: UPPER_SNAKE_CASE
- Boolean: `is`, `has`, `should`で始める

**例**:
```typescript
// 良い例
const userEmail = 'test@example.com';
const isLoading = true;
const hasError = false;
function validateFormData(data: FormData): boolean { }
function fetchNewsItems(): Promise<News[]> { }
const MAX_RETRY_COUNT = 3;

// 悪い例
const data = '...';           // 曖昧
const flag = true;            // 意味不明
function process() { }        // 何をするか不明
```

#### コンポーネント・型

```typescript
// コンポーネント: PascalCase
function ContactForm() { }
function HeroSection() { }

// 型・インターフェース: PascalCase
interface ContactFormData { }
type ServiceCategory = 'vr-ar' | 'game' | 'cluster';

// Props型: コンポーネント名 + Props
interface ContactFormProps { }
interface ServiceCardProps { }
```

#### ファイル名

| 種別 | 規則 | 例 |
|------|------|-----|
| コンポーネント | PascalCase.tsx | `ContactForm.tsx` |
| Hooks | usePascalCase.ts | `useScrollPosition.ts` |
| ユーティリティ | camelCase.ts | `formatDate.ts` |
| 設定ファイル | kebab-case | `tailwind.config.ts` |
| テスト | kebab-case.spec.ts | `contact-form.spec.ts` |

### コードフォーマット

**インデント**: 2スペース

**行の長さ**: 最大100文字

**セミコロン**: 必須（ESLint設定に従う）

**クォート**: シングルクォート推奨（JSX内はダブルクォート）

### コメント規約

**関数・コンポーネントのドキュメント**:
```typescript
/**
 * お問い合わせフォームのバリデーションを行う
 *
 * @param data - フォームデータ
 * @returns バリデーション結果。エラーがある場合はエラーメッセージを含む
 */
function validateContactForm(data: ContactFormData): ValidationResult { }
```

**インラインコメント**:
```typescript
// 良い例: 「なぜ」を説明
// GASのレート制限を避けるため、送信間隔を空ける
await delay(1000);

// 悪い例: コードの内容を繰り返す
// 1000ms待機する
await delay(1000);
```

**日本語コメントを推奨**:
- チーム内コミュニケーションの効率化
- 複雑なビジネスロジックの説明

### エラーハンドリング

**原則**:
- 予期されるエラー: 適切に処理してユーザーにフィードバック
- 予期しないエラー: ログ出力して上位に伝播
- エラーを無視しない

**フォーム送信のエラーハンドリング例**:
```typescript
async function handleSubmit(data: ContactFormData) {
  try {
    setIsSubmitting(true);
    const response = await submitToGAS(data);

    if (!response.ok) {
      throw new Error('送信に失敗しました');
    }

    setIsSubmitted(true);
  } catch (error) {
    console.error('Form submission error:', error);
    setError('送信に失敗しました。再度お試しください。');
  } finally {
    setIsSubmitting(false);
  }
}
```

### TypeScript規約

**型定義**:
- `any`の使用を避ける
- `unknown`を使って安全に型ガード
- 戻り値の型を明示

**例**:
```typescript
// 良い例
function parseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

// 悪い例
function parseJSON(json: string): any {
  return JSON.parse(json);
}
```

### React/Next.js規約

**コンポーネント構造**:
```typescript
// 1. インポート
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// 2. 型定義
interface Props {
  title: string;
  onSubmit: () => void;
}

// 3. コンポーネント
export function MyComponent({ title, onSubmit }: Props) {
  // 3.1 Hooks
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // 3.2 イベントハンドラ
  const handleClick = () => {
    setIsLoading(true);
    onSubmit();
  };

  // 3.3 レンダリング
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>
        {t('common.submit')}
      </button>
    </div>
  );
}
```

**Hooks使用規則**:
- カスタムHooksは `use` プレフィックス必須
- 条件分岐内でHooksを呼ばない
- 依存配列を正確に指定

## Git運用ルール

### ブランチ戦略

**ブランチ種別**:
- `main`: 本番環境（Netlify自動デプロイ）
- `develop`: 開発の最新状態（作業用）
- `feature/[機能名]`: 新機能開発
- `fix/[修正内容]`: バグ修正
- `refactor/[対象]`: リファクタリング

**フロー**:
```
main (本番)
  └─ develop (開発)
      ├─ feature/add-blog-section
      ├─ feature/improve-form-validation
      └─ fix/mobile-menu-bug
```

**運用ルール**:
1. 開発作業は `develop` ブランチで実施
2. 大きな機能は `feature/` ブランチを作成
3. 動作確認後に `main` へマージ
4. `main` へのマージでNetlifyが自動デプロイ

### コミットメッセージ規約

**フォーマット**:
```
<type>: <subject>

<body>（任意）
```

**Type**:
- `feat`: 新機能追加
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: コードフォーマット（機能変更なし）
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルド、設定変更

**例**:
```
feat: お問い合わせフォームに予算選択を追加

fix: モバイルメニューが閉じない問題を修正

refactor: ContactFormのバリデーションロジックを分離

test: ナビゲーションのE2Eテストを追加
```

### プルリクエストプロセス

**作成前のチェック**:
- [ ] `npm run lint` でエラーがない
- [ ] `npm run build` が成功する
- [ ] `npm run test:e2e` でテストがパス
- [ ] ローカルで動作確認済み

## テスト戦略

### テストの種類

#### E2Eテスト（Playwright）

**対象**: ユーザーシナリオ全体

**実行コマンド**:
```bash
npm run test:e2e          # ヘッドレス実行
npm run test:e2e:ui       # UIモード
npm run test:e2e:headed   # ブラウザ表示
```

**テストファイル構成**:
```
e2e/
├── home.spec.ts          # ページ読み込み、SEO
├── navigation.spec.ts    # ナビゲーション
├── i18n.spec.ts          # 多言語
├── services.spec.ts      # サービスセクション
├── contact-form.spec.ts  # フォーム
├── news-faq.spec.ts      # ニュース・FAQ
├── cta-footer.spec.ts    # CTA・フッター
└── mobile.spec.ts        # モバイル対応
```

### テスト命名規則

**パターン**: `should [期待動作] when [条件]`

**例**:
```typescript
test('should display error message when email is invalid', async ({ page }) => {
  // ...
});

test('should scroll to contact section when clicking nav link', async ({ page }) => {
  // ...
});
```

## コードレビュー基準

### レビューポイント

**機能性**:
- [ ] 要件を満たしているか
- [ ] エッジケースが考慮されているか
- [ ] エラーハンドリングが適切か

**可読性**:
- [ ] 命名が明確か
- [ ] 複雑なロジックにコメントがあるか
- [ ] コンポーネントが適切に分割されているか

**保守性**:
- [ ] 重複コードがないか
- [ ] 責務が明確に分離されているか
- [ ] 既存パターンに従っているか

**パフォーマンス**:
- [ ] 不要な再レンダリングがないか
- [ ] 大きなコンポーネントが動的インポートされているか
- [ ] 画像が最適化されているか

**アクセシビリティ**:
- [ ] セマンティックHTMLを使用しているか
- [ ] alt属性が設定されているか
- [ ] キーボード操作が可能か

### レビューコメントの書き方

**優先度の明示**:
- `[必須]`: 修正必須、マージ前に対応
- `[推奨]`: 修正推奨、できれば対応
- `[提案]`: 検討してほしい、任意
- `[質問]`: 理解のための質問

**例**:
```
[必須] この関数は型が `any` になっています。適切な型を定義してください。

[推奨] このロジックは `useCallback` でメモ化すると再レンダリングを防げます。

[提案] この定数は `lib/constants.ts` に移動すると再利用しやすくなりそうです。

[質問] この条件分岐の意図を教えてください。
```

## 開発環境セットアップ

### 必要なツール

| ツール | バージョン | インストール方法 |
|--------|-----------|-----------------|
| Node.js | 24.x | `nvm install 24` |
| npm | 10.x | Node.jsに付属 |
| Git | 最新 | `brew install git` |

### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone https://github.com/[username]/ryuryu-homepage.git
cd ryuryu-homepage

# 2. 依存関係のインストール
npm install

# 3. Playwrightブラウザのインストール
npx playwright install

# 4. 環境変数の設定
cp .env.example .env.local
# .env.local を編集して必要な値を設定

# 5. 開発サーバーの起動
npm run dev

# 6. ブラウザで確認
# http://localhost:3000
```

### 開発コマンド

```bash
npm run dev           # 開発サーバー起動
npm run build         # プロダクションビルド
npm run start         # プロダクションサーバー起動
npm run lint          # Lintチェック
npm run test:e2e      # E2Eテスト実行
npm run test:e2e:ui   # E2Eテスト（UIモード）
```

## 多言語対応のガイドライン

### 翻訳ファイルの管理

**ファイル構成**:
```
public/locales/
├── ja/common.json    # 日本語
└── en/common.json    # 英語
```

### 翻訳キーの命名規則

**階層構造**: `セクション.要素.詳細`

**例**:
```json
{
  "nav": {
    "home": "ホーム",
    "about": "私たちについて"
  },
  "contact": {
    "form": {
      "name": "お名前",
      "email": "メールアドレス"
    }
  }
}
```

### コンポーネントでの使用

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <h1>{t('hero.title')}</h1>
  );
}
```

## セキュリティガイドライン

### 環境変数の管理

- APIキーは `.env.local` に保存
- `.env.local` は `.gitignore` に含める
- 公開可能な変数のみ `NEXT_PUBLIC_` プレフィックス

### 入力のサニタイズ

- ユーザー入力は必ずバリデーション
- HTMLエスケープを適用
- SQL/NoSQLインジェクション対策

### 依存関係のセキュリティ

```bash
# 脆弱性チェック
npm audit

# 脆弱性の修正
npm audit fix
```
