const runtimeConfig = useRuntimeConfig();

export function formSubmitHelper(endpoint) {
  return async (FormData, form$) => {
    const data = form$.data;

    form$.cancelToken = form$.$vueform.services.axios.CancelToken.source();

    return await form$.$vueform.services.axios({
      url: runtimeConfig.public.apiBaseUrl + endpoint,
      data,
      method: form$.method || "post",
      cancelToken: form$.cancelToken.token,
    });
  };
}
