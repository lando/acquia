module.exports = {
  lang: 'en-US',
  title: 'Lando',
  description: 'Lando is the best local development environment option for Acquia, the fastest way to build modern web apps.',
  base: '/acquia/',
  head: [
    ['meta', {name: 'viewport', content: 'width=device-width, initial-scale=1'}],
    ['link', {rel: 'icon', href: '/acquia/favicon.ico', size: 'any'}],
    ['link', {rel: 'icon', href: '/acquia/favicon.svg', type: 'image/svg+xml'}],
    ['link', {rel: 'preconnect', href: '//fonts.googleapis.com'}],
    ['link', {rel: 'preconnect', href: '//fonts.gstatic.com', crossorigin: true}],
    ['link', {rel: 'stylesheet', href: '//fonts.googleapis.com/css2?family=Lexend:wght@500&display=swap'}],
  ],
  theme: '@lando/vuepress-theme-default-plus',
  themeConfig: {
    landoDocs: true,
    logo: '/images/icon.svg',
    docsDir: 'docs',
    docsBranch: 'main',
    repo: 'lando/acquia',
    sidebarHeader: {
      enabled: true,
      title: 'Acquia Plugin',
      icon: '/images/acquiaicon.png',
    },
    sidebar: [
      {
        text: 'Overview',
        link: '/index.html',
      },
      '/getting-started.html',
      '/config.html',
      '/tooling.html',
      '/sync.html',
      {
        text: 'Guides',
        collapsible: true,
        children: [
          {
            text: 'Connecting to your database',
            link: '/connecting-database.html',
          },
          {
            text: 'Manually importing databases and files',
            link: '/manually-importing-databases.html',
          },
        ],
      },
      '/support.html',
      {text: 'Examples', link: 'https://github.com/lando/acquia/tree/main/examples'},
      {text: 'Release Notes', link: 'https://github.com/lando/acquia/releases'},
      '/development.html',
    ],
  },
};
