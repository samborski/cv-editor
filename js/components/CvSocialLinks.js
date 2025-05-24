// js/components/CvSocialLinks.js
const CvSocialLinks = {
    props: ['socialLinks', 'editMode'],
    emits: ['update:socialLinks'],
    computed: {
        // Para asegurar que todos los links existan en el objeto y evitar errores
        safeSocialLinks() {
            const defaults = { linkedin: '', github: '', twitter: '', facebook: '' };
            return { ...defaults, ...(this.socialLinks || {}) };
        }
    },
    methods: {
        updateLink(platform, value) {
            const newLinks = { ...this.safeSocialLinks, [platform]: value };
            this.$emit('update:socialLinks', newLinks);
        }
    },
    template: `
        <div class="flex-1 text-center">
            <h2 class="text-primary dark:text-dark-primary text-xl font-bold mb-4">¡Conectemos!</h2>
            
            <div v-if="!editMode" class="flex justify-center gap-4">
                <a v-if="safeSocialLinks.linkedin" :href="safeSocialLinks.linkedin" target="_blank" class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors" title="LinkedIn"><i class="fa-brands fa-linkedin text-2xl"></i></a>
                <a v-if="safeSocialLinks.github" :href="safeSocialLinks.github" target="_blank" class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors" title="GitHub"><i class="fa-brands fa-github text-2xl"></i></a>
                <a v-if="safeSocialLinks.twitter" :href="safeSocialLinks.twitter" target="_blank" class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors" title="X/Twitter"><i class="fa-brands fa-x-twitter text-2xl"></i></a>
                <a v-if="safeSocialLinks.facebook" :href="safeSocialLinks.facebook" target="_blank" class="p-2 text-primary dark:text-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary rounded-full transition-colors" title="Facebook"><i class="fa-brands fa-facebook text-2xl"></i></a>
            </div>

            <div v-else class="space-y-3 max-w-md mx-auto text-left">
                <div class="flex items-center gap-3">
                    <i class="fa-brands fa-linkedin w-6 text-center text-xl text-primary dark:text-dark-primary"></i>
                    <input type="url" :value="safeSocialLinks.linkedin" @input="updateLink('linkedin', $event.target.value)" placeholder="URL de LinkedIn" class="edit-input flex-grow">
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-brands fa-github w-6 text-center text-xl text-primary dark:text-dark-primary"></i>
                    <input type="url" :value="safeSocialLinks.github" @input="updateLink('github', $event.target.value)" placeholder="URL de GitHub" class="edit-input flex-grow">
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-brands fa-x-twitter w-6 text-center text-xl text-primary dark:text-dark-primary"></i>
                    <input type="url" :value="safeSocialLinks.twitter" @input="updateLink('twitter', $event.target.value)" placeholder="URL de X/Twitter" class="edit-input flex-grow">
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-brands fa-facebook w-6 text-center text-xl text-primary dark:text-dark-primary"></i>
                    <input type="url" :value="safeSocialLinks.facebook" @input="updateLink('facebook', $event.target.value)" placeholder="URL de Facebook" class="edit-input flex-grow">
                </div>
            </div>
            <div v-if="editMode" class="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                Modifique las URLs de sus redes sociales.
            </div>
        </div>
    `
};