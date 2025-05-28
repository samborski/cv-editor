// js/components/CvControls.js
const CvControls = {
    name: "CvControls",
    template: `
        <nav class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 print:hidden z-50">
            <div class="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
                <div class="flex items-center gap-1">
                    <button
                        v-for="locale in availableLocales"
                        :key="locale.code"
                        @click="handleLanguageChange(locale.code)"
                        :class="[
                            'p-2 pb-3 transition-all duration-200 text-2xl relative group',
                            currentLocale === locale.code 
                                ? 'scale-110' 
                                : 'hover:scale-105'
                        ]"
                        :title="locale.name"
                    >
                        <span class="transform transition-transform">{{ getLocaleIcon(locale.code) }}</span>
                        <div :class="[
                            'absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 transition-all duration-200',
                            currentLocale === locale.code
                                ? 'bg-primary dark:bg-dark-primary scale-100'
                                : 'bg-primary/0 dark:bg-dark-primary/0 scale-0 group-hover:bg-primary/50 dark:group-hover:bg-dark-primary/50 group-hover:scale-100'
                        ]"></div>
                    </button>
                </div>

                <div class="flex-1 text-center">
                    <span v-if="saveStatus" 
                          class="text-xs px-2 transition-opacity duration-300"
                          :class="{
                            'text-blue-600 dark:text-blue-400': saveStatus === t('controls.saving'),
                            'text-green-600 dark:text-green-400': saveStatus === t('controls.saved') || 
                                                                saveStatus.includes(t('controls.imported')) || 
                                                                saveStatus.includes(t('controls.restored')),
                            'opacity-100': saveStatus,
                            'opacity-0': !saveStatus
                          }">
                        {{ saveStatus }}
                    </span>
                </div>

                <div class="flex items-center gap-1">
                    <button @click="$emit('toggleEdit')"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        :title="editMode ? t('controls.view') : t('controls.edit')">
                        <i class="fa-solid" :class="editMode ? 'fa-eye' : 'fa-edit'"></i>
                    </button>
                    
                    <template v-if="editMode">
                        <button @click="$emit('resetData')"
                            type="button"
                            class="p-2 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-full transition-colors"
                            :title="t('controls.restore')">
                            <i class="fa-solid fa-undo"></i>
                        </button>
                    </template>
                    
                    <button @click="triggerPrint"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        :title="t('controls.print')">
                        <i class="fa-solid fa-print"></i>
                    </button>
                    
                    <button @click="downloadVCF"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        :title="t('controls.addContact')">
                        <i class="fa-solid fa-address-card"></i>
                    </button>
                    
                    <button @click="$emit('toggleDarkMode')"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        :title="t('controls.toggleTheme')">
                        <i class="fa-solid fa-circle-half-stroke"></i>
                    </button>
                    
                    <button @click="$emit('exportData')" 
                        :title="t('controls.exportData')"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors">
                        <i class="fa-solid fa-download"></i>
                    </button>
                    
                    <button @click="triggerImportClick" 
                        :title="t('controls.importData')"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors">
                        <i class="fa-solid fa-upload"></i>
                    </button>
                </div>
            </div>
            <input
                type="file"
                ref="importFileInput"
                @change="handleImportFile"
                accept=".json"
                class="hidden"
            />
        </nav>
    `,
    mixins: [i18nMixin],
    props: {
        editMode: Boolean,
        cvDataForVcf: Object,
        saveStatus: String,
    },
    emits: [
        "toggleEdit",
        "resetData",
        "toggleDarkMode",
        "exportData",
        "importData",
    ],
    data() {
        return {
            currentLocale: localStorage.getItem("locale") || window.i18n?.getCurrentLocale() || "es",
            availableLocales: [
                { code: "es", name: "Español" },
                { code: "en", name: "English" },
                { code: "fr", name: "Français" },
                { code: "pt", name: "Português" },
                { code: "eo", name: "Esperanto" },
            ]
        };
    },
    methods: {
        t(key) {
            return window.i18n?.t(key) || key;
        },
        getLocaleIcon(code) {
            const icons = {
                es: "🇪🇸",
                en: "🇺🇸",
                fr: "🇫🇷",
                pt: "🇧🇷",
                eo: "🌎",
            };
            return icons[code] || "🏳️";
        },        async handleLanguageChange(newLocale) {
            if (newLocale === this.currentLocale) return;
            
            try {
                // Actualizar el estado local
                this.currentLocale = newLocale;
                localStorage.setItem("locale", newLocale);
                
                // Cambiar el idioma globalmente
                if (window.i18n?.setLocale) {
                    await window.i18n.setLocale(newLocale);
                    
                    // Emitir el evento al componente padre
                    this.$emit("locale-changed", newLocale);
                    
                    // Notificar a otros componentes a través del bus de eventos global
                    this.$root.$emit("localeChanged", newLocale);
                    
                    // Forzar la actualización de la vista
                    this.$nextTick(() => {
                        this.$forceUpdate();
                        if (this.$root.$forceUpdate) {
                            this.$root.$forceUpdate();
                        }
                    });
                }
            } catch (error) {
                console.error("Error al cambiar el idioma:", error);
            }
        },
        triggerPrint() {
            window.print();
        },
        downloadVCF() {
            if (!this.cvDataForVcf) {
                console.error("No se proporcionaron datos para el VCF");
                return;
            }
            if (
                typeof Utils === "undefined" ||
                typeof Utils.generateVCF !== "function"
            ) {
                console.error("Utils.generateVCF no está definido");
                return;
            }

            const vcfContent = Utils.generateVCF(this.cvDataForVcf);
            const dataUri =
                "data:text/vcard;charset=utf-8," +
                encodeURIComponent(vcfContent);
            const nameForFile = this.cvDataForVcf.name
                ? this.cvDataForVcf.name.replace(/\s+/g, "_")
                : "contacto";
            const fileName = `${nameForFile}.vcf`;

            const link = document.createElement("a");
            link.setAttribute("href", dataUri);
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        triggerImportClick() {
            this.$refs.importFileInput?.click();
        },
        handleImportFile(event) {
            const file = event.target.files[0];
            if (file) {
                this.$emit("importData", file);
                event.target.value = null;
            }
        },
    },
    created() {
        // Escuchar cambios globales de idioma
        this.$root.$on("localeChanged", (locale) => {
            this.currentLocale = locale;
            this.$forceUpdate();
        });
    },
    mounted() {
        // Inicializar el idioma al cargar el componente
        if (this.currentLocale && window.i18n?.setLocale) {
            window.i18n.setLocale(this.currentLocale);
        }
    },
    beforeDestroy() {
        this.$root.$off("localeChanged");
    },
};
