import { Resend } from 'resend'
import { NextResponse } from 'next/server'

async function sendTelegramMessage(text: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!token || !chatId) {
        console.log('Telegram env variables not configured')
        return
    }

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text,
                    parse_mode: 'HTML',
                }),
            }
        )

        const data = await response.json()

        if (!data.ok) {
            console.error('Telegram send error:', data)
        } else {
            console.log('Telegram message sent')
        }
    } catch (err) {
        console.error('Telegram request failed:', err)
    }
}

export async function POST(req: Request) {
    const { email, subject, message, contactEmail } = await req.json()
    const emailOfContact = contactEmail ?? "Not set"
    const defaultRecipient = (
        process.env.NEXT_DEFAULT_EMAIL_RECIPIENT ?? 'test@gmail.com'
    )
        .split(',')
        .map(email => email.trim())

    const resendApiKey =
        process.env.RESEND_API_KEY ||
        process.env.NEXT_RESEND_API_KEY ||
        process.env.NEXT_PUBLIC_RESEND_API_KEY

    if (!resendApiKey) {
        return NextResponse.json(
            {
                success: false,
                error: 'RESEND_API_KEY missing',
            },
            { status: 500 }
        )
    }

    const resend = new Resend(resendApiKey)

    const fromEmail =
        process.env.RESEND_FROM_EMAIL ||
        process.env.NEXT_PUBLIC_RESEND_EMAIL ||
        'onboarding@resend.dev'

    const htmlBody = `
        <p><strong>Client Email:</strong> ${email}</p>
        <p><strong>Contact Email:</strong> ${emailOfContact}</p>
        <pre style="font-family: inherit; white-space: pre-wrap;">${message}</pre>
    `

    try {
        const result = await resend.emails.send({
            from: fromEmail,
            to: defaultRecipient,
            replyTo: email?.includes('@') ? email : undefined,
            subject,
            html: htmlBody,
        })

        // TELEGRAM SEND
        await sendTelegramMessage(`
<b>Pre Book Request</b>

<b>Subject:</b> ${subject}

<b>Client Email:</b>
${email}

<b>Property Contact:</b>
${emailOfContact}

<b>Message:</b>
${message}
        `)

        if (result.data && !result.error) {
            return NextResponse.json({ success: true })
        }

        return NextResponse.json(
            {
                success: false,
                error: result.error,
            },
            { status: 500 }
        )
    } catch (err) {
        console.error(err)

        return NextResponse.json(
            {
                success: false,
            },
            { status: 500 }
        )
    }
}