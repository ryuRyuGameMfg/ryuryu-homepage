const CONFIG_HP = {
  // Google Apps Script スクリプトID
  GAS_SCRIPT_ID: '1Tjy9C4OjUvq0RK8ekXQDQ3H9Iyc9ZeaHF6Jd0t8T3ramYm6ozkVFdB-e',  // GAS スクリプトID
  
  // Google Apps Script デプロイID
  GAS_DEPLOYMENT_ID: 'AKfycbzQvH8Un3yz8u16ruWPei0VEFPgjTXPu2RWHLWGBIHGwFPzb6dUSAj9sipAK9nP36lzpQ',  // GAS WebアプリケーションのデプロイID
  
  // Google Spreadsheet設定
  SPREADSHEET_ID: '1DYys8cT65k_l6XmU11BOxOGff-bW3B4CsMoUo4uxCG0',  // 保存先スプレッドシートID
  SHEET_NAME: 'お問い合わせ',                      // シート名（自動作成される）
  
  // 管理者設定
  ADMIN_EMAIL: 'ryuyaokamoto0717@gmail.com',                       // 管理者メールアドレス（通知先）
  
  // 自動返信メール設定
  AUTO_REPLY: {
    ENABLED: true,                                                // 自動返信の有効/無効
    FROM_NAME: 'ゲーム開発所RYURYU',                              // 送信者名
    REPLY_TO: 'ryuyaokamoto0717@gmail.com',                      // 返信先メールアドレス
  }
};

/**
 * スプレッドシートのヘッダー定義
 * @const {Array<string>} SHEET_HEADERS - シートのヘッダー行
 */
const SHEET_HEADERS = [
  'ID',
  'タイムスタンプ',
  'お名前',
  'メールアドレス',
  '会社名',
  '電話番号',
  'カテゴリ',
  'お問い合わせ内容',
  '予算',
  '希望納期',
  'ステータス',
  '備考'
];

/**
 * 列幅の設定（ピクセル単位）
 * @const {Object} COLUMN_WIDTHS - 各列の幅設定
 */
const COLUMN_WIDTHS = {
  1: 150,   // ID
  2: 150,   // タイムスタンプ
  3: 120,   // お名前
  4: 200,   // メールアドレス
  5: 150,   // 会社名
  6: 120,   // 電話番号
  7: 180,   // カテゴリ
  8: 400,   // お問い合わせ内容
  9: 120,   // 予算
  10: 120,  // 希望納期
  11: 100,  // ステータス
  12: 200   // 備考
};

/**
 * スタイル設定
 * @const {Object} STYLES - ヘッダーのスタイル設定
 */
const STYLES = {
  HEADER_BG_COLOR: '#1a73e8',     // ヘッダー背景色
  HEADER_FONT_COLOR: '#ffffff',   // ヘッダー文字色
  HEADER_FONT_WEIGHT: 'bold',     // ヘッダーフォント太さ
  HEADER_ALIGNMENT: 'center'      // ヘッダー配置
};

/**
 * レスポンスメッセージ
 * @const {Object} MESSAGES - 各種メッセージテンプレート
 */
const MESSAGES = {
  SUCCESS: 'お問い合わせを受け付けました。',
  ERROR: 'エラーが発生しました',
  API_RUNNING: 'GAS Contact Form API is running',
  VERSION: '2.1.0'
};

/**
 * メールテンプレート定数
 * @const {Object} EMAIL_TEMPLATES - メールの件名とフッター
 */
const EMAIL_TEMPLATES = {
  // お客様向け自動返信メール
  THANKS: {
    SUBJECT: '【ゲーム開発所RYURYU】お問い合わせありがとうございます',
    FOOTER: `━━━━━━━━━━━━━━━━━━━━━━━━
ゲーム開発所RYURYU

◆ Unity開発220件以上の実績
◆ VR/AR開発、メタバース制作
◆ 初回20%OFF実施中

【公式サイト】
https://ryuryugame.base.shop

【お問い合わせ】
Email: ${CONFIG_HP.AUTO_REPLY.REPLY_TO}

━━━━━━━━━━━━━━━━━━━━━━━━

※このメールは自動送信されています。
※追加のご質問等は、改めてお問い合わせフォームよりご連絡ください。`
  },
  
  // 管理者向け通知メール
  ADMIN: {
    SUBJECT_PREFIX: '【新規お問い合わせ】',
    FROM_NAME: 'お問い合わせシステム - ゲーム開発所RYURYU'
  }
};

// ========================================
// メイン処理（Main Functions）
// ========================================

/**
 * POSTリクエストの処理（お問い合わせ受付）
 * @param {Object} e - リクエストイベントオブジェクト
 * @returns {TextOutput} JSONレスポンス
 */
