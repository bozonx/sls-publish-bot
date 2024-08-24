const DEFAULT_PAGE_PARAMS = {
  backUrl: null,
  categoryTitle: null,
  categoryUrl: null,
  title: "",
  showHome: true,
};

export const usePageParams = () => {
  return useState("pageParams", () => DEFAULT_PAGE_PARAMS);
};

export function definePageParams(newParams) {
  const pageParams = usePageParams();

  pageParams.value = {
    ...DEFAULT_PAGE_PARAMS,
    ...newParams,
  };

  definePageMeta({
    middleware: [
      function(to, from) {
        // Custom inline middleware
        console.log(2222, to, from);
      },
      "auth",
    ],
  });

  useHead({
    title: pageParams.value.title,
  });
}
