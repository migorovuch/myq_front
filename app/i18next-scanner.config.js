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
        func: {
            list: ['\\$t'],
            extensions: ['.js', '.jsx', '.vue', '.html', '.htm'],
        },
        trans: {
            component: 'Trans',
            extensions: [],
        },
        lngs: ['en', 'ua'],
        ns: ['locale'],
        defaultLng: 'en',
        defaultNs: 'locale',
        defaultValue: function(lng, ns, key) {
            if (lng === 'en') {
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
        keySeparator: false, // key separator
        interpolation: {
            prefix: '{{',
            suffix: '}}',
        },
    },
};
