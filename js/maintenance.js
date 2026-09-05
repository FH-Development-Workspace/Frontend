'use strict';

/**
 * Maintenance toggle for GitHub Pages (static site).
 * Set ENABLED to true before deploy to show the maintenance page site-wide.
 *
 * Team preview: use "Team Preview" on the maintenance page (password required).
 * Change PREVIEW_PASSWORD before each deploy — it is visible in source (staging gate only).
 */
window.FHD_MAINTENANCE = {
  ENABLED: false,
  MESSAGE: 'We are currently performing scheduled maintenance to upgrade our infrastructure. We expect to be back online shortly.',
  ALLOW_PREVIEW: true,

  /** Team preview password (change this). */
  PREVIEW_PASSWORD: 'fh-preview-2026',

};
