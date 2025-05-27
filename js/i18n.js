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
            // Disparar un evento para notificar el cambio de idioma
            window.dispatchEvent(
                new CustomEvent("localeChanged", { detail: locale })
            );
        }
    },

    getCurrentLocale() {
        return this.currentLocale;
    },

    // Inicializar el idioma
    init() {
        const savedLocale = localStorage.getItem("preferred-locale");
        if (savedLocale && this.locales[savedLocale]) {
            this.setLocale(savedLocale);
        } else {
            // Detectar el idioma del navegador
            const browserLang = navigator.language.split("-")[0];
            if (this.locales[browserLang]) {
                this.setLocale(browserLang);
            } else {
                this.setLocale("es"); // Idioma por defecto
            }
        }
    },
};

// Hacer i18n accesible globalmente
window.i18n = i18n;

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    i18n.init();
});
