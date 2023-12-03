<script>
import { Button, Modal } from 'flowbite-svelte'
import {t} from '$lib/store/t'
import FormRow from '$lib/components/common/FormRow.svelte'
import FkForm from '$lib/components/common/FkForm.svelte'
import FkTextInput from '$lib/components/common/FkTextInput.svelte'
import FkStaticTextInput from '$lib/components/common/FkStaticTextInput.svelte'
import FkTextArea from '$lib/components/common/FkTextArea.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import SelectPostType from '$lib/components/SelectPostType.svelte'
import SelectLang from '$lib/components/SelectLang.svelte'


export let blog
export let handleSave = null

let changeNameModalOpen = false

// TODO: Валидация безопасного имени блога
// TODO: мультиселект типа post
// TODO: добавить hint для postFooter
// TODO: добавить hint для telegraphToken - где взять
// TODO: валидация полей
// TODO: не сохраняются типы постов

</script>


<FkForm let:form {handleSave}>

  <FormRow
    label={$t('details.safeName')}
    name='name'
    initial={blog.name}
    {form}
    let:field
  >
    <div class="flex gap-x-2">
      <FkStaticTextInput {field} />
      <Button on:click={() => (changeNameModalOpen = true)}>{$t('chunks.rename')}</Button>
    </div>
    <Modal title={$t('headers.renameBlog')} bind:open={changeNameModalOpen}>
      <FkTextInput {field} />
      <svelte:fragment slot="footer">
        <div class="w-full text-right">
          <Button color="alternative" on:click={() => (changeNameModalOpen = false)}>{$t('chunks.cancel')}</Button>
          <Button on:click={() => alert('Handle "success"')}>{$t('chunks.rename')}</Button>
        </div>
      </svelte:fragment>
    </Modal>
  </FormRow>

  <FormRow
    label={$t('details.title')}
    name='title'
    initial={blog.title}
    {form}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <FormRow
    label={$t('details.lang')}
    name='lang'
    initial={blog.lang}
    {form}
    let:field
  >
    <SelectLang {field} />
  </FormRow>

  <SectionHeader>{$t('headers.config')}</SectionHeader>

  <SectionHeader>telegra.ph</SectionHeader>

  <FormRow
    label={$t('details.telegraphToken')}
    name='config.telegraph.token'
    initial={blog.config?.telegraph.token}
    {form}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <FormRow
    label={$t('details.authorName')}
    name='config.telegraph.authorName'
    initial={blog.config?.telegraph.authorName}
    {form}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <FormRow
    label={$t('details.authorUrl')}
    name='config.telegraph.authorUrl'
    initial={blog.config?.telegraph.authorUrl}
    {form}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <SectionHeader>{$t('sns.telegram')}</SectionHeader>

  <FormRow
    label={$t('details.controlledChannelId')}
    name='config.telegram.channelId'
    initial={blog.config?.telegram.channelId}
    {form}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <FormRow
    label={$t('details.supportedTypes')}
    name='config.telegram.supportedTypes'
    initial={blog.config?.telegram.supportedTypes}
    {form}
    let:field
  >
    <SelectPostType {field} multi />
  </FormRow>

  <FormRow
    label={$t('details.articlePostTmpl')}
    name='config.telegram.articlePostTmpl'
    initial={blog.config?.telegram.articlePostTmpl}
    {form}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>

  <FormRow
    label={$t('details.articleFooter')}
    name='config.telegram.articleFooter'
    initial={blog.config?.telegram.articleFooter}
    {form}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>

  <SectionHeader>{$t('sns.dzen')}</SectionHeader>

  <FormRow
    label={$t('details.postFooter')}
    name='config.dzen.postFooter'
    initial={blog.config?.dzen.postFooter}
    {form}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>

  <FormRow
    label={$t('details.articleFooter')}
    name='config.dzen.articleFooter'
    initial={blog.config?.dzen.articleFooter}
    {form}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>

</FkForm>
