export const useUserStore = defineStore("user", () => {
  const data = ref<{ users: any[] }>({ users: [] });

  const fetchUsers = async () => {
    if (!data.value.users.length) {
      const res = await $fetch<{ users: any[] }>(
        "https://dummyjson.com/users?limit=20"
      );
      data.value.users = res.users;
    }
  };

  const getData = computed(() => data.value);

  return { fetchUsers, getData };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
