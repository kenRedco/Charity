import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_META, SOCIAL_LINKS } from '../config';

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: SITE_META.name,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: SITE_META.description,
  sameAs: Object.values(SOCIAL_LINKS).filter(Boolean),
};

const WEBSITE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_META.name,
  url: SITE_URL,
};

/**
 * Drop this component inside any page to set per-page head tags.
 * Falls back to global site defaults when props are omitted.
 */
export default function PageMeta({
  title,
  description,
  path = '/',
  ogType = 'website',
  includeJsonLd = false,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_META.name}`
    : `${SITE_META.name} — ${SITE_META.tagline}`;
  const desc = description || SITE_META.description;
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type"        content={ogType} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image"       content={SITE_META.shareImage} />
      <meta property="og:site_name"   content={SITE_META.name} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image"       content={SITE_META.shareImage} />

      {/* JSON-LD structured data (included on root page) */}
      {includeJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify([ORG_JSONLD, WEBSITE_JSONLD])}
        </script>
      )}
    </Helmet>
  );
}
