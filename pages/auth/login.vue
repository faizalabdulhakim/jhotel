<template>
  <v-container fluid class="fill-height">
    <v-row no-gutters align="center" justify="center" class="fill-height">
      <v-col cols="12" md="6" lg="5" sm="6">
        <v-row no-gutters align="center" justify="center">
          <v-col cols="12" md="6">
            <h1>Login</h1>
            <p class="text-medium-emphasis">
              Enter your details to get started
            </p>

            <v-alert
              v-if="error"
              closable
              :text="error"
              type="error"
              class="mt-4"
              @click:close="error = null"
            />

            <v-form @submit.prevent="submit" class="mt-7">
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="email"
                  >Email</label
                >
                <v-text-field
                  :rules="[ruleRequired, ruleEmail]"
                  v-model="email"
                  prepend-icon="mdi-email"
                  id="email"
                  name="email"
                  type="email"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="password"
                  >Password</label
                >
                <v-text-field
                  :rules="[ruleRequired, rulePassLen]"
                  v-model="password"
                  prepend-icon="mdi-lock"
                  id="password"
                  name="password"
                  type="password"
                />
              </div>
              <div class="mt-5">
                <VBtn
                  type="submit"
                  block
                  min-height="44"
                  class="gradient primary"
                  >Login</VBtn
                >
              </div>
            </v-form>
            <p class="text-body-2 mt-4">
              <span
                >Don't have an account?
                <NuxtLink
                  to="/auth/register"
                  class="font-weight-bold text-primary"
                  >Register</NuxtLink
                ></span
              >
            </p>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="hidden-md-and-down fill-height" md="6" lg="7">
        <v-img
          src="https://wallpaper.dog/large/20650619.jpg"
          cover
          class="h-100 rounded-xl d-flex align-center justify-center"
        >
          <div class="text-center w-50 text-white mx-auto">
            <h2 class="mb-4">JHotel - Admin Panel</h2>
            <p>Reserves hotel on your fingertip.</p>
          </div>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const email = ref("");
const password = ref("");
const error = ref("");

const { ruleEmail, rulePassLen, ruleRequired } = useFormRules();

const config = useRuntimeConfig();

const apiUrl = config.public.API_BASE_URL;

const submit = async () => {
  if (!email.value || !password.value) {
    error.value = "Email and password are required!";
    return;
  }

  try {
    const response = await $fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      body: { email: email.value, password: password.value },
      headers: { "Content-Type": "application/json" },
      onResponseError({ response }) {
        throw response._data;
      },
    });

    const token = useCookie("token");
    token.value = response.token;
    error.value = null;
    navigateTo("/");
  } catch (err) {
    error.value = err?.message || "An unexpected error occurred!";
  }
};
</script>
