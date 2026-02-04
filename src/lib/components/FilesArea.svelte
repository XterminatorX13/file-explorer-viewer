<script lang="ts">
    import { tabState } from "$lib/tabs.svelte";
    import FileGrid from "./FileGrid.svelte";
    import ColumnView from "./ColumnView.svelte";
    import MasonryView from "./MasonryView.svelte";
    import type { FileEntry } from "$lib/types";
    import { selection } from "$lib/selection.svelte";
    import {
        Layers,
        Clock,
        Image as FileImage,
        FileText,
        FileCode,
        Archive,
    } from "lucide-svelte";

    let {
        searchQuery = "",
        selectedFile = $bindable(),
        onDoubleSelect,
    } = $props<{
        searchQuery: string;
        selectedFile: FileEntry | null;
        onDoubleSelect: (file: FileEntry) => void;
    }>();

    const activeTab = $derived(tabState.activeTab);
    const filteredFiles = $derived(
        activeTab.explorerFiles.filter((f) =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );

    const filters = [
        { label: "All", icon: Layers },
        { label: "Recent", icon: Clock },
        { label: "Images", icon: FileImage },
        { label: "Documents", icon: FileText },
        { label: "Code", icon: FileCode },
        { label: "Archives", icon: Archive },
    ];

    let activeFilter = $state("All");
</script>

<div
    class="main-content-bg"
    role="main"
    onclick={(e) => {
        if (e.target === e.currentTarget) {
            selection.clear();
            selectedFile = null;
        }
    }}
    onkeydown={(e) => {
        if (e.target === e.currentTarget && e.key === "Escape") {
            selection.clear();
            selectedFile = null;
        }
    }}
    tabindex="-1"
>
    <!-- Filter Bar -->
    <div class="filter-bar">
        {#each filters as filter}
            <button
                class="filter-chip"
                class:active={activeFilter === filter.label}
                onclick={() => (activeFilter = filter.label)}
            >
                <filter.icon size={14} />
                {filter.label}
            </button>
        {/each}
    </div>

    <!-- Folder Header -->
    <header class="folder-header">
        <div class="folder-info">
            <h1>{activeTab.folder.name || "This PC"}</h1>
            <div class="folder-meta">
                <span>{filteredFiles.length} items</span>
                {#if selection.count > 0}
                    <span class="dot">•</span>
                    <span class="selected-count"
                        >{selection.count} selected</span
                    >
                {/if}
            </div>
        </div>
    </header>

    {#if tabState.isLoading}
        <div class="loading-overlay"><p>Loading files...</p></div>
    {/if}
    {#if activeTab.explorerFiles.length > 0}
        {#if activeTab.viewMode === "grid"}
            <FileGrid
                files={filteredFiles}
                onSelect={(f) => (selectedFile = f)}
                {onDoubleSelect}
            />
        {:else if activeTab.viewMode === "columns"}
            <ColumnView
                path={activeTab.folder.path}
                initialFiles={filteredFiles}
                onNavigate={(p) =>
                    tabState.loadFolder({
                        ...activeTab.folder,
                        id: p,
                        path: p,
                    })}
            />
        {:else if activeTab.viewMode === "masonry"}
            <MasonryView
                files={filteredFiles}
                onSelect={(f) => (selectedFile = f)}
                {onDoubleSelect}
            />
        {/if}
    {:else if !tabState.isLoading}
        <div class="empty-state">
            <span class="empty-icon">📂</span>
            <p>{searchQuery ? "No results found" : "Folder is empty"}</p>
        </div>
    {/if}

    <!-- Bottom Status Bar (Folder Summary) -->
    <div class="folder-status-bar">
        <div class="status-left">
            <span
                >{filteredFiles.filter((f) => f.type === "folder").length} folders</span
            >
            <span class="dot">•</span>
            <span
                >{filteredFiles.filter((f) => f.type === "file").length} files</span
            >
        </div>
        <div class="status-right">
            <span>Total Size: 0 B</span>
        </div>
    </div>
</div>

<style>
    .main-content-bg {
        flex: 1;
        overflow-y: auto;
        position: relative;
        padding: 20px 24px 80px;
        display: flex;
        flex-direction: column;
    }

    .filter-bar {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        flex-wrap: wrap;
    }

    .filter-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 99px;
        font-size: 11px;
        font-weight: 600;
        color: var(--text-secondary);
        transition: all 0.2s;
    }

    .filter-chip:hover {
        background: var(--bg-hover);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .filter-chip.active {
        background: var(--accent-blue);
        color: white;
        border-color: var(--accent-blue);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .folder-header {
        margin-bottom: 30px;
    }

    .folder-info h1 {
        font-size: 28px;
        font-weight: 750;
        letter-spacing: -0.02em;
        margin-bottom: 4px;
        color: var(--text-primary);
    }

    .folder-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--text-muted);
        font-weight: 500;
    }

    .dot {
        opacity: 0.3;
        margin: 0 4px;
    }

    .selected-count {
        color: var(--accent-blue);
        font-weight: 700;
    }

    .empty-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        opacity: 0.5;
        min-height: 200px;
    }

    .empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
    }

    .folder-status-bar {
        margin-top: auto;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        color: var(--text-muted);
        font-weight: 500;
    }

    .status-left {
        display: flex;
        align-items: center;
    }
    .loading-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
