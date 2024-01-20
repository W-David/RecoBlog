import { tailwindcssConfig } from '@vuepress-reco/tailwindcss-config';
import postcssImport from 'postcss-import';
import tailwindcssNesting from 'tailwindcss/nesting/index.js';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssEach from 'postcss-each';
export const mergeViteBundlerConfig = (options, config) => {
    // Handling postcss alone
    // For inline PostCSS config, it expects the same format as postcss.config.js.
    // But for plugins property, only array format can be used.
    const userViteConfig = config?.viteOptions || {};
    if (typeof userViteConfig?.css?.postcss === 'string') {
        throw new Error('String type postcss is not supported yet');
    }
    const userPostcssPlugins = userViteConfig?.css?.postcss?.plugins || [];
    if (!Array.isArray(userPostcssPlugins)) {
        throw new Error('plugins for postcss must be an array');
    }
    const viteOptions = {
        ...userViteConfig || {},
        ...{
            css: {
                ...userViteConfig?.css || {},
                ...{
                    postcss: {
                        ...userViteConfig?.css?.postcss || {},
                        ...{
                            plugins: [
                                ...userPostcssPlugins,
                                ...options?.viteOptions?.css?.postcss?.plugins
                            ],
                        }
                    },
                }
            },
        }
    };
    return {
        viteOptions: { ...viteOptions },
        vuePluginOptions: { ...(options?.vuePluginOptions || {}), ...(config?.vuePluginOptions || {}) }
    };
};
export const defaultViteBundlerConfig = () => ({
    viteOptions: {
        css: {
            postcss: {
                plugins: [
                    postcssImport,
                    tailwindcssNesting,
                    tailwindcss(tailwindcssConfig),
                    autoprefixer({}),
                    postcssEach
                ]
            }
        },
    }
});
export const resolveUserConfig = (config) => {
    return config?.viteBundler || {};
};
