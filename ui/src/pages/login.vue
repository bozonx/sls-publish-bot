<script setup>
const { t } = useI18n();

definePageParams({
  showHome: false,
  title: "Login",
});

window.onTelegramAuth = async function (user) {
  let res;

  try {
    res = await useApiTgAuthFromWeb(user);
  } catch (e) {
    console.error(e);
  }

  console.log(2222, res);

  // navigateTo(`/`);
};

const handleDevLogin = async () => {
  await useApiDevLogin();

  // navigateTo(`/`);
};

// TODO: show dev button only on dev env
</script>

<template>
  <div>
    <Script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="sls_publisher_dev_bot"
      data-size="large" data-onauth="onTelegramAuth(user)" data-request-access="write"></Script>

    <div>
      <Button @click="handleDevLogin">Dev login</Button>
    </div>
  </div>
</template>
