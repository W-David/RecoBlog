import { inject } from 'vue';
import { useRoute } from 'vue-router';
import { isPlainObject, isString, resolveLocalePath } from '@vuepress/shared';
import { useNavLink } from './useNavLink';
import { usePageData } from '@vuepress-reco/vuepress-plugin-page/lib/client/composable';
export const seriesItemsSymbol = Symbol('seriesItems');
export const useSeriesItems = () => {
    const seriesItems = inject(seriesItemsSymbol);
    if (!seriesItems) {
        throw new Error('useSeriesItems() is called without provider.');
    }
    return seriesItems;
};
export const resolveSeriesItems = (frontmatter, themeLocal, series) => {
    const { series: autoSeries } = usePageData();
    // get series config from frontmatter > themeConfig
    let seriesConfig = themeLocal.series ?? {};
    seriesConfig = {
        ...autoSeries,
        ...seriesConfig,
    };
    // 解决
    // resolve series items according to the config
    if (frontmatter.home) {
        return [];
    }
    if (isPlainObject(seriesConfig)) {
        return resolveMultiSeriesItems(seriesConfig);
    }
    return [];
};
/**
 * Resolve series items if the config is an array
 */
export const resolveArraySeriesItems = (seriesConfig) => {
    const handleChildItem = (item) => {
        let childItem;
        if (isString(item)) {
            childItem = useNavLink(item);
        }
        else {
            childItem = item;
        }
        return childItem;
    };
    return seriesConfig.map((item) => {
        if (isString(item)) {
            return useNavLink(item);
        }
        return {
            ...item,
            children: item.children.map(handleChildItem),
        };
    });
};
/**
 * Resolve series items if the config is a key -> value (path-prefix -> array) object
 */
export const resolveMultiSeriesItems = (seriesConfig) => {
    const route = useRoute();
    const seriesPath = resolveLocalePath(seriesConfig, decodeURIComponent(route.path));
    const matchedSeriesConfig = seriesConfig[seriesPath] ?? [];
    return resolveArraySeriesItems(matchedSeriesConfig);
};
