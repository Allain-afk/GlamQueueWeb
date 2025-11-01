import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'onboarding@resend.dev'

interface RequestBody {
  email: string
  code: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { email, code }: RequestBody = await req.json()

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    // Check if Resend API key is configured
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set')
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          details: 'RESEND_API_KEY secret is missing. Please set it in Supabase Dashboard > Edge Functions > send-otp-email > Settings > Secrets',
          fix: 'Go to Supabase Dashboard > Edge Functions > send-otp-email > Settings > Secrets and add RESEND_API_KEY'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    // Validate code format (should be 6 digits)
    if (!/^\d{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ error: 'Invalid code format. Code must be 6 digits' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    const resend = new Resend(RESEND_API_KEY)

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your GlamQueue Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #e91e8c 0%, #f06292 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">GlamQueue</h1>
          </div>
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Email Verification</h2>
            <p style="color: #666; font-size: 16px;">Thank you for signing up! Please use the following code to verify your email address:</p>
            <div style="background: #f9fafb; border: 2px dashed #e91e8c; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #e91e8c; font-family: 'Courier New', monospace;">
                ${code}
              </div>
            </div>
            <p style="color: #666; font-size: 14px; margin-bottom: 0;">
              This code will expire in <strong>5 minutes</strong>.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} GlamQueue. All rights reserved.</p>
          </div>
        </body>
      </html>
    `

    const emailText = `
GlamQueue Email Verification

Thank you for signing up! Please use the following code to verify your email address:

${code}

This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} GlamQueue. All rights reserved.
    `

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your GlamQueue Verification Code',
      html: emailHtml,
      text: emailText,
    })

    if (error) {
      console.error('Resend API error:', JSON.stringify(error, null, 2))
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to send email'
      let errorDetails = error
      
      if (error.message) {
        if (error.message.includes('Invalid API key')) {
          errorMessage = 'Invalid Resend API key. Please check RESEND_API_KEY secret in Supabase Dashboard'
        } else if (error.message.includes('domain')) {
          errorMessage = 'Domain verification issue. Please verify your sending domain in Resend Dashboard'
        } else if (error.message.includes('FROM_EMAIL')) {
          errorMessage = `Invalid FROM_EMAIL: ${FROM_EMAIL}. Please set a valid FROM_EMAIL secret or verify domain in Resend`
        }
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: errorDetails,
          fromEmail: FROM_EMAIL,
          fix: 'Check: 1) RESEND_API_KEY is correct, 2) FROM_EMAIL domain is verified in Resend, 3) Resend account is active'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error) {
    console.error('Error in send-otp-email function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: errorMessage,
        stack: errorStack,
        fix: 'Check Edge Function logs in Supabase Dashboard for more details'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})

