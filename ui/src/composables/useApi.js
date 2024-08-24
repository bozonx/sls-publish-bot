const runtimeConfig = useRuntimeConfig();

export async function useApiMe() {
  const url = `${runtimeConfig.public.apiBaseUrl}/users/by-tg-id/${runtimeConfig.public.devTgUserId}`;

  return await useAsyncData(url, () => $fetch(url));
}

// TODO: remove
export async function useApiList(pathTo) {
  const url = `${runtimeConfig.public.apiBaseUrl}/${pathTo}`;

  return await useAsyncData(url, () => $fetch(url));
}

export async function useWorkspacesList() {
  const url = `${runtimeConfig.public.apiBaseUrl}/workspaces`;

  return await useAsyncData(url, () => $fetch(url));
}

export async function useApiBlogsList(wpid) {
  const url = `${runtimeConfig.public.apiBaseUrl}/blogs?workspace-id=${wpid}`;

  return await useAsyncData(url, () => $fetch(url));
}

export async function useApiBlog(blogId) {
  const url = `${runtimeConfig.public.apiBaseUrl}/blogs/${blogId}`;

  return await useAsyncData(url, () => $fetch(url));
}

export async function useApiWorkspace(wpId) {
  const url = `${runtimeConfig.public.apiBaseUrl}/workspaces/${wpId}`;

  return await useAsyncData(url, () => $fetch(url));
}
