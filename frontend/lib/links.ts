/**
 * Outbound destinations used in more than one place. Keeping them here means
 * the header CTA, the membership page and any future footer can never drift
 * apart.
 */

/* The membership sign-up form. */
export const JOIN_FORM_URL =
  "https://docs.google.com/forms/d/1ZjyDyExlYR-Cw79MtM8xJM_trspFm1xg1Gj7Oq7-ZIE/edit?pli=1";

/* The national body we are working toward affiliating with. */
export const AMSTAT_URL = "https://www.amstat.org/";

/* The club Instagram. */
export const INSTAGRAM_URL = "https://www.instagram.com/asatxstate";

/* The club LinkedIn. */
export const LINKEDIN_URL = "https://www.linkedin.com/company/asatxstate/about/";

/* The club inbox. Kept as a bare address so both `mailto:` links and the
   places that print it on the page read from the same string. */
export const CONTACT_EMAIL = "asatxst@gmail.com";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
