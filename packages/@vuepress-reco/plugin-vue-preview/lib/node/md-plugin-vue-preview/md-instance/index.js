import { createMarkdown } from '@vuepress/markdown';
import { resolveHighlighter } from '@vuepress/plugin-prismjs';
const md = createMarkdown();
md.options.highlight = (code, lang) => {
    const highlighter = resolveHighlighter(lang);
    return highlighter?.(code) || '';
};
export { md };
