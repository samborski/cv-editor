const defaultCvData = {
  name: 'Daniel Gustavo Samborski',
  email: 'danielgsamborski@gmail.com',
  phone: '+54 3412294413',
  websiteDisplay: 'samborski.github.io/curriculum',
  websiteUrl: 'https://samborski.github.io/curriculum',
  address: 'San Diego 1129, Villa Gob. Gálvez',
  birthdate: '18 de enero de 1973',
  profilePicture: 'foto-de-perfil.jpg', // Ensure this image is accessible
  pdfLink: 'Currículum de Daniel Gustavo Samborski.pdf?v=20250503',
  vcfLink: 'contact.vcf',
  professionalProfile: `Técnico especializado en mantenimiento y reparación de PC, desarrollo de sitios web y electricidad domiciliaria.
Amplia experiencia como trabajador autónomo en distintas áreas, brindando soluciones tecnológicas y eléctricas a clientes particulares y PyMEs.
Comprometido con la calidad del servicio y con una gran capacidad de adaptación a distintas necesidades del mercado.`,
  education: [
    '<b>Auxiliar Mecánico de Motocicletas</b> (CIC - Centro de Capacitación)',
    '<b>Montador Electricista Domiciliario</b> (Centro de Capacitación Laboral Nº 6619)',
    '<b>Desarrollo de Sitios Web 2.0 con DRUPAL</b> (FAGDUT Instituto de Capacitación)',
    '<b>Armado, Mantenimiento y Reparación de PC, Redes y WIFI</b> (FAGDUT Instituto de Capacitación)',
    '<b>Desarrollo de Sitios Web con JAVA y .NET</b> (FAGDUT Instituto de Capacitación)',
    '<b>Programación en BASIC</b> (Maxicomp Computación)',
    '<b>Operador de Computadoras</b> (Maxicomp Computación)',
  ],
  experience: [
    '<b>Freelance</b> - Paseador de perros',
    '<b>CAR’s Racing</b> - Auxiliar Mecánico Automotriz',
    '<b>Freelance</b> - Electricista Domiciliario: Instalaciones eléctricas y reparaciones en hogares y comercios',
    '<b>Freelance</b> - Técnico en Computadoras: Reparación y mantenimiento de computadoras para particulares y PyMES',
    '<b>Comerciante en Negocio Familiar</b> - Atención al cliente, reposición de productos y tareas de limpieza',
    '<b>Freelance</b> - Trabajos de Medio Tiempo: Repartidor de volantes, cuidado de enfermos en hospitales, y otros servicios varios',
  ],
  technicalSkills: [
    '<strong>Programación y Desarrollo Web:</strong> HTML, CSS, SASS, JavaScript, PHP, MySQL, WordPress, Drupal, Bootstrap, Markdown, Python, .NET, Java',
    '<strong>Software y Aplicaciones:</strong> Microsoft Office, LibreOffice, Visual Studio Code, Eclipse, Thunderbird, Google Apps',
    '<strong>Otros Conocimientos:</strong> Electricidad domiciliaria',
  ],
  availability: 'Tiempo completo, ingreso inmediato',
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/danielgsamborski',
    github: 'https://github.com/samborski',
    twitter: 'https://x.com/dgsamborski',
    facebook: 'https://www.facebook.com/danielgsamborski',
  }
};

const app = Vue.createApp({
  data() {
    return {
      editMode: false,
      cvData: JSON.parse(JSON.stringify(defaultCvData)) // Deep copy for initial state
    };
  },
  computed: {
      encodedWebsiteUrl() {
          return encodeURIComponent(this.cvData.websiteUrl);
      },
      encodedShareText() {
          return encodeURIComponent(`Currículum de ${this.cvData.name}`);
      },
      encodedShareTitle() {
          return encodeURIComponent(`Currículum de ${this.cvData.name}`);
      },
      encodedShareSummary() {
          return encodeURIComponent('Desarrollador Web y Electricista'); // Or make this dynamic
      }
  },
  methods: {
    toggleEditMode() {
      this.editMode = !this.editMode;
      if (!this.editMode) {
        // Optional: if you want to ensure data is saved when exiting edit mode
        // this.saveDataToLocalStorage(); 
      }
    },
    saveDataToLocalStorage() {
      localStorage.setItem('cvDataSamborski', JSON.stringify(this.cvData));
      // console.log('Data saved to localStorage');
    },
    loadDataFromLocalStorage() {
      const savedData = localStorage.getItem('cvDataSamborski');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // Merge with defaults to ensure new properties are added if the stored data is old
          this.cvData = { ...JSON.parse(JSON.stringify(defaultCvData)), ...parsedData };
          // console.log('Data loaded from localStorage');
        } catch(e) {
          console.error("Error parsing data from localStorage, using defaults.", e);
          this.cvData = JSON.parse(JSON.stringify(defaultCvData)); // Fallback
        }
      } else {
        // console.log('No data in localStorage, using defaults.');
        this.cvData = JSON.parse(JSON.stringify(defaultCvData));
      }
    },
    resetData() {
      if(confirm('¿Estás seguro de que quieres restaurar los datos por defecto? Todos los cambios locales se perderán.')) {
          this.cvData = JSON.parse(JSON.stringify(defaultCvData));
          // Data will be auto-saved by the watcher immediately after this change
      }
    },
    addItem(listName, defaultValue = 'Nuevo ítem (click para editar)') {
      if (this.cvData[listName] && Array.isArray(this.cvData[listName])) {
        this.cvData[listName].push(defaultValue);
      }
    },
    removeItem(listName, index) {
      if (this.cvData[listName] && Array.isArray(this.cvData[listName])) {
        this.cvData[listName].splice(index, 1);
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
    }
  },
  watch: {
    cvData: {
      handler() {
        this.saveDataToLocalStorage();
      },
      deep: true, 
    },
  },
  created() {
    this.loadDataFromLocalStorage();
    this.applyInitialTheme(); 
  },
});

app.mount('#app');