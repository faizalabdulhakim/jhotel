<template>
  <NuxtLayout>
    <h1>User Page</h1>
    <div v-if="users.length === 0">No data users</div>
    <div v-else>
      <v-container fluid>
        <DataTable
          :items="users.data"
          @refresh="refreshUsers"
          @create="addUser"
          @update="updateUser"
          @delete="deleteUser"
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

// Fetch all users
const fetchUsers = async () => {
  try {
    users.value = await $fetch(`${apiUrl}/user`, {
      headers: {
        Authorization: `${token.value}`,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

onMounted(() => {
  fetchUsers();
});

// Refresh users
const refreshUsers = async () => {
  await fetchUsers();
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
    });
    await refreshUsers();
  } catch (error) {
    console.error("Error adding user:", error);
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
    });
    await refreshUsers();
  } catch (error) {
    console.error("Error updating user:", error);
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
    });
    await refreshUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
</script>
