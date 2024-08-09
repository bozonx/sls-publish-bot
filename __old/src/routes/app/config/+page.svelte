<script>
import {deepMerge} from 'squidlet-lib'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {squidletAppApi} from "$lib/squidletAppApi"
import {t} from "$lib/store/t"
import AppConfigForm from '$lib/components/AppConfigForm.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'


export let data

breadcrumbs.set([{title: 'config'}])

const saveAppConfigHandler = async (values) => {
  await squidletAppApi.saveAppConfig(deepMerge(values, data.appConfig))
}
</script>

<div>
  <SectionHeader>{$t('links.appConfig')}</SectionHeader>

  <AppConfigForm config={data.appConfig} handleSave={saveAppConfigHandler} />
</div>
