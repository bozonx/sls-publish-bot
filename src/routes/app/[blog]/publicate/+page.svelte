<script>
import {Heading} from 'flowbite-svelte'
import {t} from '$lib/store/t'
import BlogDetails from '$lib/components/BlogDetails.svelte'
import SelectPost from '$lib/components/SelectPost.svelte'

export let data
</script>

<Heading tag="h1">{$t('links.publicate')}</Heading>

<div>
  <BlogDetails details={data.blog} />

  <SelectPost postResp={data.posts} />

  <pre>
    * + выбираем блог (из левого меню)
    * выбираем пост или статью
    * считываем ёё и мета дату из squidlet
    * предпросмотр всех данных
    * формируем меню для исправления даты публикации, время и других параметров
    * выбор соц сетей для публикации
      * можно просто нажать отдельно на каждую
    * предпросмотр всех итоговых данных
    * запись в соц сети
    * кнопки копирования для соц сетей в которые нельзя залить
  </pre>
</div>
