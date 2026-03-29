/**
 * メール設定（共通）
 */
const EMAIL_CONFIG = {
  FROM_NAME: 'ゲーム開発所RYURYU',
  REPLY_TO: 'ryuyaokamoto0717@gmail.com'
};

/**
 * お客様向け自動返信メール（カテゴリ別）
 */
const CUSTOMER_EMAIL = {
  // カテゴリ別の件名
  SUBJECTS: {
    'ゲーム開発のご依頼': '【ゲーム開発所RYURYU】ゲーム開発のご依頼を承りました',
    'Unity開発について': '【ゲーム開発所RYURYU】Unity開発についてのお問い合わせを承りました',
    'Web制作のご相談': '【ゲーム開発所RYURYU】Web制作のご相談を承りました',
    'その他のお問い合わせ': '【ゲーム開発所RYURYU】お問い合わせありがとうございます',
    'default': '【ゲーム開発所RYURYU】お問い合わせを受け付けました'
  },
  
  // カテゴリ別の本文テンプレート
  BODY_TEMPLATES: {
    'ゲーム開発のご依頼': function(data, formattedTimestamp) {
      return `
${data.name} 様

この度は、ゲーム開発のご依頼をいただき、誠にありがとうございます。

お問い合わせ内容を確認させていただき、
プロジェクトの詳細について担当者よりご連絡させていただきます。

【確認事項】
・開発規模とご予算の詳細
・希望納期とマイルストーン
・必要な機能と技術要件
・参考となるゲームやイメージ

━━━━━━━━━━━━━━━━━━━━━━━━
■ 受付内容
━━━━━━━━━━━━━━━━━━━━━━━━
受付番号: ${data.id}
受付日時: ${formattedTimestamp}
カテゴリ: ${data.category}
予算: ${data.budget || '未入力'}
希望納期: ${data.deadline || '未入力'}

お問い合わせ内容:
${data.message}
━━━━━━━━━━━━━━━━━━━━━━━━

${EMAIL_FOOTER}`;
    },
    
    'Unity開発について': function(data, formattedTimestamp) {
      return `
${data.name} 様

Unity開発についてのお問い合わせをいただき、誠にありがとうございます。

220件以上のUnity開発実績を持つ弊社が、
お客様のプロジェクトを全力でサポートいたします。

【弊社のUnity開発実績】
・モバイルゲーム開発
・VR/ARコンテンツ制作
・メタバース構築
・教育・トレーニングアプリ

━━━━━━━━━━━━━━━━━━━━━━━━
■ 受付内容
━━━━━━━━━━━━━━━━━━━━━━━━
受付番号: ${data.id}
受付日時: ${formattedTimestamp}

お問い合わせ内容:
${data.message}
━━━━━━━━━━━━━━━━━━━━━━━━

技術的な詳細について、専門スタッフよりご連絡いたします。

${EMAIL_FOOTER}`;
    },
    
    'Web制作のご相談': function(data, formattedTimestamp) {
      return `
${data.name} 様

Web制作のご相談をいただき、誠にありがとうございます。

最新技術を活用した高品質なWebサイト制作を提供いたします。

【対応可能な制作内容】
・コーポレートサイト
・ECサイト
・ランディングページ
・Webアプリケーション

━━━━━━━━━━━━━━━━━━━━━━━━
■ 受付内容
━━━━━━━━━━━━━━━━━━━━━━━━
受付番号: ${data.id}
受付日時: ${formattedTimestamp}

お問い合わせ内容:
${data.message}
━━━━━━━━━━━━━━━━━━━━━━━━

ご要望に最適なご提案をさせていただきます。

${EMAIL_FOOTER}`;
    },
    
    // デフォルトテンプレート
    'default': function(data, formattedTimestamp) {
      return `
${data.name} 様

この度は、ゲーム開発所RYURYUへお問い合わせいただき、
誠にありがとうございます。

以下の内容でお問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━
受付番号: ${data.id}
受付日時: ${formattedTimestamp}

お問い合わせ内容:
${data.message}
━━━━━━━━━━━━━━━━━━━━━━━━

担当者より2営業日以内にご連絡させていただきます。

${EMAIL_FOOTER}`;
    }
  },
  
  // メール本文取得（カテゴリに応じて適切なテンプレートを選択）
  getBody: function(data, formattedTimestamp) {
    const template = this.BODY_TEMPLATES[data.category] || this.BODY_TEMPLATES['default'];
    return template(data, formattedTimestamp);
  },
  
  // 件名取得
  getSubject: function(category) {
    return this.SUBJECTS[category] || this.SUBJECTS['default'];
  }
};

