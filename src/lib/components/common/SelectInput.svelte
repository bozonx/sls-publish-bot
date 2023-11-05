<script>
  import { Label, Select } from 'flowbite-svelte';
  let selected;

  let countries = [
    { value: 'us', name: 'United States' },
    { value: 'ca', name: 'Canada' },
    { value: 'fr', name: 'France' }
  ];
</script>

<Label>
  Select an option
  <Select class="mt-2" items={countries} bind:value={selected} />
</Label>