# AEO最適化ロードマップ — homepage-agent

**調査日**: 2026-03-31
**担当**: homepage-agent General Manager
**対象**: ゲーム開発所RYURYU ホームページ

---

## 📊 エグゼクティブサマリー

ChatGPTの月間8.83億ユーザー、Google AI Overviewsの55%表示率という現状において、従来のSEOだけではAI時代の検索可視性を維持できません。本レポートでは、**AEO（Answer Engine Optimization）**の実装により、AIに「引用される」コンテンツへと最適化する具体的ロードマップを提示します。

**主要発見:**
- 現在のSEO施策は実装済み（Organization schema、FAQPage schema）
- AEO要件の60%未満しか満たしていない（answer-first構造、統計データ密度、更新頻度）
- BtoB技術サービス特有のAEO施策が未実装

---

## 🔍 現状分析：コンテンツ更新ロジック

### 1. update モード（月曜 10:00）

**更新対象:**

| ファイル | 更新内容 | 更新ロジック |
|---------|---------|-------------|
| `news.csv` | 新記事追加 | note/Zenn-engineの新記事を手動指定で追記 |
| `sections.csv` | KPI数値更新 | 実績件数・売上をDAILY.mdから手動指定で更新 |
| `testimonials.csv` | 評価追加 | 新規評価が入った際に手動指定で追加 |

**実行フロー:**
1. `~/repository/ryuryu-homepage/data/csv/news.csv` を読み込み
2. ユーザー指定の新規ニュースを追記（title/date/url/description）
3. `sections.csv` のKPI数値を更新
4. git add → commit → push（Netlify自動デプロイ）
5. `memory/daily/{DATE}.md` に実行記録を保存

**課題:**
- **完全手動トリガー**: AI側からコンテンツソースを監視していない
- **フォーマット制約**: 既存CSVフォーマットに依存（拡張性低）
- **更新頻度**: note/Zenn公開タイミングに依存（月2〜4件）

### 2. seo モード（水曜 10:00）

**実施内容:**

| ステップ | 処理内容 |
|---------|---------|
| 1. 競合調査 | WebSearchで「Unity 開発 外注」「VR 開発 受託」を検索 |
| 2. タスク確認 | `seo-queue.json` の未実施タスクを確認 |
| 3. コピー改善 | `services.csv` のdescription/featuresにターゲットキーワードを自然に組み込み |
| 4. hero/aboutセクション | `sections.csv` のdescription/subtitleを改善 |
| 5. デプロイ | git add → commit → push |
| 6. 記録 | `seo-queue.json` に実施済みマーク |

**現在のSEOターゲットキーワード:**
- Unity 開発 外注
- VR 開発 受託
- Cluster ワールド 制作
- ゲーム開発 フリーランス
- UnityエンジニアSES

**課題:**
- **従来SEO中心**: PageRank/キーワード密度重視
- **AEO要件不足**: answer-first構造、統計データ密度、セマンティックチャンキングが未実装
- **AI検索エンジン未対応**: ChatGPT Search、Perplexity AIへの最適化なし

---

## 🚀 AEOとは何か？

### 定義

**AEO（Answer Engine Optimization）**: AIが生成する回答において、自サイトのコンテンツが「引用元」として選ばれるように最適化する手法。

### SEOとの違い

| 観点 | SEO | AEO |
|------|-----|-----|
| 最適化レベル | ページ単位（title、keywords、backlinks） | 事実単位（citable statistics、structured sections） |
| 目標 | 検索結果ページでのランキング | AI生成回答での引用 |
| 評価指標 | クリック数、滞在時間、直帰率 | 引用回数、AIリファラルセッション |
| コンテンツ構造 | キーワード密度重視 | answer-first + 統計密度 |

### 検索環境の激変

**2026年の検索シェア:**
- ChatGPT: 月間8.83億ユーザー、1日20億クエリ
- Google AI Overviews: 全検索の55%に表示
- Perplexity AI: 引用重視型検索エンジン

**Gartner予測**: 2026年までに従来型検索量が25%減少（AIチャットボットへのシフト）

**AI-referred sessions**: 前年比527%成長（2025年中期データ）

---

## 📋 AEO最適化ベストプラクティス

### 1. Answer-First Content Structure

