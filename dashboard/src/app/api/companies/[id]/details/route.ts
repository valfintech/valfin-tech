import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = createAdminClient()
  const [emails, logs] = await Promise.all([
    db
      .from('outreach_emails')
      .select(
        'id, subject, body_text, status, sequence_position, generated_at, sent_at, personalization_context'
      )
      .eq('company_id', id)
      .order('generated_at', { ascending: false }),
    db
      .from('outreach_logs')
      .select('id, action, details, created_at')
      .eq('company_id', id)
      .order('created_at', { ascending: false })
      .limit(50),
  ])
  return NextResponse.json({
    emails: emails.data ?? [],
    logs: logs.data ?? [],
  })
}
