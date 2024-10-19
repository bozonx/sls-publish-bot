const runtimeConfig = useRuntimeConfig();
const fetchOptions = {
  credentials: "include",
  headers: makeTgAuthHeaders(),
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

  // TODO: кэшировать в session Storage

  const res = await useAsyncData(url, async () => $fetch(url, fetchOptions));

  res.data.value.cfg = res.data.value.cfg ? JSON.parse(res.data.value.cfg) : {};

  return res;
}

////// GET LISTS

export async function useApiListMyWorkspaces() {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiListMyBlogs(wpid) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs?workspace-id=${wpid}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiListMySns(blogId) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/social-media?blog-id=${blogId}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiListBlogTasks(blogId) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/task?blog-id=${blogId}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiListSmTasks(smId) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/task?social-media-id=${smId}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiListBlogTags(blogId = null) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/task?blog-id=${blogId}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiListSmTags(smId = null) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/task?social-media-id=${smId}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

////// GET ITEM

export async function useApiGetMyWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces/${id}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

// TODO: remove
export async function useApiGetMyBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs/${id}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiGetBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs/${id}`;
  const res = await useAsyncData(url, async () => $fetch(url, fetchOptions));

  res.data.value.cfg = res.data.value.cfg ? JSON.parse(res.data.value.cfg) : {};

  return res;
}

// TODO: remove
export async function useApiGetMySn(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/social-media/${id}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiGetSn(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/social-media/${id}`;
  const res = await useAsyncData(url, async () => $fetch(url, fetchOptions));

  res.data.value.cfg = res.data.value.cfg ? JSON.parse(res.data.value.cfg) : {};

  return res;
}

export async function useApiGetTask(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/task/${id}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

////// DELETE ITEM

export async function useApiDeleteMyWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces/${id}`;

  return useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", ...fetchOptions }),
  );
}

export async function useApiDeleteMyBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs/${id}`;

  return useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", ...fetchOptions }),
  );
}

export async function useApiDeleteMySn(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/social-media/${id}`;

  return useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", ...fetchOptions }),
  );
}

export async function useApiDeleteTask(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/task/${id}`;

  return useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", ...fetchOptions }),
  );
}