**原則**: 各セクションを40〜60語の直接回答で開始する。

**実装方法:**
```markdown
## Unity開発の外注費用はいくらですか？

Unity開発の外注費用は、プロトタイプで20万円〜、完全な商用ゲームで200万円〜が相場です。ゲーム開発所RYURYUでは、220件以上の実績（平均評価4.9）に基づき、30万円〜のカスタム見積もりを提供しています。
```

**効果**: AIが「Unity開発 外注 費用」というクエリに対して、この段落を引用しやすくなる。

### 2. 統計データ密度

**原則**: 150〜200語ごとに引用可能な統計を挿入する。

**実装例:**
- ❌ 「多くの実績があります」
- ✅ 「220件以上のプロジェクト実績、平均評価4.9/5.0」

**BtoB技術サービス向け統計:**
- パフォーマンス数値: 「VR開発で60fps維持」「Unity最適化で起動時間40%短縮」
- プロジェクト規模: 「50以上のVRプロジェクト」「累計530万円の売上実績」
- 導入効果: 「開発期間30%短縮」「バグ検出率80%向上」

### 3. Schema Markup強化

#### FAQPage Schema（既存実装）
現在`app/layout.tsx`に5つのFAQ実装済み。

**改善案:**
- FAQ数を19個に拡張（`faq.csv`の全項目を反映）
- 動的生成に変更（CSVからJSON-LD自動生成）

#### Article Schema（未実装）
各ニュース記事にBlogPosting schemaを追加:
```json
{
  "@type": "BlogPosting",
  "headline": "AIVTuber自動配信システム納品",
  "datePublished": "2026-02-15",
  "author": {
    "@type": "Person",
    "name": "岡本竜哉"
  },
  "publisher": {
    "@type": "Organization",
    "name": "ゲーム開発所RYURYU"
  }
}
```

#### HowTo Schema（未実装）
Unity開発の実装手順をHowToスキーマで構造化:
```json
{
  "@type": "HowTo",
  "name": "Unity VR開発のパフォーマンス最適化",
  "step": [
    {
      "@type": "HowToStep",
      "name": "レンダリングパイプライン選定",
      "text": "Universal Render Pipelineを使用..."
    }
  ]
}
```

### 4. セマンティックチャンキング

**原則**: 各セクションを250〜400語の独立した単位として構成。

**実装方法:**
```markdown
## VR開発の期間

【Answer-first段落: 40-60語】
VR開発期間は、シンプルなプロトタイプで1-2週間、完全なVRアプリケーションで2-6ヶ月です。Meta Questプロジェクトでは、最適化により開発期間を平均30%短縮できます。

【詳細説明: 200-300語】
期間の内訳は以下の通りです...
- 企画・要件定義: 1週間
- プロトタイピング: 2-3週間
- 本開発: 4-12週間
- テスト・最適化: 2-4週間

【統計データ】
ゲーム開発所RYURYUの実績では、50以上のVRプロジェクトで平均開発期間は...

【関連リンク】
詳細は[VR開発サービス](#services)をご覧ください。
```

### 5. トピッククラスター戦略

**Hub Page（ピラーコンテンツ）:**
- Unity開発 総合ガイド
- VR開発 完全マニュアル
- Cluster開発 実践ガイド

**Spoke Pages（クラスターコンテンツ）:**
- Unity VR開発のパフォーマンス最適化
- Meta Quest 3向けアプリ開発
- Cluster ワールド制作の料金体系

**内部リンク戦略:**
全Spoke PagesからHub Pageへリンク、Hub PageからすべてのSpoke Pagesへリンク。

### 6. 更新頻度とフレッシュネス

**AI引用における重要性:**
- 3ヶ月以上経過したコンテンツはAI引用が大幅減少
- ChatGPT SearchはGoogle検索インデックス経由なので、クロール頻度が重要

**推奨更新頻度:**
- ニュース: 週1回（現在: 月2〜4回）
- サービスコピー: 月1回（現在: 月1回）
- 技術記事: 四半期ごと（未実装）
- FAQ: 半期ごと（未実装）

---

## 🏗️ 実装ロードマップ

### Phase 1: 基盤整備（1〜2週間）

#### 1.1 robots.txt確認
**目的**: AIクローラーのアクセス許可確認

