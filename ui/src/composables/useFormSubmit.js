const runtimeConfig = useRuntimeConfig();

export function formSubmitHelper(createEndpoint, updateEndpoint) {
  return async (FormData, form$) => {
    const data = form$.data;

    form$.cancelToken = form$.$vueform.services.axios.CancelToken.source();

    return await form$.$vueform.services.axios({
      url:
        runtimeConfig.public.apiBaseUrl +
        (form$.method === "patch" ? updateEndpoint : createEndpoint),
      data,
      method: form$.method || "post",
      cancelToken: form$.cancelToken.token,
    });
  };
}
