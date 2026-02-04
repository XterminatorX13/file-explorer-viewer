<script lang="ts">
    import { slide } from "svelte/transition";
    import {
        ChevronRight,
        Folder,
        FileText,
        Home,
        Download,
        Image,
        Music,
        Video,
        FileCode,
        Monitor,
        HardDrive,
    } from "lucide-svelte";
    import SidebarItem from "./SidebarItem.svelte";
    import type { FileEntry } from "$lib/types";

    let { item, onSelect, activeId } = $props<{
        item: FileEntry;
        onSelect: (item: FileEntry) => void;
        activeId: string | null;
    }>();

    let expanded = $state(false);
    let isActive = $derived(activeId === item.id);

    // Colorful icon mapping based on specialType or fallback to name
    const typeMap: Record<string, { icon: any; color: string }> = {
        home: { icon: Home, color: "#3b82f6" },
        documents: { icon: FileText, color: "#a855f7" },
        downloads: { icon: Download, color: "#22c55e" },
        pictures: { icon: Image, color: "#f59e0b" },
        music: { icon: Music, color: "#ec4899" },
        videos: { icon: Video, color: "#ef4444" },
        desktop: { icon: Monitor, color: "#06b6d4" },
        recents: { icon: FileCode, color: "#8b5cf6" },
        shared: { icon: HardDrive, color: "#64748b" },
        trash: { icon: HardDrive, color: "#94a3b8" }, // Generic for now
    };

    const folderInfo = $derived(
        (item.specialType && typeMap[item.specialType]) ||
            typeMap[item.name.toLowerCase()] ||
            null,
    );
    const FolderIcon = $derived(folderInfo?.icon || Folder);
    const iconColor = $derived(
        isActive
            ? "var(--accent-blue)"
            : folderInfo?.color || "var(--text-muted)",
    );

    function toggle(e: MouseEvent) {
        e.stopPropagation();
        if (item.type === "folder") {
            expanded = !expanded;
        }
        onSelect(item);
    }
</script>

<div class="sidebar-item">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="row" class:active={isActive} onclick={toggle}>
        {#if item.type === "folder"}
            <span class="chevron" class:expanded>
                <ChevronRight size={14} />
            </span>
        {/if}
        <span class="icon" style:color={iconColor}>
            {#if item.type === "folder"}
                {@const Icon = FolderIcon}
                <Icon size={16} />
            {:else}
                <FileText size={16} />
            {/if}
        </span>
        <span class="label">{item.name}</span>
        {#if item.children && item.children.length > 0}
            <span class="badge">{item.children.length}</span>
        {/if}
    </div>

    {#if expanded && item.children}
        <div class="children" transition:slide={{ duration: 200 }}>
            {#each item.children as child (child.id)}
                <SidebarItem item={child} {onSelect} {activeId} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .row {
        display: flex;
        align-items: center;
        padding: 6px 10px;
        margin: 2px 8px;
        cursor: pointer;
        border-radius: var(--radius-md);
        color: var(--text-secondary);
        transition: all 0.2s;
        gap: 2px;
    }

    .row:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .row.active {
        background: var(--bg-active);
        color: var(--text-primary);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .chevron {
        display: flex;
        align-items: center;
        width: 16px;
        transition: transform 0.2s;
        opacity: 0.5;
    }

    .chevron.expanded {
        transform: rotate(90deg);
    }

    .icon {
        display: flex;
        align-items: center;
        padding: 0 4px;
        opacity: 0.9;
    }

    .label {
        font-size: 13px;
        font-weight: 500;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .badge {
        font-size: 10px;
        background: rgba(255, 255, 255, 0.05);
        padding: 2px 6px;
        border-radius: 4px;
        opacity: 0.7;
        color: var(--text-muted);
    }

    .children {
        padding-left: 12px;
        margin-left: 16px;
    }
</style>
