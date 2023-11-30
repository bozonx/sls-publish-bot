<script>
import { arraySimilar, deepSet } from 'squidlet-lib'
import slug from 'slug'
import {Button, Modal, Textarea, Checkbox} from 'flowbite-svelte'
import FkForm from '$lib/components/common/FkForm.svelte'
import {t} from '$lib/store/t'
import FkTextInput from "$lib/components/common/FkTextInput.svelte"
import FkTextArea from "$lib/components/common/FkTextArea.svelte"
import FkCheckBoxInput from "$lib/components/common/FkCheckBoxInput.svelte"
import FkStaticTextInput from "$lib/components/common/FkStaticTextInput.svelte"
import SelectPostType from "$lib/components/SelectPostType.svelte"
import FormRow from "$lib/components/common/FormRow.svelte"
import {ALL_SNS, POST_TYPES} from "$lib/constants"
import SectionHeader from "$lib/components/SectionHeader.svelte";
import SelectSns from "$lib/components/SelectSns.svelte";
import PostEditTelegramSection from "$lib/components/PostEditTelegramSection.svelte";
import PostEditYoutubeSection from "$lib/components/PostEditYoutubeSection.svelte";
import PostEditDzenSection from "$lib/components/PostEditDzenSection.svelte";
import PostEditPodcastSection from "$lib/components/PostEditPodcastSection.svelte";


export let handleSave = null
export let blog
export let item

let customUrlName = false
let parseTimecodeModalOpen = false
let parseTimecodeValue = ''
let timecodeParseResult = ''

const meta = item.result.meta

let selectedSns = meta.sns || []

const validateCb = (errors, values) => {
  if (!values.title) errors.title = $t('messages.emptyField')
  if (!values.urlName) errors.urlName = $t('messages.emptyField')
  else if (!values.urlName.match(/^[a-zA-Z\d\-]+$/)) errors.urlName = $t('messages.wrongSymbols')

  // telegram
  if (
    values.telegram?.urlButton.url
    && !values.telegram.urlButton.url.match(/^[a-zA-Z\d\-\:\/\@.\%]+$/)
  ) deepSet(errors, 'telegram.urlButton.url', $t('messages.wrongSymbols'))
}

const handleTimecodeParse = () => {
  const arr = [...(parseTimecodeValue || '').matchAll(/^#{1,4}\s+(\d\d\:\d\d)\s+(.+)$/gm)]
  const resArr = [
    // TODO: взять из конфига
    '00:00 Начало'
  ]

  for (const [fullStr, timeCode, header] of arr) {

    resArr.push(`${timeCode} ${header}`)
  }

  timecodeParseResult = resArr.join('\n')
}

const handleTimecodeInsert = (field) => {
  field.handleChange(timecodeParseResult)
  parseTimecodeValue = ''
  timecodeParseResult = ''
  parseTimecodeModalOpen = false
}

const handleTitleChange = ({detail}) => {
  if (customUrlName) return

  const converted = slug(detail.value, { locale: blog.lang })

  detail.field.form.fields['urlName'].handleChange(converted)
}

</script>

<FkForm let:form {handleSave} {validateCb}>
  <FormRow
    label="postId"
    {form}
    name="postId"
    initial={meta.postId}
    let:field
  >
    <FkStaticTextInput {field} />
  </FormRow>

  <FormRow
    label="urlName"
    {form}
    name="urlName"
    initial={meta.urlName}
    let:field
    hint={$t('hints.urlName')}
  >
    {#if customUrlName}
      <FkTextInput {field} />
    {:else}
      <FkStaticTextInput {field} />
    {/if}

    <div class="mt-2">
      <Checkbox bind:checked={customUrlName}>{$t('chunks.typeCustomName')}</Checkbox>
    </div>
  </FormRow>

  <FormRow
    label={$t('details.title')}
    {form}
    name="title"
    initial={meta.title}
    let:field
    hint={$t('hints.onlyPlainText')}
    on:change={(value) => handleTitleChange(value)}
  >
    <FkTextInput {field} />
  </FormRow>

  <FormRow
    label={$t('details.type')}
    {form}
    name="type"
    initial={meta.type}
    let:field
  >
    <SelectPostType {field} />
  </FormRow>

  <FormRow
    label={$t('details.descr')}
    {form}
    name="descr"
    initial={meta.descr}
    let:field
    hint={$t('hints.mdFormatSupported')}
  >
    <FkTextArea rows={5} {field} />
  </FormRow>

  {#if meta.type === POST_TYPES.video}
    <FormRow
      label={$t('details.timeCodes')}
      {form}
      name="timeCodes"
      initial={meta.timeCodes}
      let:field
      hint={$t('hints.onlyPlainText')}
    >
      <FkTextArea rows={10} {field} />
      <Button on:click={() => (parseTimecodeModalOpen = true)}>{$t('chunks.insertTimeCodesFromHeaders')}</Button>
      <Modal title={$t('chunks.insertTimeCodesFromHeaders')} bind:open={parseTimecodeModalOpen}>
        <Textarea bind:value={parseTimecodeValue} />
        <pre>{timecodeParseResult}</pre>
        <svelte:fragment slot="footer">
          <div class="w-full text-right">
            <Button color="alternative" on:click={() => (parseTimecodeModalOpen = false)}>{$t('chunks.cancel')}</Button>
            {#if timecodeParseResult}
              <Button on:click={() => handleTimecodeInsert(field)}>{$t('chunks.insert')}</Button>
            {:else}
              <Button on:click={handleTimecodeParse}>{$t('chunks.parse')}</Button>
            {/if}
          </div>
        </svelte:fragment>
      </Modal>
    </FormRow>
  {/if}

  <div>
    <SectionHeader>{$t('headers.selectSN')}</SectionHeader>

    <SelectSns
      initialChecked={meta.sns || []}
      on:change={({detail}) => selectedSns = detail}
    />
  </div>

  <div hidden={!selectedSns.includes(ALL_SNS.telegram)}>
    <SectionHeader>{$t('sns.telegram')}</SectionHeader>

    <PostEditTelegramSection {meta} {blog} {form} />
  </div>

  <div hidden={!selectedSns.includes(ALL_SNS.youtube)}>
    <SectionHeader>{$t('sns.youtube')}</SectionHeader>

    <PostEditYoutubeSection {meta} {blog} {form} />
  </div>

  <div hidden={!selectedSns.includes(ALL_SNS.dzen)}>
    <SectionHeader>{$t('sns.dzen')}</SectionHeader>

    <PostEditDzenSection {meta} {blog} {form} />
  </div>

  <div hidden={!arraySimilar(selectedSns, [ALL_SNS.mave, ALL_SNS.spotifyForPodcasters]).length}>
    <SectionHeader>Podcast</SectionHeader>

    <PostEditPodcastSection {meta} {blog} {form} />
  </div>

</FkForm>
