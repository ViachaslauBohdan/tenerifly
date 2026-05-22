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

    // Primary inbox — booking notifications always go here
    const defaultRecipient = process.env.NEXT_DEFAULT_EMAIL_RECIPIENT || 'slawandr1@gmail.com'
    const recipients = [defaultRecipient]

    // Extra recipients (e.g. property owner) require a verified domain on Resend.
    // Without RESEND_ENABLE_EXTRA_RECIPIENTS=true, Resend returns 403 validation_error
    // when using onboarding@resend.dev or an unverified from domain.
    const extraRecipientsEnabled = process.env.RESEND_ENABLE_EXTRA_RECIPIENTS === 'true'

    console.log('📧 RECIPIENTS SETUP:')
    console.log('   Default recipient (from env):', defaultRecipient)
    console.log('   User email (from form):', email)
    console.log('   Contact email (from property):', contactEmail)
    console.log('   Extra recipients enabled:', extraRecipientsEnabled)

    if (
        extraRecipientsEnabled &&
        contactEmail &&
        contactEmail !== defaultRecipient &&
        contactEmail.includes('@') &&
        !recipients.includes(contactEmail)
    ) {
        recipients.push(contactEmail)
        console.log('✅ Added contact email to recipients:', contactEmail)
    } else if (contactEmail) {
        console.log('ℹ️ Contact email included in body only (not in to:)')
    }

    console.log('📧 FINAL RECIPIENTS LIST:')
    recipients.forEach((recipient, index) => {
        console.log(`   ${index + 1}. ${recipient}`)
    })
    console.log('📧 TOTAL RECIPIENTS:', recipients.length)

    const resendApiKey =
        process.env.RESEND_API_KEY ||
        process.env.NEXT_RESEND_API_KEY ||
        process.env.NEXT_PUBLIC_RESEND_API_KEY

    if (!resendApiKey) {
        console.error('❌ Resend API key missing. Set RESEND_API_KEY in .env.local')
        return NextResponse.json(
            {
                success: false,
                error:
                    'Email service not configured. Add RESEND_API_KEY to .env.local and restart the dev server.',
            },
            { status: 500 }
        )
    }

    console.log('✅ API Key found:', resendApiKey.substring(0, 10) + '...')

    const resend = new Resend(resendApiKey)
    const fromEmail =
        process.env.RESEND_FROM_EMAIL ||
        process.env.NEXT_PUBLIC_RESEND_EMAIL ||
        'onboarding@resend.dev'

    const contactBlock =
        contactEmail && !recipients.includes(contactEmail)
            ? `<p><strong>Property contact:</strong> ${contactEmail}</p>`
            : ''

    const htmlBody = `
        ${contactBlock}
        <pre style="font-family: inherit; white-space: pre-wrap;">${message}</pre>
    `.trim()

    try {
        console.log('SENDING EMAIL VIA RESEND...')
        const result = await resend.emails.send({
            from: fromEmail,
            to: recipients,
            replyTo: email?.includes('@') ? email : undefined,
            subject,
            html: htmlBody,
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
