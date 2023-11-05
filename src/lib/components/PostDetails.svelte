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

  <SectionHeader>articleFooter</SectionHeader>
  <DetailItem label="common">{item.result.meta.articleFooter.common}</DetailItem>
  <DetailItem label="tg">{item.result.meta.articleFooter.tg}</DetailItem>
  <DetailItem label="dzen">{item.result.meta.articleFooter.dzen}</DetailItem>

  <SectionHeader>publication time</SectionHeader>
  <DetailItem label="common">{item.result.meta.publication.common}</DetailItem>
  <DetailItem label="tg">{item.result.meta.publication.tg}</DetailItem>
  <DetailItem label="dzen">{item.result.meta.publication.dzen}</DetailItem>
  <DetailItem label="podcast">{item.result.meta.publication.podcast}</DetailItem>
  <DetailItem label="youtube">{item.result.meta.publication.youtube}</DetailItem>

  <SectionHeader>tags</SectionHeader>
  <DetailItem label="common">{item.result.meta.tags.common.join(', ')}</DetailItem>
  <DetailItem label="tg">{item.result.meta.tags.tg.join(', ')}</DetailItem>
  <DetailItem label="insta">{item.result.meta.tags.insta.join(', ')}</DetailItem>
  <DetailItem label="podcast">{item.result.meta.tags.podcast.join(', ')}</DetailItem>
  <DetailItem label="youtube">{item.result.meta.tags.youtube.join(', ')}</DetailItem>

  <SectionHeader>tg</SectionHeader>
  <DetailItem label="preview">{item.result.meta.tg.preview}</DetailItem>
  <DetailItem label="urlButton">{item.result.meta.tg.urlButton}</DetailItem>
  <DetailItem label="autoRemove">{item.result.meta.tg.autoRemove}</DetailItem>
  <DetailItem label="postCustomFooter">{item.result.meta.tg.postCustomFooter}</DetailItem>
</div>
