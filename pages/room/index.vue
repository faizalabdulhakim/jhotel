<template>
  <NuxtLayout>
    <h1>Room Page</h1>
    <div v-if="rooms.length === 0">No data rooms</div>
    <div v-else>
      <v-container fluid>
        <DataTableRoom
          :items="rooms.data"
          @refresh="refreshRooms"
          @create="addRoom"
          @update="updateRoom"
          @delete="deleteRoom"
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

// Fetch all rooms
const fetchRooms = async () => {
  try {
    rooms.value = await $fetch(`${apiUrl}/room`, {
      headers: {
        Authorization: `${token.value}`,
      },
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
  }
};

onMounted(() => {
  fetchRooms();
});

// Refresh rooms
const refreshRooms = async () => {
  await fetchRooms();
};

// Add a new room
const addRoom = async (newRoom) => {
  try {
    await $fetch(`${apiUrl}/room/create`, {
      method: "POST",
      body: JSON.stringify(newRoom),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token.value}`,
      },
    });
    await refreshRooms();
  } catch (error) {
    console.error("Error adding room:", error);
  }
};

// Update an existing room
const updateRoom = async (updatedRoom) => {
  try {
    await $fetch(`${apiUrl}/room/update/${updatedRoom.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedRoom),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token.value}`,
      },
    });
    await refreshRooms();
  } catch (error) {
    console.error("Error updating room:", error);
  }
};

// Delete a room
const deleteRoom = async (roomId) => {
  try {
    await $fetch(`${apiUrl}/room/delete/${roomId}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token.value}`,
      },
    });
    await refreshRooms();
  } catch (error) {
    console.error("Error deleting room:", error);
  }
};
</script>
