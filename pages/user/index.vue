<template>
  <NuxtLayout>
    <h1>User Page</h1>
    <div>
      <v-container fluid>
        <DataTableUser
          :items="users.data"
          @refresh="refreshUsers"
          @create="addUser"
          @update="updateUser"
          @delete="deleteUser"
          @error="handleError"
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

// Add a new user
const addUser = async (newUser) => {
  try {
    await $fetch(`${apiUrl}/user/create`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token.value}`,
      },
    }).then(() => {
      refreshUsers();
    });
  } catch (err) {
    handleError(err);
    console.error("Error adding user:", err);
    throw err;
  }
};

// Update an existing user
const updateUser = async (updatedUser) => {
  try {
    await $fetch(`${apiUrl}/user/update/${updatedUser.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedUser),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token.value}`,
      },
    }).then(() => {
      refreshUsers();
    });
  } catch (err) {
    handleError(err);
    console.error("Error updating user:", err);
  }
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
