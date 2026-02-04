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

    // Helper to pick the right icon
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
        if (["zip", "rar"].includes(ext)) return "var(--accent-orange)";

        return "var(--text-muted)";
    }

    function handleCardClick(e: MouseEvent, file: FileEntry) {
        if ((e.target as HTMLElement).closest(".checkbox-wrapper")) return;
        const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
        selection.toggle(file.id, isMulti);
        onSelect(file);
    }

    function toggleCheckbox(e: Event, id: string) {
        e.stopPropagation();
        selection.toggle(id, true);
    }

    function handleDoubleClick(e: MouseEvent, file: FileEntry) {
        e.stopPropagation();
        if (onDoubleSelect) onDoubleSelect(file);
    }
</script>

<div class="grid-container">
    {#each files as file (file.id)}
        {@const Icon = getFileIcon(file)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="file-card"
            class:selected={selection.isSelected(file.id)}
            onclick={(e) => handleCardClick(e, file)}
            ondblclick={(e) => handleDoubleClick(e, file)}
            in:scale={{ duration: 150, start: 0.98 }}
        >
            <div class="checkbox-wrapper">
                <input
                    type="checkbox"
                    checked={selection.isSelected(file.id)}
                    onchange={(e) => toggleCheckbox(e, file.id)}
                    class="file-checkbox"
                />
            </div>

            <div class="thumbnail-area">
                <div class="icon-container" style:color={getIconColor(file)}>
                    <Icon size={42} strokeWidth={1.5} />
                </div>

                {#if file.type === "folder"}
                    <div class="folder-badge"></div>
                {/if}
            </div>

            <div class="file-info">
                <span class="file-name">{file.name}</span>
                <span class="file-meta">
                    {file.type === "folder"
                        ? "Folder"
                        : file.extension.toUpperCase() || "File"}
                </span>
            </div>

            {#if file.tags.length > 0}
                <div class="tag-row">
                    {#each file.tags.slice(0, 3) as tag}
                        <span class="tag-indicator"></span>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 20px;
        padding: 20px 0;
    }

    .file-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid transparent;
        border-radius: var(--radius-xl);
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        cursor: pointer;
        transition: all var(--transition-normal);
        position: relative;
        user-select: none;
    }

    .file-card:hover {
        background: rgba(255, 255, 255, 0.07);
        transform: translateY(-2px);
    }

    .file-card.selected {
        background: rgba(75, 124, 243, 0.15);
        border-color: var(--accent-blue);
        box-shadow: 0 0 20px var(--accent-blue-glow);
    }

    /* Thumbnail / Icon Area */
    .thumbnail-area {
        aspect-ratio: 4/3;
        background: rgba(0, 0, 0, 0.2);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .icon-container {
        transition: transform var(--transition-normal);
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }

    .file-card:hover .icon-container {
        transform: scale(1.1);
    }

    /* Info */
    .file-info {
        display: flex;
        flex-direction: column;
        padding: 4px 2px;
    }

    .file-name {
        font-size: 12px;
        font-weight: 500;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .file-meta {
        font-size: 10px;
        color: var(--text-secondary);
        opacity: 0.7;
    }

    /* Checkbox */
    .checkbox-wrapper {
        position: absolute;
        top: 20px;
        left: 20px;
        opacity: 0;
        z-index: 10;
        transition: opacity var(--transition-fast);
        background: white;
        width: 18px;
        height: 18px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    .file-card:hover .checkbox-wrapper,
    .file-card.selected .checkbox-wrapper {
        opacity: 1;
    }

    .file-checkbox {
        width: 14px;
        height: 14px;
        cursor: pointer;
        accent-color: var(--accent-blue);
    }

    /* Tag Dots */
    .tag-row {
        position: absolute;
        bottom: 45px;
        right: 18px;
        display: flex;
        gap: 4px;
    }

    .tag-indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--accent-blue);
        border: 1px solid rgba(0, 0, 0, 0.3);
    }
</style>
