<script>
import DetailItem from '$lib/components/DetailItem.svelte'
import {t} from '$lib/store/t'
let className = ''


export { className as class }
export let item
</script>

<div class={className}>
  <DetailItem label={$t('details.title')}>{item.title}</DetailItem>
  <DetailItem label={$t('details.lang')}>{item.lang}</DetailItem>
</div>
