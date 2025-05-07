import {createRequire} from 'module';

import {defineConfig} from '@lando/vitepress-theme-default-plus/config';

const require = createRequire(import.meta.url);

const {name, version} = require('../../package.json');
const landoPlugin = name.replace('@lando/', '');

/**
 * @file VitePress configuration for the Lando Acquia plugin documentation.
 */

export default defineConfig({
  title: 'Lando Acquia Plugin',
  /** A brief description of the plugin, used for SEO and metadata. */
  description: 'The offical Lando plugin for Acquia.',
  /** Specifies the Lando documentation version this plugin's docs are compatible with or relate to. */
  landoDocs: 3,
  /** The short name of the Lando plugin (e.g., 'acquia'). */
  landoPlugin,
  /** The current version of the plugin, sourced from package.json. */
  version,
  /** Additional HTML elements to be injected into the <head> tag of every page. */
  head: [
    ['meta', {name: 'viewport', content: 'width=device-width, initial-scale=1'}],
    ['link', {rel: 'icon', href: '/acquia/favicon.ico', size: 'any'}],
    ['link', {rel: 'icon', href: '/acquia/favicon.svg', type: 'image/svg+xml'}],
  ],
  /** Theme-specific configurations. */
  themeConfig: {
    /** Configuration for multi-version documentation builds. */
    multiVersionBuild: {
      satisfies: '>=1.5.0', // Specifies the version range of the theme this config is compatible with.
    },
    /** Defines the sidebar navigation structure. */
    sidebar: sidebar(),
  },
});

/**
 * Generates the sidebar navigation structure for the documentation site.
 *
 * The sidebar is organized into collapsible sections, each containing links
 * to different documentation pages.
 *
 * @return {Array<object>} An array of sidebar group objects, where each object
 * defines a section with a title (`text`), collapsibility (`collapsed`),
 * and an array of navigation items (`items`). Each item has a `text` (link label)
 * and a `link` (URL path). Some items might have an `activeMatch` property to control
 * highlighting for sections like Guides.
 */
function sidebar() {
  return [
    {
      text: 'Overview',
      collapsed: false,
      items: [
        {text: 'Introduction', link: '/'},
        {text: 'Installation', link: '/install'},
        {text: 'Getting Started', link: '/getting-started'},
        {text: 'Configuration', link: '/config'},
        {text: 'Tooling', link: '/tooling'},
        {text: 'Syncing', link: '/sync'},
      ],
    },
    {
      text: 'Contribution',
      collapsed: true,
      items: [
        {text: 'Development', link: '/development'},
        {text: 'Team', link: '/team'},
      ],
    },
    {
      text: 'Help & Support',
      collapsed: true,
      items: [
        {text: 'GitHub', link: 'https://github.com/lando/acquia/issues/new/choose'},
        {text: 'Slack', link: 'https://www.launchpass.com/devwithlando'},
        {text: 'Contact Us', link: '/support'},
        {text: 'Examples', link: 'https://github.com/lando/acquia/tree/main/examples'},
      ],
    },
    {text: 'Guides', link: '/guides', activeMatch: '/guides'},
  ];
}
