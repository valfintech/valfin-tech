import { createAdminClient } from '@/lib/supabase/server'
import EmailReviewUI, { ReviewEmail } from './EmailReviewUI'

export const dynamic = 'force-dynamic'

export default async function EmailsPage() {
  const db = createAdminClient()

  // Use select('*') so missing optional columns (replied_at, approved_at, etc.)
  // don't break the query — they simply come back as undefined and map to null.
  const { data: emailData, error } = await db
    .from('outreach_emails')
    .select('*')
    .order('generated_at', { ascending: false })

  if (error) console.error('[EmailsPage] emails query error:', error.message)

  const rows = emailData ?? []
  const companyIds = [...new Set(rows.map((r) => r.company_id as string))]

  type CompanyRow = {
    id: string; company_name: string; city: string | null; state: string | null;
    phone: string | null; email: string | null; website_url: string | null;
    google_rating: number | null; google_review_count: number | null;
    years_in_business: number | null; pipeline_stage: string;
  }
  const companyMap: Record<string, CompanyRow> = {}

  if (companyIds.length > 0) {
    const { data: companies } = await db
      .from('roofing_companies')
      .select('id, company_name, city, state, phone, email, website_url, google_rating, google_review_count, years_in_business, pipeline_stage')
      .in('id', companyIds)
    ;(companies ?? []).forEach((c) => { companyMap[c.id] = c as CompanyRow })
  }

  type ContactRow = { company_id: string; contact_name: string | null; role: string | null }
  const contactMap: Record<string, ContactRow> = {}
  if (companyIds.length > 0) {
    const { data: contacts } = await db
      .from('company_contacts')
      .select('company_id, contact_name, role')
      .in('company_id', companyIds)
    ;(contacts ?? []).forEach((c) => {
      if (!contactMap[c.company_id]) contactMap[c.company_id] = c as ContactRow
    })
  }

  const emails: ReviewEmail[] = (rows as Record<string, unknown>[]).map((row) => {
    const co = companyMap[row.company_id as string] ?? {} as Partial<CompanyRow>
    const ct = contactMap[row.company_id as string]
    return {
      emailId: row.id as string,
      companyId: row.company_id as string,
      companyName: co.company_name ?? 'Unknown',
      city: co.city ?? null,
      state: co.state ?? null,
      phone: co.phone ?? null,
      recipientEmail: co.email ?? null,
      websiteUrl: co.website_url ?? null,
      googleRating: co.google_rating ?? null,
      googleReviewCount: co.google_review_count ?? null,
      yearsInBusiness: co.years_in_business ?? null,
      pipelineStage: co.pipeline_stage ?? 'unknown',
      contactName: ct?.contact_name ?? null,
      contactRole: ct?.role ?? null,
      subject: row.subject as string,
      bodyText: row.body_text as string,
      emailStatus: row.status as string,
      errorReason: (row.error_reason as string | null) ?? null,
      personalizationContext: (row.personalization_context as ReviewEmail['personalizationContext']) ?? {},
      sequencePosition: (row.sequence_position as number) ?? 1,
      generatedAt: row.generated_at as string,
      approvedAt: (row.approved_at as string | null) ?? null,
      sentAt: (row.sent_at as string | null) ?? null,
      repliedAt: (row.replied_at as string | null) ?? null,
    }
  })

  return <EmailReviewUI initialEmails={emails} />
}
