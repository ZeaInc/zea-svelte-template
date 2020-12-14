<style>
 .slot-container {
   height: calc(100% - 2px);
 }
</style>

<script>
  import { metatags } from '@roxi/routify'
  import Header from '../components/Header.svelte'

  metatags.title = 'Zea Template Collab'
  metatags.description = 'Description coming soon...'
</script>

<zea-layout orientation="vertical" cell-a-size="50" resize-cell-a="false" cell-b-size="100%" cell-c-size="0px" resize-cell-c="false">
  <div class="w-full slot-container" slot="a"><Header /></div>
  <zea-layout slot="b" cell-a-size="300px" cell-b-size="100%" cell-c-size="0px" resize-cell-c="false" >
    <div class="slot-container" slot="a">Sidebar</div>
    <div class="slot-container" slot="b">Renderer</div>
  </zea-layout>
</zea-layout>