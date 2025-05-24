// js/app.js
const app = Vue.createApp({
  data() {
    return {
      editMode: false,
      cvData: CVDataStore.load(),
      saveStatus: '', // Nueva propiedad para el feedback de guardado
    };
  },
  // ... (computed sin cambios) ...
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
    // ... (otros métodos como toggleEditMode, resetData, etc. sin cambios) ...
    toggleEditMode() {
      // Para el botón principal de CvControls
      this.editMode = !this.editMode;
    },
    setEditModeGlobally(value) {
      // Para los clics en los campos
      this.editMode = Boolean(value);
    },
    resetData() {
      if (
        confirm(
          '¿Estás seguro de que quieres restaurar los datos por defecto? Todos los cambios locales se perderán.'
        )
      ) {
        this.cvData = CVDataStore.deepClone(CVDataStore.getDefaultData());
        this.saveStatus = 'Datos restaurados.'; // Feedback inmediato
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
            this.saveStatus = 'Datos importados y guardados.'; // Feedback
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
        // Evitar el spam de "Guardando..." en la carga inicial si oldData no está definido
        if (oldData && Object.keys(oldData).length > 0) {
          this.saveStatus = 'Guardando...';
          CVDataStore.save(newData);
          // Usamos un debounce improvisado para el mensaje "Guardado"
          // Si hay múltiples cambios rápidos, solo el último mostrará "Guardado"
          if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
          }
          this.saveTimeout = setTimeout(() => {
            this.saveStatus = 'Guardado ✓';
            setTimeout(() => {
              // Solo limpiar si sigue siendo "Guardado ✓" (para no sobreescribir "Guardando...")
              if (this.saveStatus === 'Guardado ✓') {
                this.saveStatus = '';
              }
            }, 2000); // Tiempo que se muestra "Guardado ✓"
          }, 700); // Tiempo de espera antes de mostrar "Guardado ✓"
        } else if (!oldData || Object.keys(oldData).length === 0) {
          // Primera carga, simplemente guardar sin feedback de "Guardando..."
          // o si es la primera vez que se setea cvData desde el load.
          CVDataStore.save(newData);
        }
      },
      deep: true,
    },
  },
  created() {
    this.applyInitialTheme();
    this.saveTimeout = null; // Inicializar saveTimeout
    // cvData ya se carga en la declaración de data, el watcher se encargará del primer guardado.
  },
});

// ... (registro de componentes y app.mount sin cambios)
app.component('cv-controls', CvControls);
app.component('cv-header', CvHeader);
app.component('cv-professional-profile', CvProfessionalProfile);
app.component('cv-section-list', CvSectionList);
app.component('cv-social-links', CvSocialLinks);

app.mount('#app');
