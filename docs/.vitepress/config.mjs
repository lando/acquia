import {createRequire} from 'module';

import {defineConfig} from '@lando/vitepress-theme-default-plus/config';

const require = createRequire(import.meta.url);

const {name, version} = require('../../package.json');
const landoPlugin = name.replace('@lando/', '');

export default defineConfig({
  title: 'Lando Acquia Plugin',
  description: 'The offical Lando plugin for Acquia.',
  landoDocs: 3,
  landoPlugin,
  version,
  head: [
    ['meta', {name: 'viewport', content: 'width=device-width, initial-scale=1'}],
    ['link', {rel: 'icon', href: '/acquia/favicon.ico', size: 'any'}],
    ['link', {rel: 'icon', href: '/acquia/favicon.svg', type: 'image/svg+xml'}],
  ],
  themeConfig: {
    sidebar: sidebar(),
  },
  collections: {
    guide: {
      frontmatter: {
        collection: 'guide',
      },
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>',
      iconLink: '/guides',
      patterns: ['guides/**/*.md'],
    },
  }
});

function sidebar() {
  return [
    {
      text: 'Overview',
      collapsed: false,
      items: [
        {text: 'Introduction', link: '/'},
        {text: 'Installation', link: '/install'},
        {text: 'Configuration', link: '/config'},
        {text: 'Tooling', link: '/tooling'},
        {text: 'Syncing', link: '/sync'},
      ],
    },
    {text: 'Guides', link: '/guides', activeMatch: '/guides'},
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
        {text: 'Slack', link: 'https://launchpass.com/devwithlando'},
        {text: 'Contact Us', link: '/support'},
      ],
    },
    {text: 'Examples', link: 'https://github.com/lando/acquia/tree/main/examples'},
  ];
};
