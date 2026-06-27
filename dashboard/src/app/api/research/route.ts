import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = createAdminClient()

  // Fetch companies that have been enriched (beyond discovered stage)
  const { data: companies, error } = await db
    .from('roofing_companies')
    .select(
      'id, company_name, city, state, pipeline_stage, google_rating, google_review_count, notes, last_enriched_at'
    )
    .not('pipeline_stage', 'eq', 'discovered')
    .order('company_name')

  if (error) console.error('[GET /api/research] companies error:', error.message)

  const rows = companies ?? []
  if (rows.length === 0) return NextResponse.json([])

  // Fetch latest email for each company separately (avoids nested join requirement)
  const companyIds = rows.map((c) => c.id)
  const { data: allEmails } = await db
    .from('outreach_emails')
    .select('company_id, subject, personalization_context, generated_at, status')
    .in('company_id', companyIds)
    .order('generated_at', { ascending: false })

  // Group emails by company_id
  const emailsByCompany: Record<string, typeof allEmails> = {}
  for (const e of allEmails ?? []) {
    if (!emailsByCompany[e.company_id]) emailsByCompany[e.company_id] = []
    emailsByCompany[e.company_id]!.push(e)
  }

  const result = rows.map((c) => ({
    ...c,
    outreach_emails: emailsByCompany[c.id] ?? [],
  }))

  return NextResponse.json(result)
}
