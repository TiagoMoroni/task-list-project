<template>
    <div class="bg-white min-h-full" v-if="taskArray.length > 0">
        <div v-if="selectedTaskArray.length > 0" class="h-0 flex sticky top-[var(--header-height)]  justify-end pr-20">
            <div
                class="h-fit border-[1px] border-b-highlight rounded-b-md border-l-highlight bg-white border-r-highlight flex px-4 pt-4">
                <div class="cursor-pointer hover:text-green-400 text-highlight pb-2" @click="finishTasks">
                    <i class="fa-solid fa-check pointer-events-none"></i>
                    <label class="pl-1 pointer-events-none">Confirmar</label>
                </div>
                <div class="cursor-pointer hover:text-red-400 text-highlight pl-4" @click="openDeleteDialog()">
                    <i class="fa fa-trash pointer-events-none"></i>
                    <label class="pl-1 pointer-events-none">Excluir</label>
                </div>
                <div class="cursor-pointer hover:text-details text-highlight pl-6">
                    <i class="fa-solid fa-xmark cursor-pointer hover:text-details" @click="selectedTaskArray = []"></i>
                </div>
            </div>
        </div>
        <div class="flex justify-center">
            <div class="pt-14 w-center_container">
                <h1 class="text-highlight text-[2.5rem] font-semibold">Suas Tarefas ☕</h1>
                <div v-for="(taskDate, i) in allDateList" class="pb-4 pt-8">
                    <h1 class="text-highlight text-3xl font-semibold">{{ taskDate.name }}</h1>
                    <div class="pt-4 flex flex-col gap-4">
                        <div v-for="task in taskDate.tasks">
                            <div class="flex justify-between">
                                <div class="flex">
                                    <div :class="{ 'after:pointer-events-none after:absolute after:left-0 after:top-1/2 after:h-[1px] after:bg-black after:w-full after:block': task.completionDate }"
                                        class="pr-4 relative flex align-center">
                                        <input type="checkbox" :disabled="!!task.completionDate"
                                            :class="{ 'invisible': task.completionDate }"
                                            :checked="!!selectedTaskArray.find(t => t.id === task.id)"
                                            @click="handleSelectedTaskArray($event, task)">
                                        <span
                                            class="pl-2 text-lg text-highlight font-medium hover:text-details cursor-pointer"
                                            @click="openEditionPage(task)">
                                            {{ task.description }}
                                        </span>
                                        <span class="text-xs pl-2 leading-[2.6em]" v-if="task.dueDate && task.duration">
                                            {{ formatDurationHours(task) }}
                                        </span>
                                    </div>
                                    <div @click="openDeleteDialog(task)" class="text-details cursor-pointer">
                                        <i class="pl-8 fa fa-trash leading-[2em]"></i>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-section" v-if="!task.completionDate">{{
                                        formatTaskDuration(task.duration) }}</span>
                                    <span class="text-section" v-else>Finalizada: {{
                                        formatTaskCompletion(task.completionDate) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr class="mt-2" v-if="!(i == allDateList.length - 1)">
                </div>
            </div>
        </div>
    </div>
    <div v-else class="bg-white h-full align-center flex flex-col justify-center w-full">
        <i class="fa-regular fa-bell text-7xl text-details"></i>
        <span class="text-lg font-semibold text-highlight pt-4">Não há nenhuma tarefa em sua lista</span>
        <span class="text-sm font-normal text-highlight">Deseja criar uma?</span>
        <v-btn class="mt-5" @click="router.push('/tasks/add')">Criar Tarefa</v-btn>
    </div>
    <v-dialog v-model="isDeleteDialogOpen" max-width="500px">
        <v-card>
            <v-card-title>Confirmação</v-card-title>
            <v-card-text>
                Tem certeza que deseja apagar essa(s) tarefa(s)?
            </v-card-text>
            <v-card-actions>
                <v-btn @click="closeDeleteDialog">Cancelar</v-btn>
                <v-btn @click="handleClickExclusion" color="error">Excluir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-alert v-show="alertMessage" :value="alertMessage" :text="alertMessage" type="success" transition="slide-y-transition" style="position: absolute; top: 3.5rem;
      left: 50%;
      transform: translate(-50%, 0%);">
    </v-alert>
</template>

<script setup lang="ts">
import { Ref, computed, onBeforeMount, ref } from 'vue';
import { Task } from '../models/Task';
import store from '../store';
import router from '../router';

const alertMessage = ref('');

const openAlertMessage = ((message: string) => {
    alertMessage.value = message;
    setTimeout(() => {
        alertMessage.value = '';
    }, 3000);
});

// multi-selection logic

let selectedTaskArray: Ref<Task[]> = ref([]);

const handleSelectedTaskArray = ((event: Event, task: Task) => {
    if (event.target instanceof HTMLInputElement) {
        if (event.target.checked) {
            selectedTaskArray.value.push(task);
        } else {
            selectedTaskArray.value = selectedTaskArray.value.filter(t => t.id !== task.id);
        }
    }
});

////////////////////////////

// order by dueDate
let taskArray: Ref<Task[]> = computed(() => (store.state.tasks).sort((a: Task, b: Task) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));

//computed time-period tasks arrays logic

const today = new Date();
const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

const todayTasks = computed(() => tasksWithDueDate.value.filter(task => formatDate(task.dueDate) === formatDate(today)));
const tomorrowTasks = computed(() => tasksWithDueDate.value.filter(task => formatDate(task.dueDate) === formatDate(tomorrow)));
const thisWeekTasks = computed(() => {
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

    return tasksWithDueDate.value.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate > tomorrow && taskDate <= endOfWeek && !tomorrowTasks.value.includes(task);
    });
});
const futureTasks = computed(() => tasksWithDueDate.value.filter(task => !todayTasks.value.includes(task) && !tomorrowTasks.value.includes(task) && !thisWeekTasks.value.includes(task) && new Date(task.dueDate) > new Date()));
const yesterdayTasks = computed(() => tasksWithDueDate.value.filter(task => formatDate(task.dueDate) === formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))));
const pastTasks = computed(() => tasksWithDueDate.value.filter(task => !todayTasks.value.includes(task) && !tomorrowTasks.value.includes(task) && !thisWeekTasks.value.includes(task) && !yesterdayTasks.value.includes(task) && new Date(task.dueDate) < new Date()));
const tasksWithDueDate = computed(() => taskArray.value.filter(task => task.dueDate));
const tasksWithNoDueDate = computed(() => taskArray.value.filter(task => !task.dueDate));

