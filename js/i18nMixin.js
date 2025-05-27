// js/i18nMixin.js
const i18nMixin = {
    methods: {
        t(key) {
            return window.i18n?.t(key) || key;
        },
    },
    mounted() {
        // Escuchar cambios de idioma
        this.$root.$on("localeChanged", () => {
            this.$forceUpdate();
        });
    },
    beforeUnmount() {
        this.$root.$off("localeChanged");
    },
};
