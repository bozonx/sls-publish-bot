<script>
import DetailItem from '$lib/components/DetailItem.svelte'
import {t} from '$lib/store/t'

export let item
</script>

<div>
  <DetailItem label={$t('details.title')}>{item.title}</DetailItem>
  <DetailItem label={$t('details.lang')}>{item.lang}</DetailItem>
</div>
