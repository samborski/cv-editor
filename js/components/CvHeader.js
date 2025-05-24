// js/components/CvHeader.js
const CvHeader = {
    props: ['cvData', 'editMode'],
    emits: [], // Puedes declarar emits si los usas, por ahora no es crucial para esto
    data() {
        return {
            emailError: '',
            websiteUrlError: '' // Nuevo estado para error de URL del sitio web
        }
    },
    watch: {
        'cvData.email'(newEmail) {
            if (this.editMode && newEmail && !Utils.isValidEmail(newEmail)) {
                this.emailError = 'Formato de email inválido.';
            } else {
                this.emailError = '';
            }
        },
        'cvData.websiteUrl'(newUrl) { // Nuevo watcher para websiteUrl
            if (this.editMode && newUrl && !Utils.isValidUrl(newUrl)) {
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
                 // Limpiar errores asociados si se limpia el campo
                if (fieldName === 'email') this.emailError = '';
                if (fieldName === 'websiteUrl') this.websiteUrlError = '';
            }
        }
    },
    template: `
    <header class="flex flex-col md:flex-row print:flex-row items-center bg-secondary dark:bg-dark-secondary p-5 rounded-lg mb-2 print:mb-4 print:p-2 print:!bg-white mt-16 print:mt-0">
        <div class="flex-shrink-0 mb-5 md:mb-0 print:mb-0 md:mr-5 print:mr-5">
            <img :src="cvData.profilePicture" alt="Foto de perfil"
                 class="w-32 max-w-[150px] min-w-[80px] print:w-28 rounded-full object-cover border-2 border-primary print:!border-black shadow" />
            <div v-if="editMode" class="relative mt-2">
                <input type="text" v-model="cvData.profilePicture" placeholder="URL foto de perfil" class="edit-input pr-7">
                <i v-if="cvData.profilePicture" 
                   @click="clearField('profilePicture')" 
                   class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2"></i>
            </div>
        </div>
        <div class="flex-1 text-center md:text-left print:text-left space-y-2">
            <h1 class="text-primary dark:text-dark-primary text-2xl md:text-3xl font-bold print:!text-black print:!mb-2">
                <span v-if="!editMode">{{ cvData.name }}</span>
                <div v-else class="relative">
                    <input type="text" v-model="cvData.name" class="edit-input text-2xl md:text-3xl font-bold pr-8">
                    <i v-if="cvData.name" 
                       @click="clearField('name')" 
                       class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2 text-base"></i>
                </div>
            </h1>
            <p class="print:!text-black">
                <i class="fa-solid fa-envelope text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <a :href="'mailto:' + cvData.email" class="text-primary dark:text-dark-primary hover:underline print:!text-black">
                    <span v-if="!editMode">{{ cvData.email }}</span>
                    <span v-else class="relative inline-block">
                        <input type="email" v-model="cvData.email" class="edit-input inline-block w-auto pr-7">
                        <i v-if="cvData.email" @click="clearField('email')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                    </span>
                </a>
                <span v-if="editMode && emailError" class="text-red-500 text-xs ml-2 block md:inline">{{ emailError }}</span>
                |
                <i class="fa-solid fa-phone text-lightText dark:text-dark-lightText mx-2 print:!text-black"></i>
                <span v-if="!editMode">{{ cvData.phone }}</span>
                <span v-else class="relative inline-block">
                    <input type="tel" v-model="cvData.phone" class="edit-input inline-block w-auto pr-7">
                    <i v-if="cvData.phone" @click="clearField('phone')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                </span>
                <a :href="'https://api.whatsapp.com/send?phone=' + (cvData.phone || '').replace(/\\s+/g, '')" target="_blank"
                   class="text-primary dark:text-dark-primary hover:text-green-500 dark:hover:text-green-400 ml-2 print:hidden" title="WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
            </p>
            <p class="print:!text-black">
                <i class="fa-solid fa-globe text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <a :href="cvData.websiteUrl" target="_blank" 
                   :class="{'pointer-events-none': editMode && websiteUrlError}"
                   class="text-primary dark:text-dark-primary hover:underline print:!text-black">
                    <span v-if="!editMode">{{ cvData.websiteDisplay }}</span>
                    <template v-else>
                        <span class="relative inline-block mr-1">
                            <input type="text" v-model="cvData.websiteDisplay" placeholder="Texto a mostrar (ej: miweb.com)" class="edit-input inline-block w-auto pr-7">
                            <i v-if="cvData.websiteDisplay" @click="clearField('websiteDisplay')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                        </span>
                        <span class="relative inline-block">
                            <input type="url" v-model="cvData.websiteUrl" placeholder="https://www.ejemplo.com" class="edit-input inline-block w-auto pr-7">
                            <i v-if="cvData.websiteUrl" @click="clearField('websiteUrl')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                        </span>
                    </template>
                </a>
                <span v-if="editMode && websiteUrlError" class="text-red-500 text-xs ml-2 block">{{ websiteUrlError }}</span>
            </p>
            <p class="print:!text-black">
                <i class="fa-solid fa-map-location-dot text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <span v-if="!editMode">{{ cvData.address }}</span>
                <span v-else class="relative block">
                    <input type="text" v-model="cvData.address" class="edit-input pr-7">
                    <i v-if="cvData.address" @click="clearField('address')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2"></i>
                </span>
            </p>
            <p class="print:!text-black">
                <i class="fa-solid fa-cake-candles text-lightText dark:text-dark-lightText mr-2 print:!text-black"></i>
                <span v-if="!editMode">{{ cvData.birthdate }}</span>
                 <span v-else class="relative block">
                    <input type="text" v-model="cvData.birthdate" class="edit-input pr-7">
                    <i v-if="cvData.birthdate" @click="clearField('birthdate')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-2 top-1/2 -translate-y-1/2"></i>
                </span>
            </p>
        </div>
    </header>
    `
};