<script>
import DetailItem from '$lib/components/DetailItem.svelte'
import {t} from '$lib/store/t'
import SectionHeader from "$lib/components/SectionHeader.svelte";
import CopyToClipboardButton from "$lib/components/common/CopyToClipboardButton.svelte";

export let item

</script>

<div>
  <DetailItem label="postId">{item.result.meta.postId}</DetailItem>
  <DetailItem label={$t('details.title')}>
    <div id="post-title">{item.result.meta.title}</div>
    <CopyToClipboardButton elementId="post-title">{$t('links.copyToClipboard')}</CopyToClipboardButton>
  </DetailItem>
  <DetailItem label="urlName">{item.result.meta.urlName}</DetailItem>
  <DetailItem label="type">{item.result.meta.type}</DetailItem>
  <DetailItem label="descr">
    <div id="post-descr">{item.result.meta.descr}</div>
    <CopyToClipboardButton elementId="post-descr">{$t('links.copyToClipboard')}</CopyToClipboardButton>
  </DetailItem>

  {#if item.result.meta.common}
    <SectionHeader>common</SectionHeader>
    <DetailItem label="tags">{item.result.meta.common.tags?.join(', ')}</DetailItem>
    <DetailItem label="postTemplate">{item.result.meta.common.postTemplate}</DetailItem>
    <DetailItem label="articleTemplate">{item.result.meta.common.articleTemplate}</DetailItem>
    <DetailItem label="contentLinks">{item.result.meta.common.contentLinks}</DetailItem>
    <DetailItem label="postFooter">{item.result.meta.common.postFooter}</DetailItem>
    <DetailItem label="articleFooter">{item.result.meta.common.articleFooter}</DetailItem>
    <DetailItem label="pubDateTime">{item.result.meta.common.pubDateTime}</DetailItem>
  {/if}

  {#if item.result.meta.telegram}
    <SectionHeader>{$t('sns.telegram')}</SectionHeader>
    <DetailItem label="preview">{item.result.meta.telegram.preview}</DetailItem>
    <DetailItem label="urlButton">{item.result.meta.telegram.urlButton}</DetailItem>
    <DetailItem label="autoRemove">{item.result.meta.telegram.autoRemove}</DetailItem>

    <DetailItem label="tags">{item.result.meta.telegram.tags?.join(', ')}</DetailItem>
    <DetailItem label="postTemplate">{item.result.meta.telegram.postTemplate}</DetailItem>
    <DetailItem label="articleTemplate">{item.result.meta.telegram.articleTemplate}</DetailItem>
    <DetailItem label="contentLinks">{item.result.meta.telegram.contentLinks}</DetailItem>
    <DetailItem label="postFooter">{item.result.meta.telegram.postFooter}</DetailItem>
    <DetailItem label="articleFooter">{item.result.meta.telegram.articleFooter}</DetailItem>
    <DetailItem label="pubDateTime">{item.result.meta.telegram.pubDateTime}</DetailItem>
  {/if}

  {#if item.result.meta.youtube}
    <SectionHeader>{$t('sns.youtube')}</SectionHeader>
    <DetailItem label="tags">{item.result.meta.youtube?.tags?.join(', ')}</DetailItem>
    <DetailItem label="template">{item.result.meta.youtube?.template}</DetailItem>
    <DetailItem label="contentLinks">{item.result.meta.youtube?.contentLinks}</DetailItem>
    <DetailItem label="footer">{item.result.meta.youtube?.footer}</DetailItem>
    <DetailItem label="pubDateTime">{item.result.meta.youtube?.pubDateTime}</DetailItem>
  {/if}

  {#if item.result.meta.podcast}
    <SectionHeader>podcast</SectionHeader>
    <DetailItem label="tags">{item.result.meta.podcast?.tags?.join(', ')}</DetailItem>
    <DetailItem label="template">{item.result.meta.podcast?.template}</DetailItem>
    <DetailItem label="contentLinks">{item.result.meta.podcast?.contentLinks}</DetailItem>
    <DetailItem label="footer">{item.result.meta.podcast?.footer}</DetailItem>
    <DetailItem label="pubDateTime">{item.result.meta.podcast?.pubDateTime}</DetailItem>
  {/if}

  {#if item.result.meta.dzen}
    <SectionHeader>{$t('sns.dzen')}</SectionHeader>
    <DetailItem label="template">{item.result.meta.dzen?.template}</DetailItem>
    <DetailItem label="footer">{item.result.meta.dzen?.footer}</DetailItem>
    <DetailItem label="pubDateTime">{item.result.meta.dzen?.pubDateTime}</DetailItem>
  {/if}

</div>
