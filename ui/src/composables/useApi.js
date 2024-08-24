const runtimeConfig = useRuntimeConfig();

export async function useAuthorizeViaBot() {
  const tgUserId = useTgWebAppUserId();
  const url = `${runtimeConfig.public.apiBaseUrl}/users/auth-via-bot`;

  return await useAsyncData(url, () =>
    $fetch(url, {
      method: "POST",
      body: JSON.stringify({ tgUserId }),
    }),
  );
}

export async function useApiMe() {
  const url = `${runtimeConfig.public.apiBaseUrl}/users/me`;

  return await useAsyncData(url, () => $fetch(url));
}

////// GET LISTS

export async function useApiListWorkspaces() {
  const url = `${runtimeConfig.public.apiBaseUrl}/workspaces`;

  return await useAsyncData(url, () => $fetch(url));
}

export async function useApiListBlogs(wpid) {
  const url = `${runtimeConfig.public.apiBaseUrl}/blogs?workspace-id=${wpid}`;

  return await useAsyncData(url, () => $fetch(url));
}

////// GET ITEM

export async function useApiGetWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/workspaces/${id}`;

  return await useAsyncData(url, () => $fetch(url));
}

export async function useApiGetBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/blogs/${id}`;

  return await useAsyncData(url, () => $fetch(url));
}

////// DELETE ITEM

export async function useApiDeleteWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/workspaces/${id}`;

  return await useAsyncData(url, () => $fetch(url, { method: "DELETE" }));
}

export async function useApiDeleteBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/blogs/${id}`;

  return await useAsyncData(url, () => $fetch(url, { method: "DELETE" }));
}
