<script lang="ts">
    import { layout } from "$lib/layout.svelte";
    import { tabState } from "$lib/tabs.svelte";
    import Inspector from "./Inspector.svelte";
    import type { FileEntry } from "$lib/types";

    let { selectedFile = null } = $props<{ selectedFile: FileEntry | null }>();
</script>

<!-- Resize Handle Right -->
{#if layout.showInspector}
    <div
        class="inspector-resize-handle"
        onmousedown={(e) => layout.startInspectorResize(e)}
    ></div>
{/if}

{#if layout.showInspector}
    <Inspector {selectedFile} onClose={() => layout.toggleInspector()} />
{/if}

<style>
    .inspector-resize-handle {
        width: 4px;
        cursor: col-resize;
        transition: background 0.2s;
        z-index: 30;
        margin-right: -2px;
    }

    .inspector-resize-handle:hover {
        background: var(--accent-blue);
        opacity: 0.5;
    }
</style>
