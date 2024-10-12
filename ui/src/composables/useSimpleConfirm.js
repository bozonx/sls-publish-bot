export function useSimpleConfirm() {
  const { t } = useI18n();
  const confirm = useConfirm();

  return (
    header,
    message,
    okLabel = t("ok"),
    cb,
    onError,
    cancelLabel = t("cancel"),
  ) => {
    confirm.require({
      message,
      header,
      // icon: "pi pi-exclamation-triangle",
      rejectProps: {
        label: cancelLabel,
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: okLabel,
      },
      accept: cb,
      reject: onError,
    });
  };
}
