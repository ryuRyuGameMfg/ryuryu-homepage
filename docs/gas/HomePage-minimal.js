const CONFIG_HP = {
  // Google Apps Script デプロイID
  GAS_DEPLOYMENT_ID: 'AKfycbzQvH8Un3yz8u16ruWPei0VEFPgjTXPu2RWHLWGBIHGwFPzb6dUSAj9sipAK9nP36lzpQ',
  
  // Google Spreadsheet設定
  SPREADSHEET_ID: '1DYys8cT65k_l6XmU11BOxOGff-bW3B4CsMoUo4uxCG0',
  SHEET_NAME: 'お問い合わせ',
  
  // 管理者設定
  ADMIN_EMAIL: 'ryuyaokamoto0717@gmail.com',
  
  // 自動返信メール設定
  AUTO_REPLY: {
    ENABLED: true
  }
};

/**
 * スプレッドシートのヘッダー定義
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
 * 列幅の設定
 */
const COLUMN_WIDTHS = {
  1: 150, 2: 150, 3: 120, 4: 200, 5: 150, 6: 120,
  7: 180, 8: 400, 9: 120, 10: 120, 11: 100, 12: 200
};

/**
 * POSTリクエストの処理
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const timestamp = new Date();
    const id = generateId(timestamp);
    
    const result = saveToSpreadsheet({
      id: id,
      timestamp: timestamp,
      ...data
    });
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'お問い合わせを受け付けました。',
        id: id,
        timestamp: timestamp.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'エラーが発生しました',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GETリクエストの処理
 */
function doGet() {
  ensureSheetExists();
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      message: 'GAS Contact Form API is running',
      version: '3.0.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ユニークIDの生成
 */
function generateId(timestamp) {
  const dateStr = Utilities.formatDate(timestamp, 'JST', 'yyyyMMddHHmmss');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INQ-${dateStr}-${random}`;
}

/**
 * シートの存在確認と自動作成
 */
function ensureSheetExists() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG_HP.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG_HP.SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG_HP.SHEET_NAME);
      
      // ヘッダー設定
      const headerRange = sheet.getRange(1, 1, 1, SHEET_HEADERS.length);
      headerRange.setValues([SHEET_HEADERS]);
      headerRange
        .setBackground('#1a73e8')
        .setFontColor('#ffffff')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      
      // 列幅設定
      Object.entries(COLUMN_WIDTHS).forEach(([col, width]) => {
        sheet.setColumnWidth(parseInt(col), width);
      });
      
      // フィルタ設定
      sheet.getRange(1, 1, sheet.getMaxRows(), SHEET_HEADERS.length).createFilter();
    }
    
    return sheet;
    
  } catch (error) {
    throw error;
  }
}

/**
 * スプレッドシートへの保存
 */
function saveToSpreadsheet(data) {
  try {
    const sheet = ensureSheetExists();
    
    let timestampObj = data.timestamp;
    if (typeof timestampObj === 'string') {
      timestampObj = new Date(timestampObj);
    }
    if (!(timestampObj instanceof Date) || isNaN(timestampObj)) {
      timestampObj = new Date();
    }
    
    const formattedTimestamp = Utilities.formatDate(
      timestampObj, 
      'JST', 
      'yyyy/MM/dd HH:mm:ss'
    );
    
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
      '未対応',
      ''
    ];
    
    sheet.appendRow(rowData);
    
    // 自動返信メール
    if (CONFIG_HP.AUTO_REPLY.ENABLED && data.email) {
      try {
        sendThanksEmail(data, formattedTimestamp);
      } catch (emailError) {
        // エラーログなし、処理継続
      }
    }
    
    // 管理者通知
    if (CONFIG_HP.ADMIN_EMAIL) {
      try {
        sendAdminNotification(data, formattedTimestamp);
      } catch (emailError) {
        // エラーログなし、処理継続
      }
    }
    
    return { success: true };
    
  } catch (error) {
    return { 
      success: false, 
      error: error.toString() 
    };
  }
}

/**
 * お客様への自動返信メール
 */
function sendThanksEmail(data, formattedTimestamp) {
  const subject = CUSTOMER_EMAIL.SUBJECT;
  const body = CUSTOMER_EMAIL.getBody(data, formattedTimestamp);
  
  GmailApp.sendEmail(
    data.email,
    subject,
    body,
    {
      name: EMAIL_CONFIG.FROM_NAME,
      replyTo: EMAIL_CONFIG.REPLY_TO
    }
  );
}

/**
 * 管理者への通知メール
 */
function sendAdminNotification(data, formattedTimestamp) {
  if (!CONFIG_HP.ADMIN_EMAIL) return;
  
  const subject = ADMIN_EMAIL.getSubject(data);
  const body = ADMIN_EMAIL.getBody(data, formattedTimestamp, CONFIG_HP.SPREADSHEET_ID);
  
  GmailApp.sendEmail(
    CONFIG_HP.ADMIN_EMAIL,
    subject,
    body,
    {
      name: ADMIN_EMAIL.FROM_NAME,
      replyTo: data.email
    }
  );
}