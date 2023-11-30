<template>
    <div class="flex flex-col align-center h-full">
        <h1 class="text-3xl pt-10 text-highlight font-semibold">{{ form.id ? 'Editar' : 'Criar' }} Tarefa</h1>
        <v-form @submit.prevent="submitForm" class="w-1/3 pt-6" ref="formField">
            <v-text-field variant="underlined" v-model="form.id" label="Código" readonly v-if="form.id"
                disabled></v-text-field>

            <v-text-field variant="underlined" v-model="form.description" label="Descrição" :rules="rules"></v-text-field>

            <v-text-field variant="underlined" v-model="form.dueDate" label="Data de Entrega"
                type="datetime-local"></v-text-field>

            <v-text-field variant="underlined" v-model="form.duration" label="Duração(min)" type="number"></v-text-field>

            <v-text-field variant="underlined" v-model="form.creationDate" label="Data de Criação" readonly v-if="form.id"
                disabled type="datetime-local"></v-text-field>

            <v-text-field variant="underlined" v-model="form.completionDate" label="Data de Conclusão" readonly
                v-if="form.id && form.completionDate" disabled type="datetime-local"></v-text-field>
            <div class="flex gap-5 align-center justify-center w-full">
                <v-btn type="submit">{{ form.id ? 'Editar' : 'Criar' }}</v-btn>
                <v-btn variant="text" @click="undoFinish" v-if="form.id && form.completionDate">Desfazer Conclusão</v-btn>
            </div>
        </v-form>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import store from '../store';
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import router from '../router';
import { VForm } from 'vuetify/components';

const form = ref({
    id: 0 as number,
    description: null,
    creationDate: null,
    completionDate: null,
    dueDate: null,
    duration: null,
});

const formField = ref<VForm>()

const submitForm = async () => {
    if(formField.value?.isValid){
        try {
            if (!form.value.id) {
                var currentDate = new Date();
    
                var year = currentDate.getFullYear();
                var month = String(currentDate.getMonth() + 1).padStart(2, '0');
                var day = String(currentDate.getDate()).padStart(2, '0');
                var hours = String(currentDate.getHours()).padStart(2, '0');
                var minutes = String(currentDate.getMinutes()).padStart(2, '0');
                var seconds = String(currentDate.getSeconds()).padStart(2, '0');
                var formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                store.dispatch('addTask', { ...form.value, creationDate: formattedDate });
            } else {
                store.dispatch('editTask', form.value);
            }
            router.push("/");
        } catch (error) {
            console.log(error)
        }
    }
};

const rules =  [
    (value: string) => {
        if (value) return value.length <= 4 ? "Descrição precisa ter mais que 4 dígitos" : true 

        return 'Descrição é obrigatório.'
    },
]

const undoFinish = async () => {
    await store.dispatch('editTask', { ...form.value, completionDate: null });
    setFormValue();
};

const setFormValue = async () => {
    await store.dispatch('getTask', form.value.id);
    form.value = store.state.selectedTask;
};

onBeforeMount(async () => {
    const route = useRoute();
    if (route.params.id) {
        await store.dispatch('getTask', route.params.id);
        form.value = store.state.selectedTask;
    }
});

</script>