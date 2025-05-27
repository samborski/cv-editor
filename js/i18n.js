const i18n = {
    currentLocale: localStorage.getItem("preferred-locale") || "es",
    locales: {
        es,
        en,
        fr,
        pt,
        eo, // Importados de los archivos respectivos
    },

    t(key) {
        const keys = key.split(".");
        let value = this.locales[this.currentLocale];

        for (const k of keys) {
            value = value[k];
            if (value === undefined) return key;
        }

        return value;
    },

    setLocale(locale) {
        if (this.locales[locale]) {
            this.currentLocale = locale;
            localStorage.setItem("preferred-locale", locale);
            document.documentElement.lang = locale;
        }
    },
};
