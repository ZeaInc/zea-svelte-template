<script>
  // To enable Auth0 based Authentication, enable this
  // All the parts for Auth0 based authentication are provided.
  const authenticated = false
</script>

{#if authenticated}
  <LayoutProtected>
    <div class="h-full bg-background text-foreground">
      <slot />
    </div>
  </LayoutProtected>

  <div class="h-full bg-background text-foreground">
    <slot />
  </div>
{:else}
  <script>
    import LayoutProtected from '../layouts/LayoutProtected.svelte'
  </script>
{/if}
