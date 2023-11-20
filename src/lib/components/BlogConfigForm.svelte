<script>
import {t} from '$lib/store/t'
import FormRow from '$lib/components/common/FormRow.svelte'
import FkForm from '$lib/components/common/FkForm.svelte'
import FkTextInput from '$lib/components/common/FkTextInput.svelte'
import FkTextArea from '$lib/components/common/FkTextArea.svelte'
import SectionHeader from '$lib/components/SectionHeader.svelte'
import SelectPostType from '$lib/components/SelectPostType.svelte'


export let blog
export let handleSave = null


// TODO: Валидация безопасного имени блога
// TODO: мультиселект типа post
// TODO: добавить hint для postFooter
// TODO: добавить hint для telegraphToken - где взять

</script>


<FkForm let:form {handleSave}>

  <FormRow
    label={$t('details.safeName')}
    name='name'
    initial={blog.name}
    {form}
    let:field
  >
    <FkTextInput {field} />
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
    <FkTextInput {field} disabled />
  </FormRow>

  <SectionHeader>{$t('headers.config')}</SectionHeader>

  <SectionHeader>Telegraph</SectionHeader>

  <FormRow
    label={$t('details.telegraphToken')}
    name='config.telegraph.token'
    initial={blog.config.telegraph.token}
    {form}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <FormRow
    label={$t('details.authorName')}
    name='config.telegraph.authorName'
    initial={blog.config.telegraph.authorName}
    {form}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <FormRow
    label={$t('details.authorUrl')}
    name='config.telegraph.authorUrl'
    initial={blog.config.telegraph.authorUrl}
    {form}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <SectionHeader>{$t('sns.telegram')}</SectionHeader>

  <FormRow
    label={$t('details.controlledChannelId')}
    name='config.telegram.channelId'
    initial={blog.config.telegram.channelId}
    {form}
    let:field
  >
    <FkTextInput {field} />
  </FormRow>

  <FormRow
    label={$t('details.supportedTypes')}
    name='config.telegram.supportedTypes'
    initial={blog.config.telegram.supportedTypes}
    {form}
    let:field
  >
    <SelectPostType {field} multi />
  </FormRow>

  <FormRow
    label={$t('details.articlePostTmpl')}
    name='config.telegram.articlePostTmpl'
    initial={blog.config.telegram.articlePostTmpl}
    {form}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>

  <FormRow
    label={$t('details.articleFooter')}
    name='config.telegram.articleFooter'
    initial={blog.config.telegram.articleFooter}
    {form}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>

  <SectionHeader>{$t('sns.dzen')}</SectionHeader>

  <FormRow
    label={$t('details.postFooter')}
    name='config.dzen.postFooter'
    initial={blog.config.dzen.postFooter}
    {form}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>

  <FormRow
    label={$t('details.articleFooter')}
    name='config.dzen.articleFooter'
    initial={blog.config.dzen.articleFooter}
    {form}
    let:field
  >
    <FkTextArea {field} />
  </FormRow>

</FkForm>
