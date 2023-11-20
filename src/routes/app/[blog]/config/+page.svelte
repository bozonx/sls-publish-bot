<script>
import {deepMerge} from 'squidlet-lib'
import {t} from '$lib/store/t'
import { page } from '$app/stores'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import BlogConfigForm from '$lib/components/BlogConfigForm.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'
import {squidletAppApi} from '$lib/squidletAppApi'
import {pushToast} from "$lib/store/toasts"


pushToast({
  text: 'aaa',
  purpose: 'log',
})
pushToast({
  text: 'bbb',
  purpose: 'error',
})


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
    // TODO: если не прошо сохранение то надо поднять notify
    console.error(e)


    return
  }

  dataView = newData
}

</script>

<BlogConfigForm blog={blogView} handleSave={saveBlogConfigHandler} />
