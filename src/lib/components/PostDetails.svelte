<script>
import DetailItem from '$lib/components/DetailItem.svelte'
import {t} from '$lib/store/t'
import SectionHeader from "$lib/components/SectionHeader.svelte";

export let item

</script>

<div>
  <DetailItem label="fileName">{item.result.meta.fileName}</DetailItem>
  <DetailItem label={$t('details.title')}>{item.result.meta.title}</DetailItem>
  <DetailItem label="urlName">{item.result.meta.urlName}</DetailItem>
  <DetailItem label="type">{item.result.meta.type}</DetailItem>
  <DetailItem label="descr">{item.result.meta.descr}</DetailItem>

  {#if item.result.meta.common}
    <SectionHeader>common</SectionHeader>
    <DetailItem label="preview">{item.result.meta.common.tags?.join(', ')}</DetailItem>
    <DetailItem label="postTemplate">{item.result.meta.common.postTemplate}</DetailItem>
    <DetailItem label="contentLinks">{item.result.meta.common.contentLinks}</DetailItem>
    <DetailItem label="footer">{item.result.meta.common.postFooter}</DetailItem>
    <DetailItem label="pubDateTime">{item.result.meta.common.pubDateTime}</DetailItem>
  {/if}

  {#if item.result.meta.tg}
  <SectionHeader>{$t('sns.telegram')}</SectionHeader>
  <DetailItem label="preview">{item.result.meta.tg.preview}</DetailItem>
  <DetailItem label="urlButton">{item.result.meta.tg.urlButton}</DetailItem>
  <DetailItem label="autoRemove">{item.result.meta.tg.autoRemove}</DetailItem>

  <DetailItem label="preview">{item.result.meta.tg.tags?.join(', ')}</DetailItem>
  <DetailItem label="postTemplate">{item.result.meta.tg.postTemplate}</DetailItem>
  <DetailItem label="contentLinks">{item.result.meta.tg.contentLinks}</DetailItem>
  <DetailItem label="footer">{item.result.meta.tg.postFooter}</DetailItem>
  <DetailItem label="pubDateTime">{item.result.meta.tg.pubDateTime}</DetailItem>
  {/if}

  {#if item.result.meta.youtube}
  <SectionHeader>{$t('sns.youtube')}</SectionHeader>
  <DetailItem label="preview">{item.result.meta.youtube?.tags?.join(', ')}</DetailItem>
  <DetailItem label="postTemplate">{item.result.meta.youtube?.postTemplate}</DetailItem>
  <DetailItem label="contentLinks">{item.result.meta.youtube?.contentLinks}</DetailItem>
  <DetailItem label="footer">{item.result.meta.youtube?.postFooter}</DetailItem>
  <DetailItem label="pubDateTime">{item.result.meta.youtube?.pubDateTime}</DetailItem>
  {/if}

</div>
