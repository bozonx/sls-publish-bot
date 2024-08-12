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

  useHead({
    title: pageParams.value.title,
  });
}
