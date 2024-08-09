<script>
import {deepMerge} from 'squidlet-lib'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import BlogConfigForm from '$lib/components/BlogConfigForm.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {squidletAppApi} from '$lib/squidletAppApi'
import {pushToast} from "$lib/store/toasts"


export let data

let blogView = data.blog

breadcrumbs.set([
  {href: `/app/${$page.params.blog}`, title: data.blog.title},
  {title: $t('links.blogConfig')}
])

const saveBlogConfigHandler = async (values) => {
  const newData = deepMerge(values, blogView)

  // TODO: а что если поменялось имя - надо переименовать папку

  try {
    await squidletAppApi.saveBlogConfig(newData.name, newData)
  }
  catch (e) {
    return pushToast({
      text: $t('messages.cantSave'),
      purpose: 'error',
    })
  }

  dataView = newData
}

</script>

<BlogConfigForm blog={blogView} handleSave={saveBlogConfigHandler} />
