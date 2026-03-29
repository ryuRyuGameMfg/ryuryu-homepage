import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, email, company, phone, subject, message } = body

    // GASのWebアプリURLを環境変数から取得
    const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL || ''
    
    if (!GAS_URL) {
      console.error('GAS URL is not configured')
      return NextResponse.json(
        { error: 'サーバー設定エラー' },
        { status: 500 }
      )
    }

    // GASに送信するデータ（GAS側の期待するフィールド名に合わせる）
    const gasData = {
      name,
      email,
      company: company || '',
      phone: phone || '',
      category: subject,  // subjectをcategoryとして送信
      message,
      budget: '',  // 予算（オプション）
      deadline: '', // 希望納期（オプション）
    }

    // GASにPOSTリクエストを送信
    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',  // CORSエラーを回避
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gasData),
    })

    // no-corsモードではレスポンスを読めないため、常に成功として扱う
    return NextResponse.json(
      { message: '送信成功', data: { success: true } },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { error: '送信に失敗しました' },
      { status: 500 }
    )
  }
}