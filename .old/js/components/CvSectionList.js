// js/components/CvSectionList.js
const CvSectionList = {
    props: ['title', 'items', 'editMode', 'itemStructureType'], // itemStructureType: 'simple', 'education', 'experience'
    emits: ['update:items'],
    methods: {
        addItem() {
            const newItems = [...this.items];
            let newItem;
            if (this.itemStructureType === 'education') {
                newItem = { id: Utils.generateId(), title: 'Nuevo Título', institution: 'Nueva Institución', details: '' };
            } else if (this.itemStructureType === 'experience') {
                newItem = { id: Utils.generateId(), title: 'Nueva Empresa/Proyecto', role: 'Nuevo Rol', description: '' };
            } else { // simple
                newItem = { id: Utils.generateId(), text: 'Nuevo ítem (click para editar)' };
            }
            newItems.push(newItem);
            this.$emit('update:items', newItems);
        },
        removeItem(index) {
            const newItems = [...this.items];
            newItems.splice(index, 1);
            this.$emit('update:items', newItems);
        },
        updateItem(index, field, value) { // Para objetos
            const newItems = [...this.items];
            newItems[index] = { ...newItems[index], [field]: value };
            this.$emit('update:items', newItems);
        },
        updateSimpleItem(index, value) { // Para array de strings (o objetos con solo 'text')
             const newItems = [...this.items];
             newItems[index] = { ...newItems[index], text: value }; // Asumimos que es un objeto con 'text'
             this.$emit('update:items', newItems);
        }
    },
    template: `
        <div>
            <h2 class="text-primary dark:text-dark-primary text-xl font-bold my-4">{{ title }}</h2>
            <ul class="space-y-2 mb-6">
                <li v-for="(item, index) in items" :key="item.id || index"
                    class="hover:bg-secondary dark:hover:bg-dark-secondary hover:pl-2 transition-all duration-300 p-1 rounded">
                    
                    <!-- Vista Modo Simple (ej. Habilidades) -->
                    <template v-if="itemStructureType === 'simple'">
                        <span v-if="!editMode" v-html="item.text"></span>
                        <template v-else>
                            <textarea :value="item.text" @input="updateSimpleItem(index, $event.target.value)" class="edit-textarea" rows="2"></textarea>
                            <i class="fa-solid fa-trash delete-item-btn" @click="removeItem(index)"></i>
                        </template>
                    </template>

                    <!-- Vista Modo Educación -->
                    <template v-if="itemStructureType === 'education'">
                        <div v-if="!editMode">
                            <b>{{ item.title }}</b> ({{ item.institution }})
                            <p v-if="item.details" class="text-sm text-lightText dark:text-dark-lightText pl-2" v-html="item.details.replace(/\\n/g, '<br />')"></p>
                        </div>
                        <div v-else class="space-y-1">
                            <input type="text" :value="item.title" @input="updateItem(index, 'title', $event.target.value)" placeholder="Título" class="edit-input">
                            <input type="text" :value="item.institution" @input="updateItem(index, 'institution', $event.target.value)" placeholder="Institución" class="edit-input">
                            <textarea :value="item.details" @input="updateItem(index, 'details', $event.target.value)" placeholder="Detalles (opcional)" class="edit-textarea" rows="2"></textarea>
                            <i class="fa-solid fa-trash delete-item-btn" @click="removeItem(index)"></i>
                        </div>
                    </template>

                    <!-- Vista Modo Experiencia -->
                    <template v-if="itemStructureType === 'experience'">
                         <div v-if="!editMode">
                            <b>{{ item.title }}</b> - {{ item.role }}
                            <p v-if="item.description" class="text-sm text-lightText dark:text-dark-lightText pl-2" v-html="item.description.replace(/\\n/g, '<br />')"></p>
                        </div>
                        <div v-else class="space-y-1">
                            <input type="text" :value="item.title" @input="updateItem(index, 'title', $event.target.value)" placeholder="Empresa/Proyecto" class="edit-input">
                            <input type="text" :value="item.role" @input="updateItem(index, 'role', $event.target.value)" placeholder="Rol/Cargo" class="edit-input">
                            <textarea :value="item.description" @input="updateItem(index, 'description', $event.target.value)" placeholder="Descripción de tareas" class="edit-textarea" rows="3"></textarea>
                            <i class="fa-solid fa-trash delete-item-btn" @click="removeItem(index)"></i>
                        </div>
                    </template>
                </li>
                <li v-if="editMode">
                    <button @click="addItem" class="add-item-btn">
                        <i class="fa-solid fa-plus mr-1"></i> Añadir {{ title.slice(0,-1) }}
                    </button>
                </li>
            </ul>
        </div>
    `
};