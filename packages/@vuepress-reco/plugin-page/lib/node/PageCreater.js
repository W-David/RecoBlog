import { createPage } from '@vuepress/core';
import { isEmptyPlainObject, convertToPinyin } from '@vuepress-reco/shared';
// 获取时间的数字类型
export function formatDate(date) {
    const dateNum = !date ? 0 : new Date(date).getTime();
    return dateNum;
}
export function removeEmptyString(value) {
    return !value ? '' : value.trim().replaceAll(' ', '-');
}
// 比对时间
export function compareDate(prev, next) {
    const prevDate = formatDate(prev.frontmatter.date);
    const nextDate = formatDate(next.frontmatter.date);
    if (prevDate === 0 || nextDate === 0)
        return 0;
    return nextDate - prevDate;
}
export default class PageCreater {
    app;
    options;
    themeConfig;
    blogsToBeReleased;
    categoryPageData;
    _extendedPages;
    frontmatterKeys;
    series;
    constructor(options, app, themeConfig) {
        this.app = app;
        this.options = options;
        this.themeConfig = themeConfig;
        this.blogsToBeReleased = [];
        this.categoryPageData = {};
        this._extendedPages = [];
        this.frontmatterKeys = [];
        this.series = {};
    }
    parse() {
        this.parsePageOptions();
        this.setBlogsToCategoryPageData();
        this.createExtendedPages();
        /**
         * The name of the file is changed in the develop environment,
         * and bug of 404 appears during hot updates.
         */
        //
        if (this.app.env.isBuild) {
            this.parseChineseInPagePathToPinyin();
        }
    }
    // 将 path 中的中文转换成拼音
    parseChineseInPagePathToPinyin() {
        this.app.pages = this.app.pages.map((page) => {
            page.path = convertToPinyin(decodeURIComponent(page.path));
            page.data.path = convertToPinyin(decodeURIComponent(page.data.path));
            page.componentFilePath = convertToPinyin(decodeURIComponent(page.componentFilePath));
            page.componentFilePathRelative = convertToPinyin(decodeURIComponent(page.componentFilePathRelative));
            page.dataFilePath = convertToPinyin(decodeURIComponent(page.dataFilePath));
            page.dataFilePathRelative = convertToPinyin(decodeURIComponent(page.dataFilePathRelative));
            page.htmlFilePath = convertToPinyin(decodeURIComponent(page.htmlFilePath));
            page.htmlFilePathRelative = convertToPinyin(decodeURIComponent(page.htmlFilePathRelative));
            return page;
        });
    }
    // 解析 page 配置
    parsePageOptions() {
        this.options.forEach((option) => {
            if (option.type === 'category') {
                this._parseCategoryPageOptions(option);
            }
            else {
                this._parseOrdinaryPageOptions(option);
            }
        });
    }
    // 解析分类页面的配置
    _parseCategoryPageOptions(option) {
        const { frontmatterKey: key, pageSize, layout, } = option;
        this.frontmatterKeys.push(key);
        this.categoryPageData[key] = {
            pageSize: pageSize || 10,
            items: {},
            layout,
        };
    }
    // 解析常规页面的配置
    _parseOrdinaryPageOptions(option) {
        const { path, layout } = option;
        const page = createPage(this.app, {
            frontmatter: { layout },
            path: convertToPinyin(path),
        });
        this._extendedPages.push(page);
    }
    // 将博客页面注入进分类页面数据
    setBlogsToCategoryPageData() {
        // @ts-ignore
        const { autoSetBlogCategories, autoSetSeries } = this.themeConfig;
        const blogsToBeReleased = this.app.pages
            .filter((page) => {
            const publishFlag = !(!/.+\/blogs\/[(.+)\/]?.+\.md$/.test(page.filePath || '') ||
                page?.frontmatter?.publish === false ||
                page?.title === '');
            if (autoSetBlogCategories && publishFlag) {
                this._setBlogCategories(page);
            }
            if (autoSetSeries) {
                this._setSeries(page);
            }
            return publishFlag;
        })
            .sort((prev, next) => {
            const prevSticky = prev.frontmatter.sticky;
            const nextSticky = next.frontmatter.sticky;
            if (prevSticky && nextSticky) {
                return prevSticky == nextSticky
                    ? compareDate(prev, next)
                    : prevSticky - nextSticky;
            }
            else if (prevSticky && !nextSticky) {
                return -1;
            }
            else if (!prevSticky && nextSticky) {
                return 1;
            }
            else {
                return compareDate(prev, next);
            }
        })
            .map((page) => {
            const { title, frontmatter, path } = page;
            return { title, frontmatter, path };
        });
        this.blogsToBeReleased = blogsToBeReleased;
        blogsToBeReleased.forEach((page, index) => {
            const categoryKeysOfFrontmatter = Object.keys(page.frontmatter).filter((key) => {
                return this.frontmatterKeys.includes(key);
            });
            categoryKeysOfFrontmatter.forEach((key) => {
                const valueOfCurrentKey = page.frontmatter[key];
                const categoryValues = Array.isArray(valueOfCurrentKey)
                    ? valueOfCurrentKey
                    : [valueOfCurrentKey];
                if (isEmptyPlainObject(this.categoryPageData[key].items)) {
                    this.categoryPageData[key].items = categoryValues.reduce((prev, current) => {
                        prev[convertToPinyin(current)] = {
                            pages: [page],
                            length: 1,
                            label: removeEmptyString(current),
                        };
                        return prev;
                    }, {});
                }
                else {
                    categoryValues
                        ?.map((value) => removeEmptyString(String(value)))
                        .forEach((value) => {
                        if (!value)
                            return;
                        const categoryPageDataItem = this.categoryPageData[key].items[convertToPinyin(value)];
                        if (!categoryPageDataItem) {
                            this.categoryPageData[key].items[convertToPinyin(value)] = {
                                pages: [page],
                                length: 1,
                                label: value,
                            };
                        }
                        else {
                            const { pages, length, label } = categoryPageDataItem;
                            this.categoryPageData[key].items[convertToPinyin(value)] = {
                                length: length + 1,
                                pages: [...pages, page],
                                label,
                            };
                        }
                    });
                }
            });
        });
    }
    // 所有拓展的页面
    createExtendedPages() {
        this._createCategoryPaginationPages();
        this._createBlogPaginationPages();
    }
    // 生成分类的分页页面
    _createCategoryPaginationPages() {
        this.frontmatterKeys.forEach((key) => {
            const { items, layout, pageSize } = this.categoryPageData[key];
            const categoryValues = Object.keys(items);
            categoryValues.forEach((value, index) => {
                const totalCount = items[convertToPinyin(value)].length;
                const totalPage = Math.ceil(totalCount / pageSize);
                Array.from({ length: totalPage }).forEach((item, currentPage) => {
                    const page = createPage(this.app, {
                        path: `/${key}/${convertToPinyin(removeEmptyString(value))}/${currentPage + 1}/`,
                        frontmatter: { layout },
                    });
                    this._extendedPages.push(page);
                });
            });
        });
    }
    // 生成博客的分页页面
    _createBlogPaginationPages() {
        const totalPages = Math.ceil(this.blogsToBeReleased.length / 10);
        Array.from({ length: totalPages }).map((item, index) => {
            const page = createPage(this.app, {
                path: `/posts/${index + 1}/`,
                frontmatter: { layout: 'Post' },
            });
            this._extendedPages.push(page);
        });
    }
    // 设置类别
    _setBlogCategories(page) {
        const blogCategory = (page.filePath || '').match(/.+\/blogs\/(.+)\/.+\.md$/);
        if (blogCategory)
            page.frontmatter.categories = [blogCategory[1]];
    }
    // 设置系列
    _setSeries(page) {
        let docSeries = (page.filePath || '').match(/.+\/docs\/(.+)\/(.+)\/(.+)\.md$/);
        if (docSeries) {
            const series = `/docs/${docSeries[1]}/`;
            const group = docSeries[2];
            const filePath = `${series}${group}/${docSeries[3]}.md`;
            if (!this.series?.[series]) {
                // @ts-ignore
                this.series[`/${series}/`] = [
                    {
                        text: group,
                        children: [filePath],
                    },
                ];
                return;
            }
            else if (!this.series[series].some((groupItem) => groupItem?.text === group)) {
                this.series[series].push({
                    text: group,
                    children: [filePath],
                });
            }
            else {
                this.series[series]
                    .find((groupItem) => groupItem?.text === group)
                    .children.push(filePath);
            }
        }
        else {
            docSeries = (page.filePath || '').match(/.+\/docs\/(.+)\/(.+)\.md$/);
            if (docSeries) {
                const series = `/docs/${docSeries[1]}/`;
                const filePath = `${series}${docSeries[2]}.md`;
                if (!this.series?.[series]) {
                    // @ts-ignore
                    this.series[series] = [filePath];
                    return;
                }
                else {
                    this.series[series].push(filePath);
                }
            }
        }
    }
    // 所有拓展的页面
    get extendedPages() {
        return this._extendedPages;
    }
    get categoryPaginationPosts() {
        let data = {};
        this.frontmatterKeys.forEach((key) => {
            const { items, pageSize } = this.categoryPageData[key];
            const categoryValues = Object.keys(items);
            categoryValues.forEach((value) => {
                const { length, pages } = items[value];
                const totalPage = Math.ceil(length / pageSize);
                const paginationDataOfValue = Array.from({
                    length: totalPage,
                }).reduce((prev, current, index) => {
                    const currentPage = index + 1;
                    prev[`/${key}/${value}/${currentPage}/`] = {
                        pageSize,
                        totalPage: pages.length,
                        currentPage,
                        currentCategoryKey: key,
                        currentCategoryValue: value,
                        pages: pages.slice(pageSize * (currentPage - 1), pageSize * currentPage),
                    };
                    return prev;
                }, {});
                data = { ...data, ...paginationDataOfValue };
            });
        });
        return data;
    }
    get categorySummary() {
        return this.categoryPageData;
    }
    get posts() {
        return this.blogsToBeReleased;
    }
}
