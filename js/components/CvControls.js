// js/components/CvControls.js
const CvControls = {
    props: ["editMode", "cvDataForVcf", "saveStatus"],
    emits: [
        "toggleEdit",
        "resetData",
        "toggleDarkMode",
        "exportData",
        "importData",
    ],
    data() {
        return {
            availableLocales: [
                { code: "es", name: "Español" },
                { code: "en", name: "English" },
                { code: "fr", name: "Français" },
                { code: "pt", name: "Português" },
                { code: "eo", name: "Esperanto" },
            ],
        };
    },
    computed: {
        currentLocale() {
            return i18n.currentLocale;
        },
    },
    methods: {
        changeLanguage(locale) {
            i18n.setLocale(locale);
        },
        handleImportFile(event) {
            const file = event.target.files[0];
            if (file) {
                this.$emit("importData", file);
                event.target.value = null;
            }
        },
        triggerPrint() {
            window.print();
        },
        downloadVCF() {
            if (!this.cvDataForVcf) {
                console.error(
                    "Datos del CV (cvDataForVcf) no proporcionados al componente CvControls."
                );
                alert("No se pudieron cargar los datos para generar el VCF.");
                return;
            }
            if (
                typeof Utils === "undefined" ||
                typeof Utils.generateVCF !== "function"
            ) {
                console.error("Utils.generateVCF no está definido.");
                alert(
                    "Error interno al intentar generar VCF: función no encontrada."
                );
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

            let linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", fileName);
            linkElement.style.display = "none";
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        },
        triggerImportClick() {
            // Para activar el input file con teclado en el label
            this.$refs.importFileInput.click();
        },
    },
    template: `
        <div class="relative">
            <div id="botones" class="absolute top-0 right-0 print:hidden z-10">
                <div class="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-bl-lg shadow-md dark:border dark:border-gray-600"> 
                    
                    <span v-if="saveStatus" 
                          class="text-xs px-2 transition-opacity duration-300"
                          :class="{
                            'text-blue-600 dark:text-blue-400': saveStatus === i18n.t('controls.saving'),
                            'text-green-600 dark:text-green-400': saveStatus.includes(i18n.t('controls.saved')) || 
                                                                saveStatus.includes(i18n.t('controls.imported')) || 
                                                                saveStatus.includes(i18n.t('controls.restored')),
                            'opacity-100': saveStatus,
                            'opacity-0': !saveStatus
                          }">
                        {{ saveStatus }}
                    </span>

                    <select v-model="currentLocale" 
                            @change="changeLanguage($event.target.value)"
                            class="text-sm p-1 rounded bg-white dark:bg-gray-700 border dark:border-gray-600">
                        <option v-for="locale in availableLocales" 
                                :key="locale.code" 
                                :value="locale.code">
                            {{ locale.name }}
                        </option>
                    </select>

                    <button @click="$emit('toggleEdit')"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        :title="editMode ? i18n.t('controls.view') : i18n.t('controls.edit')">
                        <i class="fa-solid" :class="editMode ? 'fa-eye' : 'fa-edit'"></i>
                    </button>
                    <button v-if="editMode" @click="$emit('resetData')"
                        type="button"
                        class="p-2 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-full transition-colors"
                        :title="i18n.t('controls.restore')">
                        <i class="fa-solid fa-undo"></i>
                    </button>
                    <button @click="triggerPrint"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        :title="i18n.t('controls.print')">
                        <i class="fa-solid fa-print text-lg"></i>
                    </button>
                    <button @click="downloadVCF"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        :title="i18n.t('controls.addContact')">
                        <i class="fa-solid fa-address-card text-lg"></i>
                    </button>
                    <button @click="$emit('toggleDarkMode')"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        :title="i18n.t('controls.toggleTheme')">
                        <i class="fa-solid fa-circle-half-stroke text-lg"></i>
                    </button>
                    <button @click="$emit('exportData')" 
                        :title="i18n.t('controls.exportData')"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors">
                        <i class="fa-solid fa-download text-lg"></i>
                    </button>
                    <button @click="$emit('importData')" 
                        :title="i18n.t('controls.importData')"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors">
                        <i class="fa-solid fa-upload text-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
};
