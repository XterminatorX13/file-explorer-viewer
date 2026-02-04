<script lang="ts">
    import { layout } from "$lib/layout.svelte";
    import { tabState } from "$lib/tabs.svelte";
    import SidebarItem from "./SidebarItem.svelte";
    import { Layers, Clock, Image as FileImage } from "lucide-svelte";
    import type { FileEntry } from "$lib/types";

    let { driveList = [] } = $props<{ driveList: FileEntry[] }>();
</script>

<aside
    class="sidebar"
    style:width={layout.sidebarCollapsed ? "0" : `${layout.sidebarWidth}px`}
    style:opacity={layout.sidebarCollapsed ? "0" : "1"}
    style:pointer-events={layout.sidebarCollapsed ? "none" : "auto"}
>
    <div class="sidebar-header">
        <span class="logo-sparkle">✨</span>
        <span class="logo-text">Nexus</span>
    </div>
    <div class="sidebar-content">
        <div class="section">
            <h3 class="section-title">SMART VIEWS</h3>
            <button class="sidebar-item-btn">
                <span class="sidebar-icon"><Layers size={14} /></span>
                <span class="sidebar-label">All Files</span>
            </button>
            <button class="sidebar-item-btn">
                <span class="sidebar-icon"><Clock size={14} /></span>
                <span class="sidebar-label">Unsorted</span>
            </button>
            <button class="sidebar-item-btn">
                <span class="sidebar-icon"><FileImage size={14} /></span>
                <span class="sidebar-label">Untagged</span>
            </button>
        </div>

        <div class="section" style="margin-top: 16px;">
            <h3 class="section-title">FAVORITES</h3>
            <SidebarItem
                item={tabState.activeTab.folder}
                activeId={tabState.activeTab.folder.id}
                onSelect={(item) => tabState.loadFolder(item)}
            />
        </div>

        <div class="section" style="margin-top: 24px;">
            <h3 class="section-title">THIS PC</h3>
            {#each driveList as drive}
                <SidebarItem
                    item={drive}
                    activeId={tabState.activeTab.folder.id}
                    onSelect={(item) => tabState.loadFolder(item)}
                />
            {/each}
        </div>
    </div>
</aside>

<!-- Resize Handle Left -->
<div
    class="sidebar-resize-handle"
    role="separator"
    aria-orientation="vertical"
    class:active={false}
    onmousedown={(e) => layout.startSidebarResize(e)}
></div>

<style>
    .sidebar {
        background: var(--gradient-sidebar);
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        transition:
            width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.2s;
        overflow: hidden;
        z-index: 20;
    }

    .sidebar-header {
        height: var(--header-height);
        display: flex;
        align-items: center;
        padding: 0 20px;
        border-bottom: 1px solid var(--border-color);
        gap: 12px;
    }

    .logo-sparkle {
        font-size: 18px;
        filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
    }

    .logo-text {
        font-size: 18px;
        font-weight: 850;
        letter-spacing: -0.5px;
        background: linear-gradient(to right, #fff 0%, #a0a0a0 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .sidebar-content {
        padding: 20px 10px;
        overflow-y: auto;
    }

    .section-title {
        font-size: 10px;
        color: var(--text-muted);
        padding: 0 16px 10px;
        font-weight: 700;
        letter-spacing: 1px;
    }

    .sidebar-item-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        margin: 2px 8px;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        width: calc(100% - 16px);
        transition: all var(--transition-fast);
    }

    .sidebar-item-btn:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .sidebar-icon {
        display: flex;
        align-items: center;
        opacity: 0.7;
    }

    .sidebar-label {
        font-size: 13px;
        font-weight: 500;
    }

    .sidebar-resize-handle {
        width: 4px;
        cursor: col-resize;
        transition: background 0.2s;
        z-index: 30;
        margin-left: -2px;
    }

    .sidebar-resize-handle:hover {
        background: var(--accent-blue);
        opacity: 0.5;
    }
</style>
