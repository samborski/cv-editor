// js/app.js
const app = Vue.createApp({
  data() {
    return {
      editMode: false,
      cvData: CVDataStore.load(), // cvData ahora incluirá wikiSupportLink
      saveStatus: '',
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
    },
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    setEditModeGlobally(value) {
      this.editMode = Boolean(value);
    },
    resetData() {
      if (
        confirm(
          '¿Estás seguro de que quieres restaurar los datos por defecto? Todos los cambios locales se perderán.'
        )
      ) {
        this.cvData = CVDataStore.deepClone(CVDataStore.getDefaultData());
        this.saveStatus = 'Datos restaurados.';
        setTimeout(() => (this.saveStatus = ''), 2000);
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
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        htmlElement.classList.add('dark');
      } else {
        htmlElement.classList.remove('dark');
      }
    },
    exportData() {
      const dataStr = JSON.stringify(this.cvData, null, 2);
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
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
          if (
            confirm(
              '¿Estás seguro de que quieres importar estos datos? Se sobrescribirán los datos actuales.'
            )
          ) {
            this.cvData = CVDataStore.deepMerge(
              CVDataStore.getDefaultData(),
              importedData
            );
            this.saveStatus = 'Datos importados y guardados.';
            setTimeout(() => (this.saveStatus = ''), 3000);
          }
        } catch (error) {
          alert(
            'Error al importar el archivo. Asegúrate de que es un JSON válido con el formato esperado.'
          );
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    },
  },
  watch: {
    cvData: {
      handler(newData, oldData) {
        if (oldData && Object.keys(oldData).length > 0) {
          this.saveStatus = 'Guardando...';
          CVDataStore.save(newData);
          if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
          }
          this.saveTimeout = setTimeout(() => {
            this.saveStatus = 'Guardado ✓';
            setTimeout(() => {
              if (this.saveStatus === 'Guardado ✓') {
                this.saveStatus = '';
              }
            }, 2000);
          }, 700);
        } else if (!oldData || Object.keys(oldData).length === 0) {
          CVDataStore.save(newData);
        }
      },
      deep: true,
    },
  },
  created() {
    this.applyInitialTheme();
    this.saveTimeout = null;
  },
});

app.component('cv-controls', CvControls);
app.component('cv-header', CvHeader);
app.component('cv-professional-profile', CvProfessionalProfile);
app.component('cv-section-list', CvSectionList);
app.component('cv-social-links', CvSocialLinks);
// Si creaste un componente CvFooter.js, regístralo aquí:
// app.component('cv-footer', CvFooter);

app.mount('#app');