function doPost(e) {
  try {
    console.log('POST request received:', e.postData.contents);
    
    // リクエストデータの解析
    const data = JSON.parse(e.postData.contents);
    
    // タイムスタンプとIDの生成
    const timestamp = new Date();
    const id = generateId(timestamp);
    
    // スプレッドシートに保存
    const result = saveToSpreadsheet({
      id: id,
      timestamp: timestamp,
      ...data
    });
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    // 成功レスポンスを返す
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: MESSAGES.SUCCESS,
        id: id,
        timestamp: timestamp.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    
    // エラーレスポンスを返す
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: MESSAGES.ERROR,
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GETリクエストの処理（動作確認用）
 * @returns {TextOutput} JSONレスポンス
 */
function doGet() {
  // 自動セットアップを実行
  ensureSheetExists();
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: MESSAGES.API_RUNNING,
      version: MESSAGES.VERSION,
      spreadsheetId: CONFIG_HP.SPREADSHEET_ID,
      sheetName: CONFIG_HP.SHEET_NAME,
      setupComplete: true
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========================================
// ヘルパー関数（Helper Functions）
// ========================================

/**
 * ユニークIDの生成
 * @param {Date} timestamp - タイムスタンプ
 * @returns {string} 生成されたID（例: INQ-20240101120000-001）
 */
function generateId(timestamp) {
  const dateStr = Utilities.formatDate(timestamp, 'JST', 'yyyyMMddHHmmss');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INQ-${dateStr}-${random}`;
}

/**
 * シートの存在確認と自動作成
 * @returns {Sheet} スプレッドシートのシートオブジェクト
 * @throws {Error} シート作成エラー
 */
function ensureSheetExists() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG_HP.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG_HP.SHEET_NAME);
    
    if (!sheet) {
      console.log('シートが存在しないため作成します:', CONFIG_HP.SHEET_NAME);
      
      // 新しいシートを作成
      sheet = spreadsheet.insertSheet(CONFIG_HP.SHEET_NAME);
      
      // ヘッダーを設定
      const headerRange = sheet.getRange(1, 1, 1, SHEET_HEADERS.length);
      headerRange.setValues([SHEET_HEADERS]);
      
      // ヘッダーのスタイル設定
      headerRange
        .setBackground(STYLES.HEADER_BG_COLOR)
        .setFontColor(STYLES.HEADER_FONT_COLOR)
        .setFontWeight(STYLES.HEADER_FONT_WEIGHT)
        .setHorizontalAlignment(STYLES.HEADER_ALIGNMENT);
      
      // 列幅の自動調整
      sheet.autoResizeColumns(1, SHEET_HEADERS.length);
      
      // 個別の列幅設定
      Object.entries(COLUMN_WIDTHS).forEach(([col, width]) => {
        sheet.setColumnWidth(parseInt(col), width);
      });
      
      // フィルタを設定
      const dataRange = sheet.getRange(1, 1, sheet.getMaxRows(), SHEET_HEADERS.length);
      dataRange.createFilter();
      
      console.log('シートの作成と初期設定が完了しました');
    }
    
    return sheet;
    
  } catch (error) {
    console.error('シートの確認/作成エラー:', error);
    throw error;
  }
}

/**
 * スプレッドシートへの保存
 * @param {Object} data - 保存するデータ
 * @returns {Object} 処理結果 {success: boolean, error?: string}
 */
function saveToSpreadsheet(data) {
  try {
    // シートの存在確認と取得
    const sheet = ensureSheetExists();
    
    // タイムスタンプの処理（文字列の場合はDateオブジェクトに変換）
    let timestampObj = data.timestamp;
    if (typeof timestampObj === 'string') {
      timestampObj = new Date(timestampObj);
    }
    if (!(timestampObj instanceof Date) || isNaN(timestampObj)) {
      timestampObj = new Date(); // 無効な場合は現在時刻を使用
    }
    
    // 日時のフォーマット
    const formattedTimestamp = Utilities.formatDate(
      timestampObj, 
      'JST', 
      'yyyy/MM/dd HH:mm:ss'
    );
    
    // 保存するデータの準備（ヘッダーの順序に合わせる）
    const rowData = [
      data.id || '',
      formattedTimestamp,
      data.name || '',
      data.email || '',
      data.company || '',
      data.phone || '',
      data.category || '',
      data.message || '',
      data.budget || '',
      data.deadline || '',
      '未対応',  // ステータス（初期値）
      ''         // 備考（空欄）
    ];
    
    // デバッグログ
    console.log('保存するデータ:', rowData);
    console.log('シート名:', sheet.getName());
    
    // データを最終行に追加
    sheet.appendRow(rowData);
    
    console.log('データを保存しました:', data.id);
    console.log('スプレッドシートID:', CONFIG_HP.SPREADSHEET_ID);
    
    // お客様への自動返信メール（設定が有効な場合）
    if (CONFIG_HP.AUTO_REPLY.ENABLED && data.email) {
      try {
        sendThanksEmail(data, formattedTimestamp);
      } catch (emailError) {
        console.error('自動返信メール送信エラー（処理は継続）:', emailError);
      }
    }
    
    // 管理者への通知（メールアドレスが設定されている場合）
    if (CONFIG_HP.ADMIN_EMAIL) {
      try {
        sendAdminNotification(data, formattedTimestamp);
      } catch (emailError) {
        console.error('管理者通知メール送信エラー（処理は継続）:', emailError);
      }
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('スプレッドシート保存エラー:', error);
    return { 
      success: false, 
      error: error.toString() 
    };
  }
}

// ========================================
// メール送信関数（Email Functions）
// ========================================

/**
 * お客様への自動返信メール（サンクスメール）送信
 * @param {Object} data - お問い合わせデータ
 * @param {string} formattedTimestamp - フォーマット済みタイムスタンプ
 */
function sendThanksEmail(data, formattedTimestamp) {
  const subject = EMAIL_TEMPLATES.THANKS.SUBJECT;
  
  const body = `
${data.name} 様

この度は、ゲーム開発所RYURYUへお問い合わせいただき、
誠にありがとうございます。

以下の内容でお問い合わせを受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━
■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━
受付番号: ${data.id}
受付日時: ${formattedTimestamp}

カテゴリ: ${data.category || '未選択'}
予算: ${data.budget || '未入力'}
希望納期: ${data.deadline || '未入力'}

お問い合わせ内容:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━

担当者より2営業日以内にご連絡させていただきます。
お急ぎの場合は、下記までご連絡ください。

【お問い合わせについて】
・通常、1-2営業日以内にご返信いたします
・土日祝日は回答にお時間をいただく場合があります
・迷惑メールフォルダもご確認ください

${EMAIL_TEMPLATES.THANKS.FOOTER}
`;
  
  // メール送信
  GmailApp.sendEmail(
    data.email,
    subject,
    body,
    {
      name: CONFIG_HP.AUTO_REPLY.FROM_NAME,
      replyTo: CONFIG_HP.AUTO_REPLY.REPLY_TO
    }
  );
  
  console.log('お客様へ自動返信メールを送信しました:', data.email);
}

/**
 * 管理者への通知メール送信
 * @param {Object} data - お問い合わせデータ
 * @param {string} formattedTimestamp - フォーマット済みタイムスタンプ
 */
function sendAdminNotification(data, formattedTimestamp) {
  if (!CONFIG_HP.ADMIN_EMAIL) return;
  
  const subject = `${EMAIL_TEMPLATES.ADMIN.SUBJECT_PREFIX}${data.name}様より - ${data.category || ''}`;
  
  const body = `
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
https://docs.google.com/spreadsheets/d/${CONFIG_HP.SPREADSHEET_ID}
`;
  
  GmailApp.sendEmail(
    CONFIG_HP.ADMIN_EMAIL,
    subject,
    body,
    {
      name: EMAIL_TEMPLATES.ADMIN.FROM_NAME,
      replyTo: data.email // 返信先をお客様のメールアドレスに設定
    }
  );
  
  console.log('管理者へ通知メールを送信しました');
}

// ========================================
// テスト用関数（Test Functions）
// ========================================

/**
 * 手動テスト実行用
 * GASエディタから直接実行してテスト可能
 * @returns {Object} テスト結果
 */
function testContactForm() {
  // テストデータの定義
  const testData = {
    name: 'テスト太郎',
    email: 'test@example.com',
    company: 'テスト株式会社',
    phone: '090-1234-5678',
    category: 'ゲーム開発のご相談',
    message: 'これはGASエディタからのテスト送信です。\n自動セットアップ機能の確認を行っています。',
    budget: '30-50万円',
    deadline: '2025年3月末'
  };
  
  // POSTリクエストをシミュレート
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  // 実行
  const result = doPost(e);
  const response = JSON.parse(result.getContent());
  
  console.log('テスト結果:', response);
  
  if (response.success) {
    console.log('✅ テスト成功！');
    console.log('受付番号:', response.id);
    console.log('以下を確認してください:');
    console.log('1. 自動返信メール（お客様宛）:', testData.email);
    console.log('2. 管理者通知メール:', CONFIG_HP.ADMIN_EMAIL);
    console.log('3. スプレッドシート:');
    console.log(`https://docs.google.com/spreadsheets/d/${CONFIG_HP.SPREADSHEET_ID}`);
  } else {
    console.log('❌ テスト失敗:', response.error);
  }
  
  return response;
}

/**
 * シートの初期化（リセット用）
 * 既存のシートを削除して新規作成する
 * @returns {Object} 処理結果
 */
function resetSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG_HP.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(CONFIG_HP.SHEET_NAME);
    
    if (sheet) {
      spreadsheet.deleteSheet(sheet);
      console.log('既存のシートを削除しました');
    }
    
    ensureSheetExists();
    console.log('新しいシートを作成しました');
    
    return { success: true, message: 'シートをリセットしました' };
  } catch (error) {
    console.error('リセットエラー:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * 設定情報の確認用（HomePage専用）
 * 現在の設定を表示する
 * @returns {Object} 現在の設定
 */
function checkConfig() {
  return {
    spreadsheetId: CONFIG_HP.SPREADSHEET_ID,
    sheetName: CONFIG_HP.SHEET_NAME,
    adminEmail: CONFIG_HP.ADMIN_EMAIL,
    autoReplyEnabled: CONFIG_HP.AUTO_REPLY.ENABLED,
    fromName: CONFIG_HP.AUTO_REPLY.FROM_NAME,
    replyTo: CONFIG_HP.AUTO_REPLY.REPLY_TO,
    version: MESSAGES.VERSION
  };
}