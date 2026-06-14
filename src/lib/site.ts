export const SITE_NAME = "L'Archive Sonore";

export const SITE_DESCRIPTION =
  'A sanctuary for sonic artists and premium instrument archives — curated guitars, pianos, drums, synthesizers, violins, and more.';

// Base URL situs untuk metadata, sitemap, dan canonical.
// Set NEXT_PUBLIC_SITE_URL di environment production (mis. https://larchivesonore.com).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://larchivesonore.com'
).replace(/\/$/, '');
