/**
 * Renders a JSON-LD structured data block.
 *
 * Server component by design — structured data should be present in the
 * initial HTML, not injected client-side. `data` is JSON.stringify'd
 * directly; callers are responsible for passing schema.org-shaped plain
 * objects (see /src/lib/structured-data.ts for the builders we use).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
