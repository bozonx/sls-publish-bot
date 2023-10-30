<script>
import AppConfigForm from '$lib/components/AppConfigForm.svelte'
import {breadcrumbs} from '$lib/store/breadcrumbs'


breadcrumbs.set([{title: 'config'}])
</script>

<div>
  <AppConfigForm />
</div>
