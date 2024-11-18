<template>
  <NuxtLayout>
    <h1 class="mb-2">Welcome to the JHotel dashboard!</h1>
    <div class="d-flex justify-space-between ga-3">
      <Card
        name="Total Guest"
        :aggregate="users.data?.length"
        icon="mdi-account"
      />
      <Card
        name="Total Room"
        :aggregate="rooms.data?.length"
        icon="mdi-bed-queen"
      />
      <Card name="Total Reservation" aggregate="100+" icon="mdi-note-outline" />
      <Card name="Total Revenue" aggregate="$10.000" icon="mdi-currency-usd" />
    </div>
  </NuxtLayout>
</template>

<script setup>
const config = useRuntimeConfig();

const users = ref([]);
const rooms = ref([]);
const apiUrl = config.public.API_BASE_URL;

// Fetch all users
const fetchUsers = async () => {
  const token = useCookie("token");
  try {
    users.value = await $fetch(`${apiUrl}/user`, {
      method: "GET",
      headers: {
        Authorization: `${token.value}`,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const fetchRooms = async () => {
  const token = useCookie("token");
  try {
    rooms.value = await $fetch(`${apiUrl}/room`, {
      method: "GET",
      headers: {
        Authorization: `${token.value}`,
      },
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
};

onMounted(() => {
  fetchUsers();
  fetchRooms();
});
</script>
