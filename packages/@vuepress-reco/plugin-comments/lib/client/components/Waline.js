import { usePageLang, withBase, usePageData } from '@vuepress/client';
import { Waline } from '@waline/client/dist/component';
import { computed, defineComponent, h, toRefs } from 'vue';
import '@waline/client/dist/waline.css';
import '../styles/waline.css';
export default defineComponent({
    name: 'Waline',
    props: {
        options: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    setup(props) {
        const { options } = toRefs(props);
        const lang = usePageLang();
        const pageData = usePageData();
        const walineOption = computed(() => ({
            lang: lang.value || 'zh-CN',
            dark: 'html[class="dark"]',
            path: withBase(pageData.value?.path),
            ...options.value,
            pageview: false,
        }));
        return () => h('div', {
            class: 'reco-waline-wrapper',
        }, h(Waline, walineOption.value));
    },
});
