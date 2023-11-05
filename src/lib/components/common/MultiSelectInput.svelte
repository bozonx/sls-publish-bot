<script>
  import { MultiSelect } from 'flowbite-svelte';

  let selected = [];
  let countries = [
    { value: 'us', name: 'United States' },
    { value: 'ca', name: 'Canada' },
    { value: 'fr', name: 'France' },
    { value: 'jp', name: 'Japan' },
    { value: 'en', name: 'England' }
  ];
</script>

<MultiSelect items={countries} bind:value={selected} />