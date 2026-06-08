/**
 * Lead Leak Calculator — scoring logic.
 *
 * This is the site's primary conversion mechanism (see /CLAUDE.md §9 UX
 * Principles): a low-friction, self-diagnostic tool that lets a visitor
 * prove the problem to themselves before being asked to commit to a call.
 *
 * The assumptions below are deliberately conservative and stated plainly
 * in the UI — per the brand's "radical specificity over implied breadth"
 * trust principle, we'd rather show our math than hide behind a black-box
 * number. Replace these constants with verified figures from the roofing
 * flagship deployment as that data matures.
 */

export type CalculatorInput = {
  /** Average number of new leads/inquiries the business gets per month */
  monthlyLeads: number;
  /** Average revenue value of one converted customer/job */
  avgCustomerValue: number;
};

export type CalculatorResult = {
  /** Estimated number of leads lost per month to slow/no follow-up */
  lostLeadsPerMonth: number;
  /** Estimated recoverable revenue per month if those leads were captured */
  recoverableMonthlyRevenue: number;
  /** Same figure, annualized — the number that tends to land hardest */
  recoverableAnnualRevenue: number;
};

/**
 * Share of inbound leads that industry research and our own flagship data
 * suggest go un-followed-up (or followed up too slowly to convert) at a
 * typical lead-based business. Conservative, round, and explainable.
 */
export const ASSUMED_LOST_LEAD_RATE = 0.3;

/**
 * Of those lost leads, the conservative share we estimate would have
 * converted into a paying customer with fast, consistent follow-up.
 * Kept deliberately modest — under-promising is the point.
 */
export const ASSUMED_RECOVERABLE_CONVERSION_RATE = 0.35;

export function estimateLeakage({ monthlyLeads, avgCustomerValue }: CalculatorInput): CalculatorResult {
  const safeLeads = Math.max(0, monthlyLeads);
  const safeValue = Math.max(0, avgCustomerValue);

  const lostLeadsPerMonth = safeLeads * ASSUMED_LOST_LEAD_RATE;
  const recoverableMonthlyRevenue =
    lostLeadsPerMonth * ASSUMED_RECOVERABLE_CONVERSION_RATE * safeValue;

  return {
    lostLeadsPerMonth: Math.round(lostLeadsPerMonth * 10) / 10,
    recoverableMonthlyRevenue: Math.round(recoverableMonthlyRevenue),
    recoverableAnnualRevenue: Math.round(recoverableMonthlyRevenue * 12),
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
