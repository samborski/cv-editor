// js/components/CvHeader.js
const CvHeader = {
    // ... (props, emits, data, watch, methods sin cambios) ...
    props: ['cvData', 'editMode'],
    emits: [],
    data() {
        return {
            emailError: '',
            websiteUrlError: ''
        }
    },
    watch: {
        'cvData.email'(newEmail) {
            if (this.editMode && newEmail && newEmail.trim() !== '' && !Utils.isValidEmail(newEmail)) {
                this.emailError = 'Formato de email inválido.';
            } else {
                this.emailError = '';
            }
        },
        'cvData.websiteUrl'(newUrl) {
            if (this.editMode && newUrl && newUrl.trim() !== '' && !Utils.isValidUrl(newUrl)) {
                this.websiteUrlError = 'Formato de URL inválido.';
            } else {
                this.websiteUrlError = '';
            }
        }
    },
    methods: {
        clearField(fieldName) {
            if (this.cvData.hasOwnProperty(fieldName)) {
                this.cvData[fieldName] = '';
                if (fieldName === 'email') this.emailError = '';
                if (fieldName === 'websiteUrl') this.websiteUrlError = '';
                if (fieldName === 'websiteUrl' && !this.cvData.websiteDisplay) this.cvData.websiteDisplay = '';
                if (fieldName === 'websiteDisplay' && !this.cvData.websiteUrl) this.cvData.websiteUrl = '';
            }
        }
    },
    template: `
    <header class="flex flex-col md:flex-row print:flex-row items-center bg-secondary dark:bg-dark-secondary p-5 rounded-lg mb-2 print:mb-4 print:p-2 print:!bg-white mt-16 print:mt-0">
        <!-- Contenedor de la imagen de perfil y su input -->
        <div class="flex-shrink-0 mb-5 md:mb-0 print:mb-0 md:mr-5 print:mr-5">
            <!-- Mostrar la imagen solo si cvData.profilePicture no está vacío -->
            <img v-if="cvData.profilePicture" 
                 :src="cvData.profilePicture" 
                 alt="Foto de perfil"
                 class="w-32 max-w-[150px] min-w-[80px] print:w-28 rounded-full object-cover border-2 border-primary print:!border-black shadow" />
            
            <!-- El input para la URL de la foto siempre se muestra en modo edición, 
                 independientemente de si hay una foto o no, para permitir añadir una. -->
            <div v-if="editMode" class="relative mt-2">
                <input type="text" v-model="cvData.profilePicture" placeholder="URL de tu foto de perfil" class="edit-input pr-7">
                <i v-if="cvData.profilePicture" 
                   @click="clearField('profilePicture')" 
                   class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2"></i>
                <!-- Texto de ayuda si no hay foto y estamos en modo edición -->
                <p v-if="!cvData.profilePicture" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Pega aquí la URL de una imagen para tu perfil.
                </p>
            </div>
        </div>

        <div class="flex-1 text-center md:text-left print:text-left space-y-2">
            <h1 class="text-primary dark:text-dark-primary text-2xl md:text-3xl font-bold print:!text-black print:!mb-2">
                <span v-if="!editMode">{{ cvData.name }}</span>
                <div v-else class="relative">
                    <input type="text" v-model="cvData.name" placeholder="Nombre completo" class="edit-input text-2xl md:text-3xl font-bold pr-8">
                    <i v-if="cvData.name" 
                       @click="clearField('name')" 
                       class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2 text-base"></i>
                </div>
            </h1>
            
            <p class="print:!text-black">
                <i class="fa-solid fa-envelope text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <template v-if="!editMode">
                    <a :href="'mailto:' + cvData.email" class="text-primary dark:text-dark-primary hover:underline print:!text-black">{{ cvData.email }}</a>
                </template>
                <template v-else>
                    <span class="relative inline-block">
                        <input type="email" v-model="cvData.email" placeholder="tu.correo@ejemplo.com" class="edit-input inline-block w-auto pr-7">
                        <i v-if="cvData.email" @click="clearField('email')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                    </span>
                    <span v-if="emailError" class="text-red-500 text-xs ml-2 block md:inline">{{ emailError }}</span>
                </template>
                
                | 
                <i class="fa-solid fa-phone text-lightText dark:text-dark-lightText mx-2 print:!text-black"></i>
                <template v-if="!editMode">
                    <span>{{ cvData.phone }}</span>
                </template>
                <template v-else>
                    <span class="relative inline-block">
                        <input type="tel" v-model="cvData.phone" placeholder="+54 11 12345678" class="edit-input inline-block w-auto pr-7">
                        <i v-if="cvData.phone" @click="clearField('phone')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                    </span>
                </template>
                <a :href="'https://api.whatsapp.com/send?phone=' + (cvData.phone || '').replace(/\\s+/g, '')" target="_blank"
                   class="text-primary dark:text-dark-primary hover:text-green-500 dark:hover:text-green-400 ml-2 print:hidden" title="WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
            </p>

            <p class="print:!text-black">
                <i class="fa-solid fa-globe text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <template v-if="!editMode">
                    <a :href="cvData.websiteUrl" target="_blank" class="text-primary dark:text-dark-primary hover:underline print:!text-black">
                        {{ cvData.websiteDisplay || cvData.websiteUrl }}
                    </a>
                </template>
                <template v-else>
                    <span class="relative inline-block mr-1">
                        <input type="text" v-model="cvData.websiteDisplay" placeholder="Ej: Mi Portafolio" class="edit-input inline-block w-auto pr-7">
                        <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Texto que se mostrará para el enlace.</span>
                    </span>
                    <span class="relative inline-block">
                        <input type="url" v-model="cvData.websiteUrl" placeholder="https://www.tusitio.com" class="edit-input inline-block w-auto pr-7">
                        <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">URL completa de tu sitio web.</span>
                    </span>
                    <span v-if="websiteUrlError" class="text-red-500 text-xs ml-2 block">{{ websiteUrlError }}</span>
                </template>
            </p>

            <p class="print:!text-black">
                <i class="fa-solid fa-map-location-dot text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <span v-if="!editMode">{{ cvData.address }}</span>
                <span v-else class="relative block">
                    <input type="text" v-model="cvData.address" placeholder="Calle Número, Ciudad, Provincia" class="edit-input pr-7">
                    <i v-if="cvData.address" @click="clearField('address')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2"></i>
                </span>
            </p>

            <p class="print:!text-black">
                <i class="fa-solid fa-cake-candles text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <span v-if="!editMode">{{ cvData.birthdate }}</span>
                 <span v-else class="relative block">
                    <input type="text" v-model="cvData.birthdate" placeholder="DD de Mes de AAAA (ej: 18 de enero de 1973)" class="edit-input pr-7">
                     <i v-if="cvData.birthdate" @click="clearField('birthdate')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2"></i>
                    <span class="block text-xs text-gray-500 dark:text-gray-400 mt-1">Este formato se usa para el VCF.</span>
                </span>
            </p>
        </div>
    </header>
    `
};