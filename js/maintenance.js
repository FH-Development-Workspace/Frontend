'use strict';

/**
 * Maintenance toggle for GitHub Pages (static site).
 * Set ENABLED to true before deploy to show the maintenance page site-wide.
 *
 * Team preview: use "Team Preview" on the maintenance page (password required).
 * Change PREVIEW_PASSWORD before each deploy — it is visible in source (staging gate only).
 */
window.FHD_MAINTENANCE = {
  ENABLED: true,
  MESSAGE: 'We are currently performing scheduled maintenance to upgrade our infrastructure. We expect to be back online shortly.',
  ALLOW_PREVIEW: false,

  /** Team preview password (change this). */
  PREVIEW_PASSWORD: 'fh-preview-2026',

  /** ClearDev client portal — hosting & staging management. */
  CLEARDEV_PORTAL_URL: 'https://www.cleardev.com/cleardev-client-login/',
  CLEARDEV_LABEL: 'ClearDev Client Portal',
};
