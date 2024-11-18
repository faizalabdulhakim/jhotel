<template>
  <v-layout class="rounded rounded-md w-100">
    <v-app-bar title="JHotel" color="grey-darken-4">
      <template v-slot:prepend>
        <img
          class="mx-4"
          src="public/jhotel.svg"
          max-height="32"
          max-width="32"
          alt="Logo"
          contain
        ></img>
      </template>

      <v-btn @click="logout">
        <v-icon>mdi-logout</v-icon>
        Logout
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer color="grey-darken-3">
      <NuxtLink to="/">
        <v-list-item link title="Dashboard"></v-list-item>
      </NuxtLink>
      <v-divider></v-divider>
      <NuxtLink to="/user">
        <v-list-item link title="User"></v-list-item>
      </NuxtLink>
      <v-divider></v-divider>
      <NuxtLink to="/room">
        <v-list-item link title="Room"></v-list-item>
      </NuxtLink>
      <v-divider></v-divider>
      <NuxtLink to="/reservation">
        <v-list-item link title="Reservation"></v-list-item>
      </NuxtLink>
      <v-divider></v-divider>
    </v-navigation-drawer>

    <v-main class="ma-6">
      <slot />
    </v-main>
  </v-layout>
</template>


<script setup>

function logout () {
   const authCookie = useCookie('token')
   authCookie.value = null
   navigateTo('/auth/login')
}

</script>