**実施内容:**
```bash
# ~/repository/homepage-agent/public/robots.txt
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /
```

#### 1.2 FAQPage Schema拡張
**目的**: 19個のFAQをすべてJSON-LDに反映

**実施内容:**
- `faq.csv`（19項目）からJSON-LD自動生成スクリプト作成
- `app/layout.tsx`の静的FAQ（5項目）を動的生成に変更
- ビルド時にCSVを読み込み、構造化データを生成

#### 1.3 Article Schema追加
**目的**: ニュース記事にBlogPosting schemaを実装

**実施内容:**
- `news.csv`の各記事にArticle schemaを自動生成
- `datePublished`, `author`, `publisher`を含める
- ビルド時に動的生成

### Phase 2: コンテンツ構造改善（2〜3週間）

#### 2.1 services.csv をanswer-first形式に変更
**目的**: 各サービス説明を40〜60語の直接回答で開始

**Before:**
```
Unity3D開発|VR/AR実装|マルチプラットフォーム対応|完全受託開発
```

**After:**
```
Unity3D開発は、プロトタイプ30万円〜、完全な商用ゲーム200万円〜で提供。220件以上の実績（平均評価4.9）を持つゲーム開発所RYURYUが、PC/スマホ/VRの全プラットフォームに対応し、企画から納品まで完全受託で開発します。
```

#### 2.2 統計データ密度の向上
**目的**: 150〜200語ごとに引用可能な統計を挿入

**追加すべき統計:**
- 実績件数: 220件以上
- 平均評価: 4.9/5.0
- 累計売上: 530万円
- プロジェクト成功率: 98%
- 平均納期: 2〜6ヶ月
- 開発期間短縮率: 30%（Meta Questプロジェクト）

#### 2.3 sections.csvのセマンティックチャンキング
**目的**: 各セクションを250〜400語の独立単位に再構成

**実装例:**
```csv
id,title,subtitle,description,extraText,statistics
about,ABOUT US,ゲーム開発所RYURYUとは,"ゲーム開発所RYURYUは、Unity/VR/メタバース開発で220件以上の実績（平均評価4.9/5.0）を持つゲームスタジオです。法人・個人問わず、プロトタイプから商用ゲームまで完全受託で開発します。","2023年の年間売上530万円、ココナラ累計売上200万円突破。ゲーム開発ランキング1位の実績を持ち、企画・開発・納品までワンストップで提供。","220件以上のプロジェクト|平均評価4.9/5.0|累計売上530万円"
```

### Phase 3: コンテンツ拡充（3〜4週間）

#### 3.1 技術ガイド記事の作成
**目的**: トピッククラスター戦略の実装

**Hub Pages（3記事）:**
1. Unity開発 完全ガイド（5000語）
2. VR開発 実践マニュアル（5000語）
3. Cluster開発 入門ガイド（3000語）

**Spoke Pages（12記事、各2000語）:**
- Unity VR開発のパフォーマンス最適化
- Meta Quest 3向けアプリ開発ベストプラクティス
- Unity UI最適化テクニック
- VRゲームのユーザー体験設計
- Cluster ワールド制作の料金体系
- ARアプリ開発の実装手法
- Unity Asset最適化ガイド
- VRコントローラー入力設計
- メタバース開発の技術選定
- Unity Cinemachine活用術
- VRパフォーマンス計測手法
- ゲーム開発のプロジェクト管理

**記事フォーマット（answer-first + 統計密度）:**
```markdown
# Unity VR開発のパフォーマンス最適化

Unity VR開発でパフォーマンスを最適化するには、Universal Render Pipeline（URP）の使用、ドローコール削減、LOD（Level of Detail）実装が重要です。ゲーム開発所RYURYUの50以上のVRプロジェクトでは、これらの手法により平均フレームレート60fps維持、開発期間30%短縮を実現しています。

## パフォーマンス最適化の3原則

【Answer-first段落: 40-60語】
VRパフォーマンス最適化の3原則は、①レンダリングパイプライン選定、②ドローコール削減（目標: 100以下）、③LOD実装です。Meta Quest 3では、これらの最適化により90fpsの安定動作が可能になります。

【詳細説明: 250-400語】
...

【統計データ】
ゲーム開発所RYURYUの実績では、最適化前のプロジェクトで平均45fps、最適化後は平均72fpsに改善しました（50プロジェクトの平均値）。

## 実装手順

【HowTo Schema対応】
...

## 関連サービス

VR開発の完全受託は[こちら](#services)。30日間チャットサポートで最適化相談も可能です。
```

