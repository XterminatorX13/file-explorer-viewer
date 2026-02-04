<script lang="ts">
    import type { Tab } from "$lib/types";
    import { Plus, X, Folder } from "lucide-svelte";
    import { dndzone } from "svelte-dnd-action";
    import { flip } from "svelte/animate";

    let { tabs, activeTabId, onSelect, onClose, onAdd } = $props<{
        tabs: Tab[];
        activeTabId: string;
        onSelect: (id: string) => void;
        onClose: (id: string) => void;
        onAdd: () => void;
    }>();

    const flipDurationMs = 200;

    function handleDndConsider(e: CustomEvent<any>) {
        // Handle drag reordering if we want to be super premium
    }

    function handleDndFinalize(e: CustomEvent<any>) {
        // Finalize reordering
    }
</script>

<div class="tab-strip">
    <div class="tabs-scroll-container">
        {#each tabs as tab (tab.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="tab"
                class:active={tab.id === activeTabId}
                onclick={() => onSelect(tab.id)}
            >
                <span class="tab-icon">
                    <Folder
                        size={14}
                        fill={tab.id === activeTabId ? "currentColor" : "none"}
                    />
                </span>
                <span class="tab-name">{tab.name}</span>
                <button
                    class="tab-close"
                    onclick={(e) => {
                        e.stopPropagation();
                        onClose(tab.id);
                    }}
                    aria-label="Close tab"
                >
                    <X size={12} />
                </button>
                {#if tab.id === activeTabId}
                    <div class="active-indicator"></div>
                {/if}
            </div>
        {/each}
    </div>

    <button class="add-tab-btn" onclick={onAdd} aria-label="New tab">
        <Plus size={16} />
    </button>
</div>

<style>
    .tab-strip {
        height: 40px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        padding: 0 8px;
        gap: 4px;
        user-select: none;
        overflow: hidden;
    }

    .tabs-scroll-container {
        display: flex;
        align-items: flex-end;
        height: 100%;
        overflow-x: auto;
        gap: 2px;
        scrollbar-width: none;
    }

    .tabs-scroll-container::-webkit-scrollbar {
        display: none;
    }

    .tab {
        height: 34px;
        min-width: 120px;
        max-width: 200px;
        padding: 0 12px;
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-muted);
        font-size: 13px;
        font-weight: 500;
        border-radius: 8px 8px 0 0;
        position: relative;
        transition: all 0.2s;
        cursor: pointer;
        border: 1px solid transparent;
        border-bottom: none;
    }

    .tab:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-secondary);
    }

    .tab.active {
        background: var(--bg-primary);
        color: var(--text-primary);
        border-color: var(--border-color);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .tab-icon {
        display: flex;
        align-items: center;
        opacity: 0.7;
    }

    .tab.active .tab-icon {
        color: var(--accent-blue);
        opacity: 1;
    }

    .tab-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
    }

    .tab-close {
        width: 18px;
        height: 18px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.2s;
        color: var(--text-muted);
    }

    .tab:hover .tab-close,
    .tab.active .tab-close {
        opacity: 1;
    }

    .tab-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--accent-red);
    }

    .active-indicator {
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--bg-primary);
        z-index: 1;
    }

    .add-tab-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        color: var(--text-muted);
        transition: all 0.2s;
        flex-shrink: 0;
    }

    .add-tab-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }
</style>
