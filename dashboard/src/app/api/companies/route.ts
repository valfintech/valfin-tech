import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = createAdminClient()
  const { data, error } = await db
    .from('roofing_companies')
    .select(
      'id, company_name, city, state, phone, email, website_url, google_rating, google_review_count, years_in_business, pipeline_stage, notes, last_enriched_at'
    )
    .order('company_name')
  if (error) console.error('[GET /api/companies]', error.message)
  return NextResponse.json(data ?? [])
}
