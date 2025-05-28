const i18n = {
    curr    setLocale(locale) {
        if (this.locales[locale]) {
            this.currentLocale = locale;
            localStorage.setItem("preferred-locale", locale);
            document.documentElement.lang = locale;
            
            // Emitir evento Vue global
            if (window.app) {
                window.app.$emit('localeChanged', locale);
            }
            
            // Emitir evento DOM
            window.dispatchEvent(new CustomEvent('i18n:localeChanged', {
                bubbles: true,
                detail: { locale }
            }));

            // Recargar las traducciones
            this.loadTranslations(locale);
            
            return true;
        }
        return false;
    },

    loadTranslations(locale) {
        if (this.locales[locale]) {
            // Asegurarse de que tenemos las traducciones más recientes
            this.locales = {
                es: window.es || this.locales.es,
                en: window.en || this.locales.en,
                fr: window.fr || this.locales.fr,
                pt: window.pt || this.locales.pt,
                eo: window.eo || this.locales.eo,
            };
        }
    },Storage.getItem("preferred-locale") || "es",
    locales: {
        es: window.es || {},
        en: window.en || {},
        fr: window.fr || {},
        pt: window.pt || {},
        eo: window.eo || {},
    },

    t(key) {
        const keys = key.split(".");
        let value = this.locales[this.currentLocale];

        for (const k of keys) {
            if (!value) return key;
            value = value[k];
            if (value === undefined) return key;
        }

        return value || key;
    },

    async setLocale(locale) {
        if (this.locales[locale]) {
            this.currentLocale = locale;
            localStorage.setItem("preferred-locale", locale);
            document.documentElement.lang = locale;
            
            // Cargar traducciones si no están cargadas
            if (!this.locales[locale] || Object.keys(this.locales[locale]).length === 0) {
                await this.loadTranslations(locale);
            }
            
            // Disparar evento DOM
            window.dispatchEvent(new CustomEvent("i18n:localeChanged", {
                bubbles: true,
                detail: { locale, translations: this.locales[locale] }
            }));
            
            // Disparar evento Vue
            if (window.app?.$root) {
                window.app.$root.$emit("localeChanged", locale);
            }
            
            return true;
        }
        return false;
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
