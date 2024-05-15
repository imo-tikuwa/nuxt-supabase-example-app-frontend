
<template>
  <div class="flex align-items-center justify-content-center w-full py-4 flex-wrap">
    <Card class="flex justify-content-center w-30rem">
      <template #title>
        <div class="text-3xl">
          Todo List.
        </div>
      </template>
      <template #content>
        <div class="grid">
          <div class="col-12">
            <div class="grid align-items-center">
              <div class="col">
                <InputText v-model="state.newTask" class="w-full" />
              </div>
              <div class="col-fixed">
                <Button icon="pi pi-plus" label="Add" size="small" @click="addTask" />
              </div>
            </div>
          </div>
          <div class="col-12">
            <template v-if="tasks">
              <DataView :value="tasks" data-key="id">
                <template #list="slotProps">
                  <div class="grid grid-nogutter">
                    <div v-for="(task, index) in slotProps.items" :key="index" class="col-12">
                      <div class="grid">
                        <div class="col">
                          {{ task.title }}
                        </div>
                        <div class="col-fixed">
                          <div class="flex align-items-center justify-content-between flex-wrap">
                            <div class="flex mr-2">
                              <InputSwitch v-model="task.completed" @change="completeTask(task as Task)" />
                            </div>
                            <div class="flex">
                              <Button icon="pi pi-trash" severity="danger" size="small" @click="removeTask(task as Task)" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template #empty>
                  <div>
                    No tasks registered
                  </div>
                </template>
              </DataView>
            </template>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~~/types/database.types'

interface Task {
  id: number
  title: string
  completed: boolean
  user?: string
  created_at?: string
}

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const state = reactive({
  newTask: '',
  loading: false
})

const { data: tasks } = await useAsyncData('tasks', async () => {
  const { data } = await client.from('tasks').select('id, title, completed').eq('user', user.value!.id).order('created_at')

  return data
})

async function addTask() {
  if (state.newTask.trim().length === 0) return

  state.loading = true

  const { data } = await client.from('tasks')
    .upsert({
      user: user.value!.id,
      title: state.newTask,
      completed: false,
    })
    .select('id, title, completed')
    .single()

  tasks.value?.push(data!)
  state.newTask = ''
  state.loading = false
}

const completeTask = async (task: Task) => {
  await client.from('tasks').update({
    completed: task.completed,
  }).match({
    id: task.id,
  })
}

const removeTask = async (task: Task) => {
  tasks.value = tasks.value?.filter(t => t.id !== task.id) ?? []
  await client.from('tasks').delete().match({
    id: task.id,
  })
}
</script>