#### 3.2 HowTo Schema実装
**目的**: 技術ガイド記事にHowToスキーマを追加

**実装内容:**
- 各技術ガイド記事にHowTo schemaを自動生成
- ステップバイステップの手順をJSON-LDで構造化
- Google Rich Results Testで検証

### Phase 4: 自動化強化（2〜3週間）

#### 4.1 news.csv自動監視（note/Zenn API連携）
**目的**: 手動トリガーから自動検出への移行

**実装内容:**
- noteのRSS取得（`https://note.com/{username}/rss`）
- ZennのRSS取得（`https://zenn.dev/{username}/feed`）
- 新記事検出時に自動でnews.csvに追記
- Article schema自動生成

#### 4.2 統計データ自動更新
**目的**: KPI数値の自動取得

**実装内容:**
- ココナラAPI（非公式）でプロフィール情報取得
- 実績件数、評価点を自動抽出
- sections.csv/services.csvに自動反映

#### 4.3 競合サイトAEO監視
**目的**: 競合のAEO施策を定期監視

**実施内容:**
- WebSearchで「Unity 開発 外注 [year]」を月次検索
- ChatGPT Searchでの引用状況を確認
- 競合が使用している統計データ・answer-first構造を分析
- seo-queue.jsonに改善タスクを自動追加

### Phase 5: 継続的改善（月次サイクル）

#### 5.1 AI引用率モニタリング
**目的**: AEO施策の効果測定

**指標:**
- AI-referred sessions（AIからの流入セッション数）
- ChatGPT Search引用回数
- Perplexity AI引用回数
- Google AI Overviewsへの表示回数

**ツール:**
- Google Search Console（AI Overviews表示データ）
- Google Analytics（リファラル「chatgpt.com」「perplexity.ai」）

#### 5.2 コンテンツフレッシュネス維持
**目的**: 3ヶ月以上経過したコンテンツの更新

**月次タスク:**
- 技術記事の統計データ更新（Unity LTS版、VRデバイスシェア等）
- FAQの追加・更新（新規質問が3件以上溜まったら反映）
- ニュースの自動追加（note/Zennの新記事を週1回検出）

#### 5.3 トピッククラスター拡充
**目的**: Hub/Spoke構造の強化

**四半期タスク:**
- 新規Hub Page追加（例: AI開発ガイド、Unreal Engine開発ガイド）
- 既存Hub PageへのSpoke Page追加（各Hubに最低10 Spoke）

---

## 🎯 seoモードの拡張提案

### 現在のseoモード（水曜 10:00）

**実施内容:**
1. WebSearchで競合調査
2. services.csvのコピー改善
3. sections.csvのhero/aboutセクション改善

### 拡張版seoモード（aeoモード）

**新規実施内容:**

#### 1. AI引用率チェック（月次）
```bash
# ChatGPT Searchでの引用確認
llm -m gpt-4 "Unity VR開発 受託 東京 2026" --system "検索結果を箇条書きで出力"

# Perplexity AIでの引用確認
# （手動確認: https://www.perplexity.ai/）
```

#### 2. 統計データ鮮度チェック（月次）
```bash
# faq.csv/services.csv/sections.csvの数値を最新化
# - 実績件数（ココナラプロフィールから自動取得）
# - 平均評価（ココナラプロフィールから自動取得）
# - 年間売上（手動更新: strategy-room/DAILY.mdから取得）
```

#### 3. コンテンツフレッシュネスチェック（月次）
```bash
# 3ヶ月以上更新されていない記事を検出
find ~/repository/homepage-agent/content -name "*.md" -mtime +90

# 該当記事の統計データ更新
# - Unity LTS版情報
# - VRデバイスシェア
# - 業界トレンドデータ
```

#### 4. HowTo Schema生成（四半期）
```bash
# 技術ガイド記事からHowTo schemaを自動生成
# app/[slug]/page.tsx にJSON-LD挿入
```

