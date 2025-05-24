// js/components/CvSocialLinks.js
const CvSocialLinks = {
  props: ['socialLinks', 'editMode'],
  emits: ['update:socialLinks'],
  data() {
    return {
      baseUrls: {
        /* ... */
      },
      placeholders: {
        /* ... */
      },
      usernameErrors: { linkedin: '', github: '', twitter: '', facebook: '' }, // Para errores por plataforma
    };
  },
  computed: {
    safeSocialUsernames() {
      const defaults = { linkedin: '', github: '', twitter: '', facebook: '' };
      const currentLinks = {};
      for (const platform in defaults) {
        currentLinks[platform] =
          this.socialLinks &&
          typeof this.socialLinks[platform] === 'string' &&
          !this.socialLinks[platform].includes('/')
            ? this.socialLinks[platform]
            : '';
      }
      return { ...defaults, ...currentLinks };
    },
    fullSocialUrls() {
      const urls = {};
      for (const platform in this.safeSocialUsernames) {
        if (this.safeSocialUsernames[platform]) {
          urls[platform] =
            this.baseUrls[platform] + this.safeSocialUsernames[platform];
        } else {
          urls[platform] = '';
        }
      }
      return urls;
    },
  },
  methods: {
    updateUsername(platform, username) {
      const trimmedUsername = username.trim();
      // Validación simple de username: no vacío, sin espacios, caracteres básicos.
      // Puedes hacer esto más específico por plataforma si es necesario.
      const isValidUsername = /^[a-zA-Z0-9_.-]*$/.test(trimmedUsername);

      if (trimmedUsername && !isValidUsername) {
        this.usernameErrors[platform] = 'Caracteres inválidos.';
      } else if (trimmedUsername && trimmedUsername.includes(' ')) {
        this.usernameErrors[platform] = 'No debe contener espacios.';
      } else {
        this.usernameErrors[platform] = '';
      }

      const newLinks = {
        ...this.safeSocialUsernames,
        [platform]: trimmedUsername,
      };
      this.$emit('update:socialLinks', newLinks);
    },
    clearUsername(platform) {
      // Para el botón de limpiar (si lo añades aquí)
      this.usernameErrors[platform] = '';
      this.updateUsername(platform, '');
    },
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
                <!-- LinkedIn -->
                <div class="flex items-start gap-3">
                    <i class="fa-brands fa-linkedin w-8 text-center text-xl text-primary dark:text-dark-primary pt-1"></i>
                    <div class="flex-grow">
                        <div class="flex items-center">
                            <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap mr-1">{{ baseUrls.linkedin }}</span>
                            <div class="relative flex-grow">
                                <input type="text" :value="safeSocialUsernames.linkedin" @input="updateUsername('linkedin', $event.target.value)" :placeholder="placeholders.linkedin" class="edit-input w-full pr-7">
                                <i v-if="safeSocialUsernames.linkedin" @click="clearUsername('linkedin')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                            </div>
                        </div>
                        <span v-if="usernameErrors.linkedin" class="text-red-500 text-xs mt-1 block">{{ usernameErrors.linkedin }}</span>
                    </div>
                </div>
                <!-- GitHub -->
                <div class="flex items-start gap-3">
                    <i class="fa-brands fa-github w-8 text-center text-xl text-primary dark:text-dark-primary pt-1"></i>
                    <div class="flex-grow">
                        <div class="flex items-center">
                             <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap mr-1">{{ baseUrls.github }}</span>
                            <div class="relative flex-grow">
                                <input type="text" :value="safeSocialUsernames.github" @input="updateUsername('github', $event.target.value)" :placeholder="placeholders.github" class="edit-input w-full pr-7">
                                <i v-if="safeSocialUsernames.github" @click="clearUsername('github')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                            </div>
                        </div>
                        <span v-if="usernameErrors.github" class="text-red-500 text-xs mt-1 block">{{ usernameErrors.github }}</span>
                    </div>
                </div>
                <!-- Twitter/X -->
                <div class="flex items-start gap-3">
                    <i class="fa-brands fa-x-twitter w-8 text-center text-xl text-primary dark:text-dark-primary pt-1"></i>
                     <div class="flex-grow">
                        <div class="flex items-center">
                            <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap mr-1">{{ baseUrls.twitter }}</span>
                            <div class="relative flex-grow">
                                <input type="text" :value="safeSocialUsernames.twitter" @input="updateUsername('twitter', $event.target.value)" :placeholder="placeholders.twitter" class="edit-input w-full pr-7">
                                <i v-if="safeSocialUsernames.twitter" @click="clearUsername('twitter')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                            </div>
                        </div>
                        <span v-if="usernameErrors.twitter" class="text-red-500 text-xs mt-1 block">{{ usernameErrors.twitter }}</span>
                    </div>
                </div>
                <!-- Facebook -->
                <div class="flex items-start gap-3">
                    <i class="fa-brands fa-facebook w-8 text-center text-xl text-primary dark:text-dark-primary pt-1"></i>
                    <div class="flex-grow">
                        <div class="flex items-center">
                             <span class="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap mr-1">{{ baseUrls.facebook }}</span>
                            <div class="relative flex-grow">
                                <input type="text" :value="safeSocialUsernames.facebook" @input="updateUsername('facebook', $event.target.value)" :placeholder="placeholders.facebook" class="edit-input w-full pr-7">
                                <i v-if="safeSocialUsernames.facebook" @click="clearUsername('facebook')" class="fa-solid fa-times-circle cursor-pointer text-gray-400 hover:text-red-500 absolute right-1.5 top-1/2 -translate-y-1/2 text-sm"></i>
                            </div>
                        </div>
                        <span v-if="usernameErrors.facebook" class="text-red-500 text-xs mt-1 block">{{ usernameErrors.facebook }}</span>
                    </div>
                </div>
            </div>
            <div v-if="editMode" class="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                Ingresa solo tu nombre de usuario o identificador para cada red.
            </div>
        </div>
    `,
};
