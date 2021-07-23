module.exports = {
    input: [
        'src/**/*.{htm,html,js,jsx,vue}',
        // Use ! to filter out files or directories
        '!app/**/*.spec.{js,jsx}',
        '!app/i18n/**',
        '!**/node_modules/**',
    ],
    output: './',
    options: {
        debug: true,
        removeUnusedKeys: true,
        func: {
            list: ['\\$t'],
            extensions: ['.js', '.jsx', '.vue', '.html', '.htm'],
        },
        trans: {
            component: 'Trans',
            extensions: [],
        },
        lngs: process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(','),
        // ns: ['locale', 'layouts_main', 'components', 'views_auth', 'views_booking', 'views_client', 'views_company', 'views_schedule', 'views_specialHours'],
        defaultLng: process.env.VUE_APP_I18N_LOCALE,
        defaultNs: 'locale',
        defaultValue: function(lng, ns, key) {
            if (lng === process.env.VUE_APP_I18N_LOCALE) {
                // Return key as the default value for English language
                return key;
            }
            // Return the string '__NOT_TRANSLATED__' for other languages
            return '__STRING_NOT_TRANSLATED__';
        },
        resource: {
            loadPath: 'src/assets/locales/{{lng}}.json',
            savePath: 'src/assets/locales/{{lng}}.json',
            jsonIndent: 4,
            lineEnding: '\n',
        },
        nsSeparator: false, // namespace separator
        keySeparator: '.', // key separator
        interpolation: {
            prefix: '{{',
            suffix: '}}',
        },
    },
};
