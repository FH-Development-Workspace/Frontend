'use strict';

/**
 * Maintenance toggle for GitHub Pages (static site).
 * Set ENABLED to true before deploy to show the maintenance page site-wide.
 * Visit any page with ?preview=1 to preview the normal site (current tab only).
 */
window.FHD_MAINTENANCE = {
  ENABLED: true,
  MESSAGE: 'We are currently performing scheduled maintenance to upgrade our infrastructure. We expect to be back online shortly.',
  ALLOW_PREVIEW: true,
};
