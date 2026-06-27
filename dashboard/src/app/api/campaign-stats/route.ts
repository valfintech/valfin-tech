import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = createAdminClient()

  const [companiesRes, emailsRes] = await Promise.all([
    db.from('roofing_companies').select('id').eq('pipeline_stage', 'researched'),
    db
      .from('outreach_emails')
      .select('id, company_id, subject, status')
      .in('status', ['generated', 'approved'])
      .order('generated_at', { ascending: true }),
  ])

  const emails = emailsRes.data ?? []
  if (emailsRes.error) console.error('[campaign-stats] emails error:', emailsRes.error.message)

  // Fetch company details for enriching the email list
  const companyIds = [...new Set(emails.map((e) => e.company_id))]
  let companyMap: Record<string, { company_name: string; email: string | null }> = {}
  if (companyIds.length > 0) {
    const { data: companies } = await db
      .from('roofing_companies')
      .select('id, company_name, email')
      .in('id', companyIds)
    ;(companies ?? []).forEach((c) => {
      companyMap[c.id] = { company_name: c.company_name, email: c.email }
    })
  }

  const enrichedEmails = emails.map((e) => ({
    ...e,
    roofing_companies: companyMap[e.company_id] ?? null,
  }))

  return NextResponse.json({
    researched: (companiesRes.data ?? []).length,
    emails: enrichedEmails,
  })
}
