// js/i18nMixin.js
const i18nMixin = {
    data() {
        return {
            currentLocale: window.i18n?.getCurrentLocale() || "es",
        };
    },
    methods: {
        t(key) {
            return window.i18n?.t(key) || key;
        },
        updateLocale() {
            this.currentLocale = window.i18n?.getCurrentLocale() || "es";
        },
    },
    created() {
        // Escuchar cambios globales de idioma a través de Vue
        this.$root.$on("localeChanged", this.handleLocaleChanged);

        // Escuchar cambios de idioma a través del DOM
        this.handleI18nChange = (event) => {
            this.handleLocaleChanged(event.detail.locale);
        };
        window.addEventListener("i18n:localeChanged", this.handleI18nChange);
    },
    methods: {
        handleLocaleChanged(newLocale) {
            this.currentLocale = newLocale;
            this.$nextTick(() => {
                this.$forceUpdate();
                // Forzar actualización de componentes hijos
                if (this.$children) {
                    this.$children.forEach((child) => child.$forceUpdate());
                }
            });
        },
        // ...existing methods...
    },
    beforeDestroy() {
        this.$root.$off("localeChanged", this.handleLocaleChanged);
        window.removeEventListener("i18n:localeChanged", this.handleI18nChange);
    },
};
