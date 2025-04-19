'use strict';

/**
 * @file
 * Defines warning messages related to Drush usage within the Acquia plugin.
 */

/**
 * Generates a warning object for when a user attempts to globally install a Drush version
 * that recommends a site-local installation.
 *
 * @param {string} version The Drush version being installed globally.
 * @returns {object} A warning object with `title`, `detail` (an array of strings), and `url` properties.
 */
exports.drushWarn = version => ({
  title: 'May need site-local drush',
  detail: [
    `Lando has detected you are trying to globally install drush ${version}`,
    'This version of drush prefers a site-local installation',
    'We recommend you install drush that way, see:',
  ],
  url: 'https://www.drush.org/install/',
});
