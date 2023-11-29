<script>
import { arraySimilar } from 'squidlet-lib'
import {Button, Modal, Textarea} from 'flowbite-svelte'
import FkForm from '$lib/components/common/FkForm.svelte'
import {t} from '$lib/store/t'
import FkTextInput from "$lib/components/common/FkTextInput.svelte"
import FkTextArea from "$lib/components/common/FkTextArea.svelte"
import FkCheckBoxInput from "$lib/components/common/FkCheckBoxInput.svelte"
import SelectPostType from "$lib/components/SelectPostType.svelte"
import FormRow from "$lib/components/common/FormRow.svelte"
import {ALL_SNS, POST_TYPES} from "$lib/constants"
import SectionHeader from "$lib/components/SectionHeader.svelte";


export let handleSave = null
export let item

let parseTimecodeModalOpen = false
let parseTimecodeValue = ''
let timecodeParseResult = ''

const meta = item.result.meta

// TODO: add select
let selectedSns = ['telegram', 'youtube', 'dzen', 'mave']

const handleTimecodeParse = () => {
  const arr = [...(parseTimecodeValue || '').matchAll(/^#{1,4}\s+(\d\d\:\d\d)\s+(.+)$/gm)]
  const resArr = []

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

</script>

<FkForm let:form {handleSave}>
  <FormRow
    label={$t('details.postId')}
    {form}
    name="postId"
    initial={meta.postId}
    let:value
  >
    {meta.postId}
  </FormRow>
  <FormRow
    label="urlName"
    {form}
    name="urlName"
    initial={meta.urlName}
    let:value
  >
    {meta.urlName}
  </FormRow>
  <FormRow
    label={$t('details.title')}
    {form}
    name="title"
    initial={meta.title}
    let:field
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
  >
    <FkTextArea {field} />
  </FormRow>

  {#if meta.type === POST_TYPES.video}
    <FormRow
      label={$t('details.timeCodes')}
      {form}
      name="timeCodes"
      initial={meta.timeCodes}
      let:field
    >
      <FkTextArea {field} />
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

  {#if selectedSns.includes(ALL_SNS.telegram)}
    <div>
      <SectionHeader>{$t('sns.telegram')}</SectionHeader>

      <FormRow
        label={$t('details.preview')}
        {form}
        name="telegram.preview"
        initial={meta.telegram.preview}
        let:field
      >
        <FkCheckBoxInput {field} />
      </FormRow>
      <FormRow
        label={$t('details.urlButton')}
        {form}
        name="telegram.urlButton"
        initial={meta.telegram.urlButton}
        let:field
      >
        <FkTextInput {field} />
      </FormRow>

      <FormRow
        label={$t('details.autoRemove')}
        {form}
        name="telegram.autoRemove"
        initial={meta.telegram.autoRemove}
        let:field
      >
        <FkTextInput {field} />
      </FormRow>

      <FormRow
        label={$t('details.tags')}
        {form}
        name="telegram.tags"
        initial={meta.telegram.tags}
        let:field
      >
        <FkTextInput {field} />
      </FormRow>

      {#if meta.type === POST_TYPES.article}
        <FormRow
          label={$t('details.articleTemplate')}
          {form}
          name="telegram.articleTemplate"
          initial={meta.telegram.articleTemplate}
          let:field
        >
          <FkTextArea {field} />
        </FormRow>
      {:else}
        <FormRow
          label={$t('details.postTemplate')}
          {form}
          name="telegram.postTemplate"
          initial={meta.telegram.postTemplate}
          let:field
        >
          <FkTextArea {field} />
        </FormRow>
      {/if}
      {#if meta.type === POST_TYPES.article}
        <FormRow
          label={$t('details.articleFooter')}
          {form}
          name="telegram.articleFooter"
          initial={meta.telegram.articleFooter}
          let:field
        >
          <FkTextArea {field} />
        </FormRow>
      {:else}
        <FormRow
          label={$t('details.postFooter')}
          {form}
          name="telegram.postFooter"
          initial={meta.telegram.postFooter}
          let:field
        >
          <FkTextArea {field} />
        </FormRow>
      {/if}

      <FormRow
        label={$t('details.contentLinks')}
        {form}
        name="telegram.contentLinks"
        initial={meta.telegram.contentLinks}
        let:field
      >
        <FkTextArea {field} />
      </FormRow>

      <FormRow
        label={$t('details.pubDateTime')}
        {form}
        name="telegram.pubDateTime"
        initial={meta.telegram.pubDateTime}
        let:field
      >
        <FkTextInput {field} />
      </FormRow>
    </div>
  {/if}

  {#if selectedSns.includes(ALL_SNS.youtube)}
    <div>
      <SectionHeader>{$t('sns.youtube')}</SectionHeader>

      <FormRow
        label={$t('details.tags')}
        {form}
        name="youtube.tags"
        initial={meta.youtube.tags}
        let:field
      >
        <FkTextInput {field} />
      </FormRow>

      <FormRow
        label={$t('details.template')}
        {form}
        name="youtube.template"
        initial={meta.youtube.template}
        let:field
      >
        <FkTextArea {field} />
      </FormRow>

      <FormRow
        label={$t('details.footer')}
        {form}
        name="youtube.footer"
        initial={meta.youtube.footer}
        let:field
      >
        <FkTextArea {field} />
      </FormRow>

      <FormRow
        label={$t('details.contentLinks')}
        {form}
        name="youtube.contentLinks"
        initial={meta.youtube.contentLinks}
        let:field
      >
        <FkTextArea {field} />
      </FormRow>

      <FormRow
        label={$t('details.pubDateTime')}
        {form}
        name="youtube.pubDateTime"
        initial={meta.youtube.pubDateTime}
        let:field
      >
        <FkTextInput {field} />
      </FormRow>
    </div>
  {/if}

  {#if selectedSns.includes(ALL_SNS.dzen)}
    <div>
      <SectionHeader>{$t('sns.dzen')}</SectionHeader>

      <FormRow
        label={$t('details.template')}
        {form}
        name="dzen.template"
        initial={meta.dzen.template}
        let:field
      >
        <FkTextArea {field} />
      </FormRow>

      <FormRow
        label={$t('details.footer')}
        {form}
        name="dzen.footer"
        initial={meta.dzen.footer}
        let:field
      >
        <FkTextArea {field} />
      </FormRow>

      <FormRow
        label={$t('details.pubDateTime')}
        {form}
        name="dzen.pubDateTime"
        initial={meta.dzen.pubDateTime}
        let:field
      >
        <FkTextInput {field} />
      </FormRow>
    </div>
  {/if}

  {#if arraySimilar(selectedSns, [ALL_SNS.mave, ALL_SNS.spotifyForPodcasters])}
    <div>
      <SectionHeader>Podcast</SectionHeader>

      <FormRow
        label={$t('details.tags')}
        {form}
        name="podcast.tags"
        initial={meta.podcast.tags}
        let:field
      >
        <FkTextInput {field} />
      </FormRow>

      <FormRow
        label={$t('details.template')}
        {form}
        name="podcast.template"
        initial={meta.podcast.template}
        let:field
      >
        <FkTextArea {field} />
      </FormRow>

      <FormRow
        label={$t('details.footer')}
        {form}
        name="podcast.footer"
        initial={meta.podcast.footer}
        let:field
      >
        <FkTextArea {field} />
      </FormRow>

      <FormRow
        label={$t('details.contentLinks')}
        {form}
        name="podcast.contentLinks"
        initial={meta.podcast.contentLinks}
        let:field
      >
        <FkTextArea {field} />
      </FormRow>

      <FormRow
        label={$t('details.pubDateTime')}
        {form}
        name="podcast.pubDateTime"
        initial={meta.podcast.pubDateTime}
        let:field
      >
        <FkTextInput {field} />
      </FormRow>
    </div>
  {/if}

</FkForm>
