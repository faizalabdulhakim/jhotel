<template>
  <NuxtLayout>
    <h1>Reservation Page</h1>
    <div v-if="reservations.length === 0">No data reservation</div>
    <div v-else>
      <v-container fluid>
        <DataTableReservation
          :items="reservations.data"
          @refresh="refreshReservations"
          @create="addReservation"
          @update="updateReservation"
          @delete="deleteReservation"
        />
      </v-container>
    </div>
  </NuxtLayout>
</template>

<script setup>
const config = useRuntimeConfig();

const reservations = ref([]);
const token = useCookie("token");
const apiUrl = config.public.API_BASE_URL;

// Fetch all reservations
const fetchReservations = async () => {
  try {
    reservations.value = await $fetch(`${apiUrl}/reservation`, {
      headers: {
        Authorization: `${token.value}`,
      },
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
};

onMounted(() => {
  fetchReservations();
});

// Refresh reservations
const refreshReservations = async () => {
  await fetchReservations();
};

// Add a new reservation
const addReservation = async (newReservation) => {
  try {
    await $fetch(`${apiUrl}/reservation/create`, {
      method: "POST",
      body: JSON.stringify(newReservation),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token.value}`,
      },
    });
    await refreshReservations();
  } catch (error) {
    console.error("Error adding reservation:", error);
  }
};

// Update an existing reservation
const updateReservation = async (updatedReservation) => {
  try {
    await $fetch(`${apiUrl}/reservation/update/${updatedReservation.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedReservation),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token.value}`,
      },
    });
    await refreshReservations();
  } catch (error) {
    console.error("Error updating reservation:", error);
  }
};

// Delete a reservation
const deleteReservation = async (reservationId) => {
  try {
    await $fetch(`${apiUrl}/reservation/delete/${reservationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token.value}`,
      },
    });
    await refreshReservations();
  } catch (error) {
    console.error("Error deleting reservation:", error);
  }
};
</script>
