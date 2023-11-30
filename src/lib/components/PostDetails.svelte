<script>
import {arraySimilar} from "squidlet-lib";
import DetailItem from '$lib/components/DetailItem.svelte'
import {t} from '$lib/store/t'
import SectionHeader from "$lib/components/SectionHeader.svelte";
import CopyToClipboardButton from "$lib/components/common/CopyToClipboardButton.svelte";
import CodeBlock from "$lib/components/common/CodeBlock.svelte";
import {POST_TYPES, ALL_SNS} from "$lib/constants";

export let item

const meta = item.result.meta

</script>

<div>
  <DetailItem label="postId">{meta.postId}</DetailItem>
  <DetailItem label="urlName" unless={!meta.urlName}>{meta.urlName}</DetailItem>
  <DetailItem label={$t('details.title')} unless={!meta.title}>
    <div id="post-title">{meta.title}</div>
    <CopyToClipboardButton elementId="post-title">{$t('links.copyToClipboard')}</CopyToClipboardButton>
  </DetailItem>
  <DetailItem label={$t('details.type')} unless={!meta.type}>{$t(`postTypes.${meta.type}`)}</DetailItem>
  <DetailItem label={$t('details.descr')} unless={!meta.descr}>
    <div id="post-descr">{meta.descr}</div>
    <CopyToClipboardButton elementId="post-descr">{$t('links.copyToClipboard')}</CopyToClipboardButton>
  </DetailItem>
  <DetailItem label={$t('details.timeCodes')} unless={!meta.timeCodes}>
    <CodeBlock id="post-timecodes">{meta.timeCodes}</CodeBlock>
    <CopyToClipboardButton elementId="post-timecodes">{$t('links.copyToClipboard')}</CopyToClipboardButton>
  </DetailItem>
  <DetailItem label={$t('details.pubSns')} unless={!meta.sns}>{meta.sns?.join(', ')}</DetailItem>

  {#if meta.common}
    <SectionHeader>{$t('headers.forAllSn')}</SectionHeader>
    <DetailItem label={$t('details.tags')}>{meta.common.tags?.join(', ')}</DetailItem>
    <DetailItem label={$t('details.contentLinks')} unless={!meta.common.contentLinks}>{meta.common.contentLinks}</DetailItem>
    <DetailItem label={$t('details.pubDateTime')}>{meta.common.pubDateTime}</DetailItem>
  {/if}

  {#if meta.telegram && meta.sns?.includes(ALL_SNS.telegram)}
    <SectionHeader>{$t('sns.telegram')}</SectionHeader>
    <DetailItem label={$t('details.preview')} unless={!meta.telegram.preview}>{meta.telegram.preview}</DetailItem>
    <DetailItem label={$t('details.urlButton')} unless={!meta.telegram.useUrlButton}>{meta.telegram.urlButton?.text}, {meta.telegram.urlButton?.url}</DetailItem>
    <DetailItem label={$t('details.tags')}>{meta.telegram.tags?.join(', ')}</DetailItem>
    <DetailItem label={$t('details.pubDateTime')} unless={!meta.telegram.useCustomPubDate}>{meta.telegram.pubDateTime}</DetailItem>
    <DetailItem label={$t('details.autoRemove')} unless={!meta.telegram.useAutoRemove}>{meta.telegram.autoRemove}</DetailItem>
    <DetailItem label={$t('details.useCustomLinks')} unless={!meta.telegram.useCustomLinks}>
      <CodeBlock>{meta.telegram.contentLinks}</CodeBlock>
    </DetailItem>
    <DetailItem label={$t('details.template')} unless={!meta.telegram.useCustomTemplate}>
      <CodeBlock>{(meta.type === POST_TYPES.article) ? meta.telegram.articleTemplate : meta.telegram.postTemplate}</CodeBlock>
    </DetailItem>
    <DetailItem label={$t('details.footer')} unless={!meta.telegram.useCustomFooter}>
      <CodeBlock>{(meta.type === POST_TYPES.article) ? meta.telegram.articleFooter : meta.telegram.postFooter}</CodeBlock>
    </DetailItem>
  {/if}

  {#if meta.youtube && meta.sns?.includes(ALL_SNS.youtube)}
    <SectionHeader>{$t('sns.youtube')}</SectionHeader>
    <DetailItem label={$t('details.tags')}>{meta.youtube?.tags?.join(', ')}</DetailItem>
    <DetailItem label={$t('details.pubDateTime')} unless={!meta.youtube.useCustomPubDate}>{meta.youtube.pubDateTime}</DetailItem>
    <DetailItem label={$t('details.useCustomLinks')} unless={!meta.youtube.useCustomLinks}>
      <CodeBlock>{meta.youtube.contentLinks}</CodeBlock>
    </DetailItem>
    <DetailItem label={$t('details.template')} unless={!meta.youtube.useCustomTemplate}>
      <CodeBlock>{meta.youtube.template}</CodeBlock>
    </DetailItem>
    <DetailItem label={$t('details.footer')} unless={!meta.youtube.useCustomFooter}>
      <CodeBlock>{meta.youtube.footer}</CodeBlock>
    </DetailItem>
  {/if}

  {#if meta.dzen && meta.sns?.includes(ALL_SNS.dzen)}
    <SectionHeader
      unless={
        !meta.dzen.useCustomPubDate
        && !meta.dzen.useCustomTemplate
        && !meta.dzen.useCustomFooter
      }
    >{$t('sns.dzen')}</SectionHeader>
    <DetailItem label={$t('details.pubDateTime')} unless={!meta.dzen.useCustomPubDate}>{meta.youtube.pubDateTime}</DetailItem>
    <DetailItem label={$t('details.template')} unless={!meta.dzen.useCustomTemplate}>
      <CodeBlock>{meta.dzen.template}</CodeBlock>
    </DetailItem>
    <DetailItem label={$t('details.footer')} unless={!meta.dzen.useCustomFooter}>
      <CodeBlock>{meta.dzen.footer}</CodeBlock>
    </DetailItem>
  {/if}

  {#if meta.podcast && arraySimilar(meta.sns, [ALL_SNS.mave, ALL_SNS.spotifyForPodcasters]).length}
    <SectionHeader>Podcast</SectionHeader>
    <DetailItem label={$t('details.tags')}>{meta.podcast?.tags?.join(', ')}</DetailItem>
    <DetailItem label={$t('details.pubDateTime')} unless={!meta.podcast.useCustomPubDate}>{meta.youtube.pubDateTime}</DetailItem>
    <DetailItem label={$t('details.useCustomLinks')} unless={!meta.podcast.useCustomLinks}>
      <CodeBlock>{meta.podcast.contentLinks}</CodeBlock>
    </DetailItem>
    <DetailItem label={$t('details.template')} unless={!meta.podcast.useCustomTemplate}>
      <CodeBlock>{meta.podcast.template}</CodeBlock>
    </DetailItem>
    <DetailItem label={$t('details.footer')} unless={!meta.podcast.useCustomFooter}>
      <CodeBlock>{meta.podcast.footer}</CodeBlock>
    </DetailItem>
  {/if}

</div>
