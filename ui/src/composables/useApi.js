const runtimeConfig = useRuntimeConfig();
const fetchOptions = {
  credentials: "include",
  async onResponseError({ request, response }) {
    if (response.status === 401) {
      return navigateTo("/login");
    }

    // TODO: rise a toast
  },
};

export async function useApiTgAuthFromWeb(body) {
  const url = `${runtimeConfig.public.apiBaseUrl}/tg-auth-from-web`;

  return $fetch(url, { method: "post", body, ...fetchOptions });
}

export async function useApiDevLogin() {
  const url = `${runtimeConfig.public.apiBaseUrl}/dev-login`;

  return $fetch(url, { method: "post", body: {}, ...fetchOptions });
}

export async function useApiMe() {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/users/me`;

  return await useAsyncData(url, async () => $fetch(url, fetchOptions));
}

////// GET LISTS

export async function useApiListWorkspaces() {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces`;

  return await useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiListBlogs(wpid) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs?workspace-id=${wpid}`;

  return await useAsyncData(url, async () => $fetch(url, fetchOptions));
}

////// GET ITEM

export async function useApiGetWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces/${id}`;

  return await useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiGetBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs/${id}`;

  return await useAsyncData(url, async () => $fetch(url, fetchOptions));
}

////// DELETE ITEM

export async function useApiDeleteWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces/${id}`;

  return await useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", ...fetchOptions }),
  );
}

export async function useApiDeleteBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs/${id}`;

  return await useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", ...fetchOptions }),
  );
}
