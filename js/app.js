// js/app.js
const app = Vue.createApp({
    data() {
        return {
            editMode: false,
            cvData: CVDataStore.load() // Carga inicial desde el store
        };
    },
    computed: {
        encodedWebsiteUrl() {
            return Utils.encodeUrl(this.cvData.websiteUrl);
        },
        encodedShareText() {
            return Utils.encodeUrl(`Currículum de ${this.cvData.name}`);
        },
        encodedShareTitle() {
            return Utils.encodeUrl(`Currículum de ${this.cvData.name}`);
        },
        encodedShareSummary() {
            return Utils.encodeUrl('Desarrollador Web y Electricista');
        }
    },
    methods: {
        toggleEditMode() {
            this.editMode = !this.editMode;
        },
        resetData() {
            if (confirm('¿Estás seguro de que quieres restaurar los datos por defecto? Todos los cambios locales se perderán.')) {
                this.cvData = CVDataStore.deepClone(CVDataStore.getDefaultData());
                // El watcher guardará automáticamente
            }
        },
        toggleDarkMode() {
            const htmlElement = document.documentElement;
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.theme = 'light';
            } else {
                htmlElement.classList.add('dark');
                localStorage.theme = 'dark';
            }
        },
        applyInitialTheme() {
            const htmlElement = document.documentElement;
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                htmlElement.classList.add('dark');
            } else {
                htmlElement.classList.remove('dark');
            }
        },
        exportData() {
            const dataStr = JSON.stringify(this.cvData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = 'cv_data.json';
            let linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            linkElement.remove();
        },
        importData(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    // Aquí podrías añadir validación del schema importado
                    if (confirm("¿Estás seguro de que quieres importar estos datos? Se sobrescribirán los datos actuales.")) {
                        this.cvData = CVDataStore.deepMerge(CVDataStore.getDefaultData(), importedData);
                         // El watcher guardará automáticamente
                        alert("Datos importados correctamente.");
                    }
                } catch (error) {
                    alert("Error al importar el archivo. Asegúrate de que es un JSON válido con el formato esperado.");
                    console.error("Error importing data:", error);
                }
            };
            reader.readAsText(file);
        }
    },
    watch: {
        cvData: {
            handler(newData) {
                CVDataStore.save(newData);
            },
            deep: true,
        },
    },
    created() {
        this.applyInitialTheme();
        // cvData ya se carga en la declaración de data
    }
});

// Registrar componentes
app.component('cv-controls', CvControls);
app.component('cv-header', CvHeader);
app.component('cv-professional-profile', CvProfessionalProfile);
app.component('cv-section-list', CvSectionList);
app.component('cv-social-links', CvSocialLinks);

app.mount('#app');