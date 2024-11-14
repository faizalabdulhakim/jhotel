export function useInitializeStore(apiCall: any) {
  const initialized = ref(false);
  const loading = ref(false);

  (async function () {
    loading.value = true;
    await apiCall();
    initialized.value = true;
    loading.value = false;
  })();

  return { initialized, loading };
}
