import { defineUserConfig } from 'vuepress'
import recoTheme from 'vuepress-theme-reco'

export default defineUserConfig({
  title: "Mr.Wang's Blog",
  theme: recoTheme({
    style: '@vuepress-reco/style-default',
    logo: '/filter.png',
    author: 'RushWang',
    authorAvatar: '/avater.jpg',
    lastUpdatedText: '最后更新于',
    autoSetBlogCategories: true,
    autoAddCategoryToNavbar: {
      location: 1,
      categoryText: '分类',
      tagText: '标签'
    },
    catalogTitle: '章节导航',
    navbar: [
      { text: '首页', link: '/' },
      { text: '博文', link: '/posts' },
      { text: '时间轴', link: '/timeline' },
      { text: '友链', link: '/friendship-link' }
    ],
    friendshipLinks: [
      {
        title: 'Github',
        logo: 'https://github.githubassets.com/favicons/favicon.svg',
        link: 'https://github.com/W-David'
      },
      {
        title: 'Bilibili',
        logo: 'https://www.bilibili.com/favicon.ico?v=1',
        link: 'https://bilibili.com'
      }
    ]
  })
  // debug: true
})
