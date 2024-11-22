<template>
  <NuxtLayout>
    <div class="d-flex justify-space-between">
      <h1>Room Page</h1>
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
        <DataTableRoom
          :items="rooms.data"
          @refresh="refreshRooms"
          @delete="deleteRoom"
          @error="handleError"
          @success="handleSuccess"
        />
      </v-container>
    </div>
  </NuxtLayout>
</template>

<script setup>
const config = useRuntimeConfig();

const rooms = ref([]);
const token = useCookie("token");
const apiUrl = config.public.API_BASE_URL;
const error = ref(null);
const success = ref(null);

const fetchRooms = async () => {
  try {
    rooms.value = await $fetch(`${apiUrl}/room`, {
      headers: {
        Authorization: `${token.value}`,
      },
    });
  } catch (err) {
    handleError(err);
    console.error("Error fetching rooms:", err);
  }
};

onMounted(() => {
  fetchRooms();
});

const refreshRooms = async () => {
  await fetchRooms();
};

const handleError = (err) => {
  error.value = err?.message || "An unexpected error occurred!";
};

const handleSuccess = (succ) => {
  success.value = succ;
};

const deleteRoom = async (roomId) => {
  try {
    await $fetch(`${apiUrl}/room/delete/${roomId}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token.value}`,
      },
    }).then(() => {
      refreshRooms();
    });
  } catch (err) {
    handleError(err);
    console.error("Error deleting room:", err);
  }
};
</script>
