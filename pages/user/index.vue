<template>
  <NuxtLayout>
    <div class="d-flex justify-space-between">
      <h1>User Page</h1>
      <v-alert
        v-if="success"
        closable
        type="success"
        :text="success"
        density="compact"
        max-width="400px"
        @click:close="success = ''"
      />
    </div>
    <div>
      <v-container fluid>
        <DataTableUser
          :items="users.data"
          @refresh="refreshUsers"
          @delete="deleteUser"
          @error="handleError"
          @success="handleSuccess"
        />
      </v-container>
    </div>
  </NuxtLayout>
</template>

<script setup>
const config = useRuntimeConfig();

const users = ref([]);
const token = useCookie("token");
const apiUrl = config.public.API_BASE_URL;
const error = ref(null);
const success = ref(null);

// Fetch all users
const fetchUsers = async () => {
  try {
    users.value = await $fetch(`${apiUrl}/user`, {
      headers: {
        Authorization: `${token.value}`,
      },
    });
  } catch (err) {
    handleError(err);
    console.error("Error fetching users:", err);
  }
};

onMounted(() => {
  fetchUsers();
});

// Refresh users
const refreshUsers = async () => {
  await fetchUsers();
};

const handleError = (err) => {
  error.value = err?.message || "An unexpected error occurred!";
};

const handleSuccess = (succ) => {
  success.value = succ;
};

// Delete a user
const deleteUser = async (userId) => {
  try {
    await $fetch(`${apiUrl}/user/delete/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token.value}`,
      },
    }).then(() => {
      refreshUsers();
    });
  } catch (err) {
    handleError(err);
    console.error("Error deleting user:", err);
  }
};
</script>
