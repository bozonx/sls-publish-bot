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

export async function useApiListWorkspaces() {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces`;
  const res = await useAsyncData(url, async () => $fetch(url, fetchOptions));

  res.data.value.map((i) => {
    return {
      ...i,
      cfg: i.cfg ? JSON.parse(i.cfg) : {},
    };
  });

  return res;
}

export async function useApiListBlogs(wpid) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs?workspace-id=${wpid}`;
  const res = await useAsyncData(url, async () => $fetch(url, fetchOptions));

  res.data.value.map((i) => {
    return {
      ...i,
      cfg: i.cfg ? JSON.parse(i.cfg) : {},
      tags: i.tags ? i.tags.split(",") : [],
    };
  });

  return res;
}

export async function useApiListSns(blogId) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/social-media?blog-id=${blogId}`;
  const res = await useAsyncData(url, async () => $fetch(url, fetchOptions));

  res.data.value.map((i) => {
    return {
      ...i,
      cfg: i.cfg ? JSON.parse(i.cfg) : {},
      tags: i.tags ? i.tags.split(",") : [],
    };
  });

  return res;
}

export async function useApiListBlogTasks(blogId) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/task?blog-id=${blogId}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

export async function useApiListSmTasks(smId) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/task?social-media-id=${smId}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

////// GET ITEM

export async function useApiGetWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces/${id}`;
  const res = await useAsyncData(url, async () => $fetch(url, fetchOptions));

  res.data.value.cfg = res.data.value.cfg ? JSON.parse(res.data.value.cfg) : {};

  return res;
}

export async function useApiGetBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs/${id}`;
  const res = await useAsyncData(url, async () => $fetch(url, fetchOptions));

  res.data.value.cfg = res.data.value.cfg ? JSON.parse(res.data.value.cfg) : {};
  res.data.value.tags = res.data.value.tags
    ? res.data.value.tags.split(",")
    : [];

  return res;
}

export async function useApiGetSn(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/social-media/${id}`;
  const res = await useAsyncData(url, async () => $fetch(url, fetchOptions));

  res.data.value.cfg = res.data.value.cfg ? JSON.parse(res.data.value.cfg) : {};
  res.data.value.tags = res.data.value.tags
    ? res.data.value.tags.split(",")
    : [];

  return res;
}

export async function useApiGetTask(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/task/${id}`;

  return useAsyncData(url, async () => $fetch(url, fetchOptions));
}

////// DELETE ITEM

export async function useApiDeleteWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces/${id}`;

  return useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", ...fetchOptions }),
  );
}

export async function useApiDeleteBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs/${id}`;

  return useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", ...fetchOptions }),
  );
}

export async function useApiDeleteSn(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/social-media/${id}`;

  return useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", ...fetchOptions }),
  );
}

export async function useApiDeletePost(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/post/${id}`;

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

////// CREATE ITEM

export async function useApiCreatePost(body) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/post`;

  return useAsyncData(url, async () =>
    $fetch(url, {
      method: "POST",
      body: {
        ...body,
        payload: JSON.stringify(body.payload),
      },
      ...fetchOptions,
    }),
  );
}
