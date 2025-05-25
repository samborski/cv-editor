// js/components/CvControls.js
const CvControls = {
    props: ['editMode', 'cvDataForVcf', 'saveStatus'],
    emits: ['toggleEdit', 'resetData', 'toggleDarkMode', 'exportData', 'importData'],
    template: `
        <div class="relative">
            <div id="botones" class="absolute top-0 right-0 print:hidden z-10">
                <div class="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-bl-lg shadow-md dark:border dark:border-gray-600"> 
                    
                    <span v-if="saveStatus" 
                          class="text-xs px-2 transition-opacity duration-300"
                          :class="{
                            'text-blue-600 dark:text-blue-400': saveStatus === 'Guardando...',
                            'text-green-600 dark:text-green-400': saveStatus.includes('Guardado') || saveStatus.includes('importados') || saveStatus.includes('restaurados'),
                            'opacity-100': saveStatus,
                            'opacity-0': !saveStatus
                          }">
                        {{ saveStatus }}
                    </span>

                    <button @click="$emit('toggleEdit')"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        :title="editMode ? 'Ver CV' : 'Editar CV'">
                        <i class="fa-solid" :class="editMode ? 'fa-eye' : 'fa-edit'"></i>
                    </button>
                    <button v-if="editMode" @click="$emit('resetData')"
                        type="button"
                        class="p-2 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 rounded-full transition-colors"
                        title="Restaurar datos por defecto">
                        <i class="fa-solid fa-undo"></i>
                    </button>
                    <button @click="triggerPrint"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        title="Imprimir Currículum">
                        <i class="fa-solid fa-print text-lg"></i>
                    </button>
                    <button @click="downloadVCF"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        title="Agregar a contactos (VCF)">
                        <i class="fa-solid fa-address-card text-lg"></i>
                    </button>
                    <button @click="$emit('toggleDarkMode')"
                        type="button"
                        class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors"
                        title="Cambiar tema claro/oscuro">
                        <i class="fa-solid fa-circle-half-stroke text-lg"></i>
                    </button>
                    <button @click="$emit('exportData')" title="Exportar Datos (JSON)"
                        type="button"
                        class="p-2 text-green-500 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-700 rounded-full transition-colors">
                        <i class="fa-solid fa-file-export text-lg"></i>
                    </button>
                    <label for="importFile" title="Importar Datos (JSON)" tabindex="0" role="button" @keydown.enter.space="triggerImportClick"
                        class="p-2 text-blue-500 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-700 rounded-full transition-colors cursor-pointer">
                        <i class="fa-solid fa-file-import text-lg"></i>
                    </label>
                    <input type="file" id="importFile" @change="handleImportFile" ref="importFileInput" accept=".json" class="hidden">
                </div>
            </div>
        </div>
    `,
    methods: {
        handleImportFile(event) {
            const file = event.target.files[0];
            if (file) {
                this.$emit('importData', file);
                event.target.value = null; 
            }
        },
        triggerPrint() {
            window.print();
        },
        downloadVCF() {
            if (!this.cvDataForVcf) {
                console.error("Datos del CV (cvDataForVcf) no proporcionados al componente CvControls.");
                alert("No se pudieron cargar los datos para generar el VCF.");
                return;
            }
            if (typeof Utils === 'undefined' || typeof Utils.generateVCF !== 'function') {
                console.error("Utils.generateVCF no está definido.");
                alert("Error interno al intentar generar VCF: función no encontrada.");
                return;
            }

            const vcfContent = Utils.generateVCF(this.cvDataForVcf);
            const dataUri = 'data:text/vcard;charset=utf-8,' + encodeURIComponent(vcfContent);
            
            const nameForFile = this.cvDataForVcf.name ? this.cvDataForVcf.name.replace(/\s+/g, '_') : 'contacto';
            const fileName = `${nameForFile}.vcf`;

            let linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', fileName);
            linkElement.style.display = 'none';
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        },
        triggerImportClick() { // Para activar el input file con teclado en el label
            this.$refs.importFileInput.click();
        }
    }
};