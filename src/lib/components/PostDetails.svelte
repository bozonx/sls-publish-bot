<script>
import DetailItem from '$lib/components/DetailItem.svelte'
import {t} from '$lib/store/t'

export let item
</script>

<div>
  <DetailItem label="fileName">{item.result.meta.fileName}</DetailItem>
  <DetailItem label={$t('details.title')}>{item.result.meta.title}</DetailItem>
  <DetailItem label="urlName">{item.result.meta.urlName}</DetailItem>
</div>
