import { createAdminClient } from '@/lib/supabase/server'
import EmailReviewUI, { ReviewEmail } from './EmailReviewUI'

export const dynamic = 'force-dynamic'

export default async function EmailsPage() {
  const db = createAdminClient()

  const { data, error } = await db
    .from('outreach_emails')
    .select(`
      id, company_id, sequence_position, subject, body_text, status,
      personalization_context, generated_at, approved_at, sent_at, replied_at,
      roofing_companies (
        company_name, city, state, phone, email, website_url,
        google_rating, google_review_count, years_in_business, pipeline_stage
      )
    `)
    .order('generated_at', { ascending: false })

  if (error) console.error('[EmailsPage] query error:', error.message)

  const emails: ReviewEmail[] = ((data ?? []) as Record<string, unknown>[]).map((row) => {
    const co = (row.roofing_companies as Record<string, unknown> | null) ?? {}

    return {
      emailId: row.id as string,
      companyId: row.company_id as string,
      companyName: (co.company_name as string) ?? 'Unknown',
      city: (co.city as string | null) ?? null,
      state: (co.state as string | null) ?? null,
      phone: (co.phone as string | null) ?? null,
      recipientEmail: (co.email as string | null) ?? null,
      websiteUrl: (co.website_url as string | null) ?? null,
      googleRating: (co.google_rating as number | null) ?? null,
      googleReviewCount: (co.google_review_count as number | null) ?? null,
      yearsInBusiness: (co.years_in_business as number | null) ?? null,
      pipelineStage: (co.pipeline_stage as string) ?? 'unknown',
      contactName: null,
      contactRole: null,
      subject: row.subject as string,
      bodyText: row.body_text as string,
      emailStatus: row.status as string,
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
