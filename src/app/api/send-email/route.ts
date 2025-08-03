// app/api/send-email/route.ts
// @ts-ignore - NEXT_RESEND_API_KEY is used in server-side code
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    console.log('=== EMAIL API ROUTE CALLED ===')

    const { email, subject, message, contactEmail } = await req.json()

    console.log('📧 RECEIVED DATA:')
    console.log('Email (recipient):', email)
    console.log('Contact Email:', contactEmail)
    console.log('Subject:', subject)
    console.log('Message:', message)
    console.log('Message length:', message?.length || 0, 'characters')
    console.log('========================')

    // Define recipients - always include main email and contact email if available
    const defaultRecipient = process.env.NEXT_DEFAULT_EMAIL_RECIPIENT || 'slawandr1@gmail.com'
    const recipients = [defaultRecipient]

    console.log('📧 RECIPIENTS SETUP:')
    console.log('   Default recipient (from env):', defaultRecipient)
    console.log('   User email (from form):', email)
    console.log('   Contact email (from property):', contactEmail)

    // Add contact email if provided and valid
    if (contactEmail && contactEmail !== email && contactEmail.includes('@')) {
        recipients.push(contactEmail)
        console.log('✅ Added contact email to recipients:', contactEmail)
    } else {
        console.log('❌ No valid contact email provided or same as user email')
    }

    console.log('📧 FINAL RECIPIENTS LIST:')
    recipients.forEach((recipient, index) => {
        console.log(`   ${index + 1}. ${recipient}`)
    })
    console.log('📧 TOTAL RECIPIENTS:', recipients.length)

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
            to: recipients,
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
