const runtimeConfig = useRuntimeConfig();

export async function useApiMe() {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/users/me`;

  return await useAsyncData(url, async () =>
    $fetch(url, { credentials: "include" }),
  );
}

// export async function useApiLogin(tgUserId) {
//   const url = `${runtimeConfig.public.apiBaseUrl}/login`;
//
//   return await useAsyncData(url, async () =>
//     $fetch(url, { method: "post", body: { tgUserId } }),
//   );
// }

export async function useApiTgAuthFromWeb(body) {
  const url = `${runtimeConfig.public.apiBaseUrl}/tg-auth-from-web`;

  return $fetch(url, { method: "post", credentials: "include", body });
}

export async function useApiDevLogin() {
  const url = `${runtimeConfig.public.apiBaseUrl}/dev-login`;

  return $fetch(url, { method: "post", credentials: "include", body: {} });
}

////// GET LISTS

export async function useApiListWorkspaces() {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces`;

  return await useAsyncData(url, async () =>
    $fetch(url, { credentials: "include" }),
  );
}

export async function useApiListBlogs(wpid) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs?workspace-id=${wpid}`;

  return await useAsyncData(url, async () =>
    $fetch(url, { credentials: "include" }),
  );
}

////// GET ITEM

export async function useApiGetWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces/${id}`;

  return await useAsyncData(url, async () =>
    $fetch(url, { credentials: "include" }),
  );
}

export async function useApiGetBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs/${id}`;

  return await useAsyncData(url, async () =>
    $fetch(url, { credentials: "include" }),
  );
}

////// DELETE ITEM

export async function useApiDeleteWorkspace(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/workspaces/${id}`;

  return await useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", credentials: "include" }),
  );
}

export async function useApiDeleteBlog(id) {
  const url = `${runtimeConfig.public.apiBaseUrl}/auth/blogs/${id}`;

  return await useAsyncData(url, async () =>
    $fetch(url, { method: "DELETE", credentials: "include" }),
  );
}