/**
 * フォールバック用メール（エラー時・緊急時）
 */
const FALLBACK_EMAIL = {
  SUBJECT: '【ゲーム開発所RYURYU】お問い合わせを受け付けました（自動返信）',
  
  getBody: function(data) {
    return `
${data.name} 様

お問い合わせありがとうございます。
内容を確認次第、ご連絡させていただきます。

【お問い合わせ内容】
${data.message || '内容を取得できませんでした'}

━━━━━━━━━━━━━━━━━━━━━━━━
ゲーム開発所RYURYU
Email: ryuyaokamoto0717@gmail.com
━━━━━━━━━━━━━━━━━━━━━━━━`;
  }
};

/**
 * 管理者向け通知メール
 */
const ADMIN_EMAIL = {
  SUBJECT_PREFIX: '【新規お問い合わせ】',
  FROM_NAME: 'お問い合わせシステム',
  
  // 通常の通知
  getBody: function(data, formattedTimestamp, spreadsheetId) {
    return `
新しいお問い合わせがありました。

━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ情報
━━━━━━━━━━━━━━━━━━━━━━━━
受付番号: ${data.id}
受付日時: ${formattedTimestamp}

■ お客様情報
お名前: ${data.name}
メールアドレス: ${data.email}
会社名: ${data.company || '未入力'}
電話番号: ${data.phone || '未入力'}

■ お問い合わせ内容
カテゴリ: ${data.category || '未選択'}
予算: ${data.budget || '未入力'}
希望納期: ${data.deadline || '未入力'}

メッセージ:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━

【自動返信メール】
✅ ${data.email} 宛に自動返信メールを送信済み

スプレッドシートで詳細を確認:
https://docs.google.com/spreadsheets/d/${spreadsheetId}
`;
  },
  
  // 緊急通知（特定条件の場合）
  getUrgentBody: function(data, formattedTimestamp) {
    return `
【緊急】高額案件のお問い合わせです！

━━━━━━━━━━━━━━━━━━━━━━━━
お客様: ${data.name}（${data.company || '会社名なし'}）
予算: ${data.budget}
希望納期: ${data.deadline}
━━━━━━━━━━━━━━━━━━━━━━━━

至急対応をお願いします。

メッセージ:
${data.message}

連絡先:
Email: ${data.email}
Tel: ${data.phone || '未入力'}
`;
  },
  
  getSubject: function(data, isUrgent = false) {
    if (isUrgent) {
      return `【緊急】${data.name}様より高額案件のお問い合わせ`;
    }
    return `${this.SUBJECT_PREFIX}${data.name}様より - ${data.category || ''}`;
  }
};

/**
 * 共通フッター
 */
const EMAIL_FOOTER = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━
ゲーム開発所RYURYU

◆ Unity開発220件以上の実績
◆ VR/AR開発、メタバース制作
◆ 初回20%OFF実施中

【公式サイト】
https://ryuryugame.base.shop

【お問い合わせ】
Email: ryuyaokamoto0717@gmail.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━

※このメールは自動送信されています。
※追加のご質問等は、改めてお問い合わせフォームよりご連絡ください。
`;

/**
 * HomePage.gsでの使用例
 */
function exampleUsage() {
  // カテゴリ別の自動返信
  const subject = CUSTOMER_EMAIL.getSubject(data.category);
  const body = CUSTOMER_EMAIL.getBody(data, formattedTimestamp);
  
  // フォールバック（エラー時）
  try {
    // 通常の処理
  } catch (error) {
    // エラー時はフォールバックメールを送信
    GmailApp.sendEmail(
      data.email,
      FALLBACK_EMAIL.SUBJECT,
      FALLBACK_EMAIL.getBody(data)
    );
  }
  
  // 高額案件の判定（500万円以上）
  const isUrgent = data.budget && data.budget.includes('500万');
  const adminSubject = ADMIN_EMAIL.getSubject(data, isUrgent);
  const adminBody = isUrgent ? 
    ADMIN_EMAIL.getUrgentBody(data, formattedTimestamp) : 
    ADMIN_EMAIL.getBody(data, formattedTimestamp, spreadsheetId);
}