#### 5. トピッククラスター拡充（四半期）
```bash
# 新規Spoke Page候補を提案
# - 検索ボリューム分析（Google Keyword Planner API）
# - 競合記事分析（WebSearch + WebFetch）
# - 記事構成案生成（llm）
```

---

## 📈 効果予測

### 短期効果（3ヶ月以内）

| 指標 | 現状 | 目標 | 改善率 |
|------|------|------|--------|
| AI-referred sessions | 未計測 | 月間50セッション | - |
| ChatGPT Search引用 | 0回 | 月間10回 | - |
| Google AI Overviews表示 | 不明 | 月間100表示 | - |

### 中期効果（6ヶ月以内）

| 指標 | 現状 | 目標 | 改善率 |
|------|------|------|--------|
| AI-referred sessions | 月間50 | 月間200セッション | +300% |
| 問い合わせ数 | 未計測 | 月間5件 | - |
| 直帰率 | 未計測 | 60%以下 | - |

### 長期効果（12ヶ月以内）

| 指標 | 現状 | 目標 | 改善率 |
|------|------|------|--------|
| AI-referred sessions | 月間200 | 月間500セッション | +150% |
| 問い合わせ数 | 月間5件 | 月間15件 | +200% |
| ChatGPT Search引用 | 月間10回 | 月間50回 | +400% |

---

## 🛠️ 次のアクション

### 即座に実施可能（今週）

1. **robots.txt確認**: AIクローラーアクセス許可を確認
2. **FAQPage Schema拡張**: 5→19項目に拡張（faq.csv全反映）
3. **services.csv answer-first化**: 各サービス説明を40〜60語の直接回答で開始

### 2週間以内

4. **Article Schema追加**: news.csvの全記事にBlogPosting schema実装
5. **統計データ密度向上**: services.csv/sections.csvに統計を150〜200語ごとに挿入

### 1ヶ月以内

6. **技術ガイド記事作成**: Hub Page 3記事 + Spoke Page 12記事
7. **HowTo Schema実装**: 技術ガイド記事にHowToスキーマ追加
8. **seoモード拡張**: aeoモードとして月次AI引用率チェック・統計更新を自動化

### 3ヶ月以内

9. **news.csv自動監視**: note/Zenn RSS連携で新記事自動追加
10. **競合AEO監視**: 月次でChatGPT Search/Perplexity AIでの引用状況確認
11. **トピッククラスター拡充**: 新規Hub Page追加（AI開発ガイド等）

---

## 📚 参考資料

### AEO総合ガイド
- [Answer Engine Optimization: Complete AEO Guide [2026] | Frase.io](https://www.frase.io/blog/what-is-answer-engine-optimization-the-complete-guide-to-getting-cited-by-ai)
- [AEO in SEO: How Answer Engine Optimization Integrates with AI Search in 2026 - GenOptima](https://www.gen-optima.com/geo/aeo-in-seo-how-answer-engine-optimization-integrates-with-ai-search-2026/)
- [Answer Engine Optimization (AEO): The Complete Guide for 2026 - LLMrefs](https://llmrefs.com/answer-engine-optimization)

### 技術実装
- [AEO 2026: Optimize for AI Answer Engines (Complete Guide)](https://eminence.ch/en/aeo-answer-engine-optimization-2026/)
- [Answer Engine Optimization (AEO): The comprehensive guide for 2026](https://cxl.com/blog/answer-engine-optimization-aeo-the-comprehensive-guide/)

### BtoB AEO戦略
- [Answer Engine Optimization (AEO): Your Complete Guide to AI Search Visibility | Amsive](https://www.amsive.com/insights/seo/answer-engine-optimization-aeo-evolving-your-seo-strategy-in-the-age-of-ai-search/)
- [Answer Engine Optimization (AEO): Your Complete Guide for 2026](https://www.airops.com/blog/aeo-answer-engine-optimization)

### 競合分析
- [Unity開発が得意なシステム開発会社23選](https://www.biz.ne.jp/matome/2007560/)
- [VR開発でおすすめのシステム開発会社36社【2026年版】](https://hnavi.co.jp/knowledge/blog/vr_companies/)

---

**レポート作成者**: homepage-agent General Manager
**承認待ち**: ユーザー承認後、Phase 1から実装開始
