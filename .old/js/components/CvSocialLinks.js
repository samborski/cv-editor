// js/components/CvSocialLinks.js
const CvSocialLinks = {
    props: ['socialLinks', 'editMode'],
    emits: ['update:socialLinks'],
    data() {
        return {
            // URLs base para cada red social
            baseUrls: {
                linkedin: 'https://www.linkedin.com/in/',
                github: 'https://github.com/',
                twitter: 'https://x.com/', // o twitter.com si prefieres
                facebook: 'https://www.facebook.com/'
            },
            // Placeholders para los inputs
            placeholders: {
                linkedin: 'tu-perfil-linkedin',
                github: 'tu-usuario-github',
                twitter: 'tu-usuario-x (sin @)',
                facebook: 'tu.nombredeusuario.facebook'
            }
        }
    },
    computed: {
        // Para asegurar que todos los usernames existan en el objeto y evitar errores
        safeSocialUsernames() {
            const defaults = { linkedin: '', github: '', twitter: '', facebook: '' };
            // Se asegura que solo se usen strings simples (usernames)
            const currentLinks = {};
            for (const platform in defaults) {
                currentLinks[platform] = (this.socialLinks && typeof this.socialLinks[platform] === 'string' && !this.socialLinks[platform].includes('/')) 
                                        ? this.socialLinks[platform] 
                                        : ''; // Si es una URL completa o no existe, se limpia
            }
            return { ...defaults, ...currentLinks };
        },
        // Genera las URLs completas para los enlaces <a>
        fullSocialUrls() {
            const urls = {};
            for (const platform in this.safeSocialUsernames) {
                if (this.safeSocialUsernames[platform]) {
                    urls[platform] = this.baseUrls[platform] + this.safeSocialUsernames[platform];
                } else {
                    urls[platform] = ''; // Si no hay username, no hay URL
                }
            }
            return urls;
        }
    },
    methods: {
        updateUsername(platform, username) {
            const newLinks = { ...this.safeSocialUsernames, [platform]: username.trim() };
            this.$emit('update:socialLinks', newLinks);
        }
    },
    template: `
        <div class="flex-1 text-center">
            <h2 class="text-primary dark:text-dark-primary text-xl font-bold mb-4">¡Conectemos!</h2>
            
            <div v-if="!editMode" class="flex justify-center gap-4">
                <a v-if="fullSocialUrls.linkedin" :href="fullSocialUrls.linkedin" target="_blank" class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors" title="LinkedIn"><i class="fa-brands fa-linkedin text-2xl"></i></a>
                <a v-if="fullSocialUrls.github" :href="fullSocialUrls.github" target="_blank" class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors" title="GitHub"><i class="fa-brands fa-github text-2xl"></i></a>
                <a v-if="fullSocialUrls.twitter" :href="fullSocialUrls.twitter" target="_blank" class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors" title="X/Twitter"><i class="fa-brands fa-x-twitter text-2xl"></i></a>
                <a v-if="fullSocialUrls.facebook" :href="fullSocialUrls.facebook" target="_blank" class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors" title="Facebook"><i class="fa-brands fa-facebook text-2xl"></i></a>
            </div>

            <div v-else class="space-y-3 max-w-md mx-auto text-left">
                <div class="flex items-center gap-3">
                    <i class="fa-brands fa-linkedin w-8 text-center text-xl text-primary dark:text-dark-primary"></i>
                    <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ baseUrls.linkedin }}</span>
                    <input type="text" :value="safeSocialUsernames.linkedin" @input="updateUsername('linkedin', $event.target.value)" :placeholder="placeholders.linkedin" class="edit-input flex-grow">
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-brands fa-github w-8 text-center text-xl text-primary dark:text-dark-primary"></i>
                     <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ baseUrls.github }}</span>
                    <input type="text" :value="safeSocialUsernames.github" @input="updateUsername('github', $event.target.value)" :placeholder="placeholders.github" class="edit-input flex-grow">
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-brands fa-x-twitter w-8 text-center text-xl text-primary dark:text-dark-primary"></i>
                     <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ baseUrls.twitter }}</span>
                    <input type="text" :value="safeSocialUsernames.twitter" @input="updateUsername('twitter', $event.target.value)" :placeholder="placeholders.twitter" class="edit-input flex-grow">
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-brands fa-facebook w-8 text-center text-xl text-primary dark:text-dark-primary"></i>
                     <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ baseUrls.facebook }}</span>
                    <input type="text" :value="safeSocialUsernames.facebook" @input="updateUsername('facebook', $event.target.value)" :placeholder="placeholders.facebook" class="edit-input flex-grow">
                </div>
            </div>
            <div v-if="editMode" class="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                Ingresa solo tu nombre de usuario o identificador para cada red.
            </div>
        </div>
    `
};