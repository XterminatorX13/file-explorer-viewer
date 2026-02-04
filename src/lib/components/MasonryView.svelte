<script lang="ts">
    import type { FileEntry } from "$lib/types";
    import { selection } from "$lib/selection.svelte";
    import { fade, scale } from "svelte/transition";
    import {
        Folder,
        File,
        HardDrive,
        Image as FileImage,
        Music,
        Video,
        Code,
        Archive,
        FileText,
    } from "lucide-svelte";

    let { files, onSelect, onDoubleSelect } = $props<{
        files: FileEntry[];
        onSelect: (file: FileEntry) => void;
        onDoubleSelect?: (file: FileEntry) => void;
    }>();

    // Icons and colors (same logic as FileGrid, but different layout)
    function getFileIcon(file: FileEntry) {
        if (file.type === "folder") return Folder;
        if (file.type === "disk") return HardDrive;
        const ext = file.extension.toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
            return FileImage;
        if (["mp4", "mov", "avi", "mkv"].includes(ext)) return Video;
        if (["mp3", "wav", "flac"].includes(ext)) return Music;
        if (["zip", "rar", "7z", "tar"].includes(ext)) return Archive;
        if (["js", "ts", "rs", "py", "html", "css", "svelte"].includes(ext))
            return Code;
        if (["pdf", "docx", "txt", "md"].includes(ext)) return FileText;
        return File;
    }

    function getIconColor(file: FileEntry) {
        if (file.type === "folder") return "var(--accent-blue)";
        if (file.type === "disk") return "var(--text-secondary)";
        const ext = file.extension.toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
            return "var(--accent-purple)";
        if (["mp4", "mov"].includes(ext)) return "var(--accent-red)";
        if (["js", "ts", "rs", "py"].includes(ext))
            return "var(--accent-green)";
        return "var(--text-muted)";
    }

    function handleItemClick(e: MouseEvent, file: FileEntry) {
        const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
        selection.toggle(file.id, isMulti);
        onSelect(file);
    }
</script>

<div class="masonry-container">
    {#each files as file (file.id)}
        {@const Icon = getFileIcon(file)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="masonry-item"
            class:selected={selection.isSelected(file.id)}
            onclick={(e) => handleItemClick(e, file)}
            ondblclick={() => onDoubleSelect?.(file)}
            in:fade={{ duration: 200 }}
        >
            <div class="visual-wrapper">
                <div class="icon-bg" style:color={getIconColor(file)}>
                    <Icon size={48} strokeWidth={1} />
                </div>

                {#if file.type === "folder"}
                    <div class="folder-corner"></div>
                {/if}

                <div class="selection-check">
                    <div class="circle"></div>
                </div>
            </div>

            <div class="item-overlay">
                <div class="item-name">{file.name}</div>
                <div class="item-type">
                    {file.extension.toUpperCase() ||
                        (file.type === "folder" ? "Folder" : "File")}
                </div>
            </div>
        </div>
    {/each}
</div>

<style>
    .masonry-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-auto-rows: 20px;
        gap: 16px;
        padding: 20px 0;
    }

    .masonry-item {
        grid-row-end: span 12; /* Default height for mock, would be dynamic with real thumbnails */
        position: relative;
        background: var(--bg-secondary);
        border-radius: var(--radius-xl);
        overflow: hidden;
        cursor: pointer;
        transition: all var(--transition-normal);
        border: 1px solid transparent;
    }

    /* Simulate dynamic heights for masonry feel */
    .masonry-item:nth-child(3n) {
        grid-row-end: span 15;
    }
    .masonry-item:nth-child(4n) {
        grid-row-end: span 10;
    }
    .masonry-item:nth-child(5n) {
        grid-row-end: span 18;
    }

    .masonry-item:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .masonry-item.selected {
        border-color: var(--accent-blue);
        box-shadow: 0 0 20px var(--accent-blue-glow);
    }

    .visual-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
        position: relative;
    }

    .icon-bg {
        opacity: 0.6;
        transition: transform var(--transition-normal);
    }

    .masonry-item:hover .icon-bg {
        transform: scale(1.1);
        opacity: 0.9;
    }

    .item-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px;
        background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 100%
        );
        opacity: 0;
        transition: opacity var(--transition-fast);
        pointer-events: none;
    }

    .masonry-item:hover .item-overlay,
    .masonry-item.selected .item-overlay {
        opacity: 1;
    }

    .item-name {
        font-size: 11px;
        font-weight: 600;
        color: white;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .item-type {
        font-size: 9px;
        color: var(--text-secondary);
        text-transform: uppercase;
        margin-top: 2px;
    }

    /* Selection Indicator */
    .selection-check {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1.5px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        background: rgba(0, 0, 0, 0.3);
        transition: all var(--transition-fast);
    }

    .masonry-item.selected .selection-check {
        opacity: 1;
        background: var(--accent-blue);
        border-color: var(--accent-blue);
    }

    .circle {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
        transform: scale(0);
        transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .masonry-item.selected .circle {
        transform: scale(1);
    }
</style>
