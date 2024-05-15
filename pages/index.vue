<template>
  <div class="flex align-items-center justify-content-center h-full flex-wrap">
    <Card class="flex justify-content-center w-20rem">
      <template #title>
        <div class="text-center">
          <SelectButton
            v-model="state.authType"
            :allow-empty="false"
            :options="authTypes"
            :pt="{
              button: () => ({
                class: 'w-7rem p-button-sm'
              })
            }"
          />
        </div>
      </template>
      <template #content>
        <Password v-model="state.dummyPassword" class="hidden"/>

        <label class="block w-full">Email</label>
        <InputText v-model="state.email" />

        <label class="mt-2 block w-full">Password</label>
        <Password v-model="state.password" />
      </template>
      <template #footer>
        <Button
          :label="state.authType === 'login' ? 'Login' : 'Signup'"
          class="w-full"
          :disabled="!state.email || !state.password"
          @click="execLoginOrSignup"
        />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()

const state = reactive<{
  authType: 'login' | 'signup'
  email: string
  password: string
  dummyPassword: string
}>({
  authType: 'login',
  email: '',
  password: '',
  dummyPassword: ''
})

const authTypes = ['login', 'signup']

const user = useSupabaseUser()
const { auth } = useSupabaseClient()

const execLoginOrSignup = async () => {
  if (state.authType === 'login') {
    const { error } = await auth.signInWithPassword({
      email: state.email,
      password: state.password,
    })
    if (error) {
      toast.add({
        severity: 'error',
        summary: 'Login error',
        detail: error.message,
        life: 5000,
      })
    }
  } else {
    const { error } = await auth.signUp({
      email: state.email,
      password: state.password,
    })
    if (error) {
      toast.add({
        severity: 'error',
        summary: 'Signup error',
        detail: error.message,
        life: 5000,
      })
    }
  }
}

watchEffect(() => {
  if (user.value) {
    navigateTo('/tasks')
  }
})
</script>