const formatDate = ((date: Date) => {
    date = new Date(date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

////////////////////////////////////////////////////

// visual presentation logic

const allDateList = computed(() => [
    {
        name: 'Ontem',
        tasks: yesterdayTasks.value
    },
    {
        name: 'Hoje',
        tasks: todayTasks.value
    },
    {
        name: 'Amanhã',
        tasks: tomorrowTasks.value
    },
    {
        name: 'Esta Semana',
        tasks: thisWeekTasks.value
    },
    {
        name: 'Tarefas Futuras',
        tasks: futureTasks.value
    },
    {
        name: 'Tarefas Passadas',
        tasks: pastTasks.value
    },
    {
        name: 'Sem prazo',
        tasks: tasksWithNoDueDate.value
    }
].filter(date => date.tasks.length > 0));

const formatDurationHours = ((task: Task) => {
    const startHour = new Date(task.dueDate).getHours();
    const startMinute = new Date(task.dueDate).getMinutes();
    const finishDate = new Date(task.dueDate).setMinutes(startMinute + (task.duration ?? 0));
    const endHour = new Date(finishDate).getHours();
    const endMinute = new Date(finishDate).getMinutes();
    return `${startHour}:${startMinute < 10 ? '0' : ''}${startMinute} - ${endHour}:${endMinute < 10 ? '0' : ''}${endMinute}`;
});

const formatTaskDuration = ((duration?: number) => {
    if (duration) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return (hours > 0 ? `${hours}h` : '') + (hours > 0 && minutes > 0 ? ' ' : '') + (minutes > 0 ? `${minutes}m` : '');
    }
    return "-"
});

const formatTaskCompletion = ((date: Date) => {
    date = new Date(date)
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
    }).format(date);
});

/////////////////////////////////////////////////////////

// deletion and dialog confirm logic
const deleteTask = (() => {
    store.dispatch('deleteTask', selectedTaskToDelete.value?.id);
    openAlertMessage('Tarefa excluída com sucesso!');
    selectedTaskToDelete.value = null;
    isDeleteDialogOpen.value = false;
});

const deleteTaskArray = (() => {
    selectedTaskArray.value.forEach(task => {
        store.dispatch('deleteTask', task.id);
    })
    openAlertMessage('Tarefas excluídas com sucesso!');
    isDeleteDialogOpen.value = false;
    selectedTaskArray.value = [];
});

const handleClickExclusion = (() => {
    selectedTaskToDelete.value ? deleteTask() : deleteTaskArray()
})

let isDeleteDialogOpen = ref(false);
let selectedTaskToDelete: Ref<Task | null> = ref(null);

const openDeleteDialog = (task?: Task) => {
    if(task)selectedTaskToDelete.value = task;
    isDeleteDialogOpen.value = true;
};

const closeDeleteDialog = () => {
    selectedTaskToDelete.value = null;
    isDeleteDialogOpen.value = false;
};
//////////////////////////////////////

const finishTasks = (() => {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var day = String(currentDate.getDate()).padStart(2, '0');
    var hours = String(currentDate.getHours()).padStart(2, '0');
    var minutes = String(currentDate.getMinutes()).padStart(2, '0');
    var seconds = String(currentDate.getSeconds()).padStart(2, '0');
    var formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    selectedTaskArray.value.forEach(task => {
        store.dispatch('editTask', { ...task, completionDate: formattedDate });
    })
    openAlertMessage('Tarefas concluídas com sucesso!');
    selectedTaskArray.value = [];
});

const openEditionPage = ((task: Task) => {
    router.push({ name: 'Edit', params: { id: task.id } });

});

onBeforeMount(async () => {
    await store.dispatch('fetchTasks');
})
</script>
