<script lang="ts">
    import { tabState } from "$lib/tabs.svelte";
    import { selection } from "$lib/selection.svelte";

    const activeTab = $derived(tabState.activeTab);
</script>

<footer class="footer">
    <div class="footer-left">
        <span>{activeTab.explorerFiles.length} items</span>
        {#if selection.count > 0}
            <span class="selected">{selection.count} selected</span>
        {/if}
    </div>
    <div class="footer-right">Nexus Core</div>
</footer>

<style>
    .footer {
        height: 28px;
        background: #0d0d0d;
        border-top: 1px solid #2a2a2a;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        font-size: 11px;
        color: #666;
    }
    .selected {
        color: #3b82f6;
        margin-left: 10px;
    }
</style>
