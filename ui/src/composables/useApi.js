const runtimeConfig = useRuntimeConfig();

export async function useApiMe() {
  // by-tg-id/${runtimeConfig.public.devTgUserId}
  const url = `${runtimeConfig.public.apiBaseUrl}/users/me`;
  return await useAsyncData(url, () => $fetch(url));
}

////// GET LISTS

export async function useWorkspacesList() {
  const url = `${runtimeConfig.public.apiBaseUrl}/workspaces`;

  return await useAsyncData(url, () => $fetch(url));
}

export async function useApiBlogsList(wpid) {
  const url = `${runtimeConfig.public.apiBaseUrl}/blogs?workspace-id=${wpid}`;

  return await useAsyncData(url, () => $fetch(url));
}

////// GET ITEM

export async function useApiWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/workspaces/${id}`;

  return await useAsyncData(url, () => $fetch(url));
}

export async function useApiBlog(id) {
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
