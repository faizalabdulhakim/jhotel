<template>
  <v-data-table-server
    :headers="headers"
    :items="serverItems"
    density="compact"
    v-model:items-per-page="itemsPerPage"
    :items-length="totalItems"
    :loading="loading"
    item-value="name"
    loading-text="Loading... Retrieving data"
    @update:options="loadItems"
    v-on:update:items-per-page="loadItems"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Users</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          placeholder="Search by keywords..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="mt-6"
          style="max-width: 250px"
          @input="refreshSearch"
          clearable
        ></v-text-field>

        <v-dialog v-model="dialog" max-width="500px" persistent>
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              v-bind="props"
              variant="tonal"
              class="mx-2"
              prepend-icon="mdi-account-plus"
            >
              Add User
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-alert
                  v-if="alertMessage"
                  type="error"
                  closable
                  density="compact"
                  class="mb-4"
                  @click:close="alertMessage = ''"
                  v-html="formattedAlertMessage"
                />

                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      required
                      prepend-inner-icon="mdi-account"
                      label="Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.email"
                      type="email"
                      required
                      prepend-inner-icon="mdi-email"
                      label="Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="editedItem.role"
                      required
                      prepend-inner-icon="mdi-account-group"
                      :items="['admin', 'guest']"
                      label="Role"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" v-if="editedIndex === -1">
                    <v-text-field
                      v-model="editedItem.password"
                      required
                      type="password"
                      prepend-inner-icon="mdi-lock"
                      label="Password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="editedIndex === -1">
                    <v-text-field
                      v-model="editedItem.password_confirmation"
                      required
                      type="password"
                      prepend-inner-icon="mdi-lock"
                      label="Password Confirmation"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="close"> Cancel </v-btn>
              <v-btn
                variant="flat"
                color="blue-darken-1"
                @click="save"
                :disabled="this.loading"
                :loading="this.loading"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)"
        >mdi-pencil</v-icon
      >
      <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="loadItems">Load Data</v-btn>
    </template>
  </v-data-table-server>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    itemsPerPage: 10,
    dialog: false,
    dialogDelete: false,
    search: "",
    alertMessage: "",
    headers: [
      { title: "Name", align: "start", key: "name" },
      { title: "Email", key: "email" },
      { title: "Role", key: "role" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    serverItems: [],
    loading: true,
    totalItems: 0,
    editedIndex: -1,
    editedItem: {
      name: "",
      email: "",
      role: "",
      password: "",
      password_confirmation: "",
    },
    defaultItem: {
      name: "",
      email: "",
      role: "",
      password: "",
      password_confirmation: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New User" : "Edit User";
    },
    formattedAlertMessage() {
      return this.alertMessage.replace(/\n/g, "<br>");
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    async loadItems({ page, itemsPerPage }) {
      const config = useRuntimeConfig();
      const token = useCookie("token");
      const apiUrl = config.public.API_BASE_URL;

      this.loading = true;

      const offset = (page - 1) * itemsPerPage;
      try {
        const response = await $fetch(`${apiUrl}/user`, {
          headers: {
            Authorization: `${token.value}`,
          },
          params: {
            offset,
            limit: itemsPerPage,
            keyword: this.search,
          },
        });

        if (response.data.length === 0 && page > 1) {
          return this.loadItems({ page: page - 1, itemsPerPage });
        }

        this.serverItems = response.data;
        this.totalItems = response.totalRecordCount;
      } catch (error) {
        this.$emit("error", error);
        console.error("Error fetching items:", error);
      } finally {
        this.loading = false;
      }
    },

    refreshSearch() {
      this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
    },

    editItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.serverItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        await this.$emit("delete", this.editedItem.id);
        this.closeDelete();
        this.serverItems = [];
        this.totalItems = 0;
        this.loading = true;
        this.itemsPerPage = 10;
        this.$emit("success", "Success Delete User");
        await this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
      } catch (error) {
        console.error("Delete error:", error);
      }
    },

    close() {
      this.dialog = false;
      this.alertMessage = "";
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      const config = useRuntimeConfig();
      const token = useCookie("token");
      const apiUrl = config.public.API_BASE_URL;

      try {
        if (this.editedIndex > -1) {
          await $fetch(`${apiUrl}/user/update/${this.editedItem.id}`, {
            method: "PATCH",
            body: JSON.stringify(this.editedItem),
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token.value}`,
            },
            onResponseError({ response }) {
              throw response._data;
            },
          });
          this.$emit("success", "Success Edit User");
        } else {
          await $fetch(`${apiUrl}/user/create`, {
            method: "POST",
            body: JSON.stringify(this.editedItem),
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token.value}`,
            },
            onResponseError({ response }) {
              throw response._data;
            },
          });
          this.$emit("success", "Success Create User");
        }

        this.alertMessage = "";
        this.close();
        this.serverItems = [];
        this.totalItems = 0;
        this.loading = true;
        this.itemsPerPage = 10;
        await this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
      } catch (error) {
        this.alertMessage = error?.message;
        console.error("Save error:", error);
        this.$emit("error", error);
        this.dialog = true;
      }
    },
  },
};
</script>
