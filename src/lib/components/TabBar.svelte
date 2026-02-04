<script lang="ts">
    import { tabState } from "$lib/tabs.svelte";
    import { Folder, X, Plus } from "lucide-svelte";

    let { activeTabId = $bindable() } = $props<{ activeTabId: string }>();
</script>

<div class="nav-tabs">
    <div class="tabs-scroll">
        {#each tabState.tabs as tab (tab.id)}
            <div
                class="tab"
                class:active={activeTabId === tab.id}
                onclick={() => (activeTabId = tab.id)}
                role="tab"
                aria-selected={activeTabId === tab.id}
                tabindex="0"
                onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                        activeTabId = tab.id;
                }}
            >
                <span class="tab-icon"><Folder size={12} /></span>
                <span class="tab-name"
                    >{tab.name === "root" ? "This PC" : tab.name}</span
                >
                <button
                    class="tab-close"
                    onclick={(e) => {
                        e.stopPropagation();
                        tabState.closeTab(tab.id);
                    }}
                    aria-label="Close tab"
                >
                    <X size={12} />
                </button>
            </div>
        {/each}
    </div>
    <button class="add-tab" onclick={() => tabState.createTab()}>
        <Plus size={16} />
    </button>
</div>

<style>
    .nav-tabs {
        height: 36px;
        background: #080808;
        display: flex;
        align-items: flex-end;
        padding-left: 10px;
        border-bottom: 1px solid var(--border-color);
    }

    .tabs-scroll {
        display: flex;
        flex: 1;
        overflow-x: auto;
        gap: 2px;
    }

    .tab {
        min-width: 140px;
        max-width: 200px;
        height: 30px;
        background: #121212;
        border: 1px solid var(--border-color);
        border-bottom: none;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        gap: 8px;
        cursor: pointer;
        color: var(--text-muted);
        font-size: 11px;
        font-weight: 500;
        transition: all 0.2s;
        margin-bottom: -1px;
    }

    .tab.active {
        background: var(--bg-secondary);
        color: var(--text-primary);
        height: 32px;
        z-index: 1;
    }

    .tab-close {
        opacity: 0;
        padding: 2px;
    }

    .tab:hover .tab-close {
        opacity: 0.6;
    }
</style>
