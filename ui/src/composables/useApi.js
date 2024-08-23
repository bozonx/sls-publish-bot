const runtimeConfig = useRuntimeConfig();

export async function useApiList(pathTo) {
  const url = `${runtimeConfig.public.apiBaseUrl}/${pathTo}`;

  return await useAsyncData(url, () => $fetch(url));
}

export async function useApiBlog(blogId) {
  const url = `${runtimeConfig.public.apiBaseUrl}/blogs/${blogId}`;

  return await useAsyncData(url, () => $fetch(url));
}
