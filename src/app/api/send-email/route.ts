// app/api/send-email/route.ts
// @ts-ignore - NEXT_RESEND_API_KEY is used in server-side code
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    console.log('=== EMAIL API ROUTE CALLED ===')

    const { email, subject, message } = await req.json()

    console.log('📧 RECEIVED DATA:')
    console.log('Email (recipient):', email)
    console.log('Subject:', subject)
    console.log('Message:', message)
    console.log('Message length:', message?.length || 0, 'characters')
    console.log('========================')

    // Check if API key is configured
    if (!process.env.NEXT_PUBLIC_RESEND_API_KEY) {
        console.error('❌ NEXT_PUBLIC_RESEND_API_KEY is not configured')
        return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 })
    }

    console.log('✅ API Key found:', process.env.NEXT_PUBLIC_RESEND_API_KEY.substring(0, 10) + '...')

    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

    try {
        console.log('SENDING EMAIL VIA RESEND...')
        const result = await resend.emails.send({
            from: `${process.env.NEXT_PUBLIC_RESEND_EMAIL}` || 'onboarding@resend.dev',
            to: 'slawandr1@gmail.com',
            subject,
            html: `<p>${message}</p>`,
        })

        if (result.data && !result.error) {
            console.log('EMAIL SENT SUCCESSFULLY!')
            console.log('Resend result:', result)
            return NextResponse.json({ success: true })
        } else {
            console.error('EMAIL SENDING FAILED!')
            console.error('Resend error:', result.error)
            return NextResponse.json({ success: false, error: result.error }, { status: 500 })
        }
    } catch (err) {
        console.error('EMAIL SENDING FAILED!')
        console.error('Error details:', err)
        return NextResponse.json({ success: false }, { status: 500 })
    }
} 
