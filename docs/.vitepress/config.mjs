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
});

function sidebar() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'Overview', link: '/' },
        { text: 'Installation', link: '/install' },
        { text: 'Usage', link: '/config' },
      ],
    },
    {
      text: 'Reference',
      collapsed: true,
      items: [
        { text: 'CLI', link: '/tooling' },
        { text: 'Examples', link: 'https://github.com/lando/acquia/tree/main/examples' },
      ]
    },
    {
      text: 'Guides',
      collapsed: true,
      items: [
        { text: 'Connecting to your database', link: '/connecting-database' },
        { text: 'Manually importing databases and files', link: '/manually-importing-databases' },
      ],
    },
    {
      text: 'Contribution',
      collapsed: true,
      items: [
        { text: 'Development', link: '/development' },
        { text: 'Team', link: '/team' },
      ],
    },
    {
      text: 'Help & Support',
      collapsed: true,
      items: [
        { text: 'GitHub', link: 'https://github.com/lando/acquia/issues/new/choose' },
        { text: 'Slack', link: 'https://launchpass.com/devwithlando' },
        { text: 'Contact Us', link: '/support' },
      ],
    },
    { text: 'Release Notes', link: 'https://github.com/lando/acquia/releases' },
  ];
};
