const runtimeConfig = useRuntimeConfig();

export async function formSubmitHelper(FormData, form$) {
  const data = form$.data;

  form$.cancelToken = form$.$vueform.services.axios.CancelToken.source();

  return await form$.$vueform.services.axios.post(
    runtimeConfig.public.apiBaseUrl + "/workspaces",
    data,
    {
      cancelToken: form$.cancelToken.token,
    },
  );
}
