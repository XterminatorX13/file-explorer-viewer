<script lang="ts">
    import { MOCK_SYSTEM_FOLDERS } from "$lib/mocks";
    import {
        Home,
        Search,
        ChevronRight,
        Folder,
        File,
        ArrowRight,
    } from "lucide-svelte";
    import { tick } from "svelte";

    let { path, onNavigate, onSearch } = $props<{
        path: string;
        onNavigate: (path: string) => void;
        onSearch: (query: string) => void;
    }>();

    let isEditing = $state(false);
    let inputValue = $state("");
    let inputRef = $state<HTMLInputElement | null>(null);
    let focusedIndex = $state(-1);

    // Suggestions logic
    const allSuggestions = [
        { name: "This PC", path: "root", icon: Home, type: "system" },
        ...MOCK_SYSTEM_FOLDERS.map((f) => ({
            name: f.name,
            path: f.path || f.id,
            icon: f.type === "folder" ? Folder : File,
            type: "folder",
        })),
    ];

    let suggestions = $derived(
        inputValue.length === 0
            ? allSuggestions
            : allSuggestions.filter(
                  (s) =>
                      s.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                      s.path.toLowerCase().includes(inputValue.toLowerCase()),
              ),
    );

    // Breadcrumbs logic
    const segments = $derived.by(() => {
        if (!path || path === "root") return [];
        return path
            .split(/[/\\]/)
            .filter(Boolean)
            .map((part: string, index: number, arr: string[]) => ({
                name: part,
                path: arr.slice(0, index + 1).join("/"),
            }));
    });

    function startEditing() {
        isEditing = true;
        inputValue = path === "root" ? "" : path;
        focusedIndex = -1;
        tick().then(() => inputRef?.select());
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            if (focusedIndex >= 0 && suggestions[focusedIndex]) {
                selectSuggestion(suggestions[focusedIndex]);
            } else {
                // If text looks like a path, navigate; otherwise search
                if (
                    inputValue.includes("/") ||
                    inputValue.includes("\\") ||
                    inputValue === "root"
                ) {
                    onNavigate(inputValue);
                } else {
                    onSearch(inputValue);
                }
                isEditing = false;
            }
        } else if (e.key === "Escape") {
            isEditing = false;
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            focusedIndex = (focusedIndex + 1) % suggestions.length;
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            focusedIndex =
                (focusedIndex - 1 + suggestions.length) % suggestions.length;
        }
    }

    function selectSuggestion(s: (typeof allSuggestions)[0]) {
        onNavigate(s.path);
        isEditing = false;
    }
</script>

<div class="omnibar-container" class:editing={isEditing}>
    {#if !isEditing}
        <!-- Breadcrumb Mode -->
        <div
            class="breadcrumbs"
            onclick={startEditing}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === "Enter" && startEditing()}
        >
            <button
                class="crumb-root"
                onclick={(e) => {
                    e.stopPropagation();
                    onNavigate("root");
                }}
            >
                <Home size={16} />
                <span class="sr-only">Home</span>
            </button>

            {#if segments.length > 0}
                <span class="separator"><ChevronRight size={14} /></span>
                {#each segments as seg, i}
                    <button
                        class="crumb"
                        onclick={(e) => {
                            e.stopPropagation();
                            onNavigate(seg.path);
                        }}
                    >
                        {seg.name}
                    </button>
                    {#if i < segments.length - 1}
                        <span class="separator"><ChevronRight size={14} /></span
                        >
                    {/if}
                {/each}
            {:else}
                <span class="crumb placeholder">This PC</span>
            {/if}
        </div>
        <button
            class="search-trigger"
            onclick={startEditing}
            aria-label="Search"
        >
            <Search size={16} />
        </button>
    {:else}
        <!-- Input Mode -->
        <div class="input-wrapper">
            <Search size={16} class="input-icon" />
            <input
                bind:this={inputRef}
                bind:value={inputValue}
                onkeydown={handleKeydown}
                onblur={() => setTimeout(() => (isEditing = false), 200)}
                placeholder="Search Nexus or type path..."
                class="omni-input"
            />
        </div>

        <!-- Dropdown Suggestions -->
        {#if suggestions.length > 0}
            <div class="suggestions-dropdown">
                {#each suggestions as s, i}
                    {@const Icon = s.icon}
                    <button
                        class="suggestion-item"
                        class:selected={i === focusedIndex}
                        onmousedown={() => selectSuggestion(s)}
                    >
                        <span class="s-icon"><Icon size={16} /></span>
                        <div class="s-info">
                            <span class="s-name">{s.name}</span>
                            <span class="s-path"
                                >{s.path === "root"
                                    ? "System Root"
                                    : s.path}</span
                            >
                        </div>
                        {#if i === focusedIndex}
                            <ArrowRight size={14} class="s-arrow" />
                        {/if}
                    </button>
                {/each}
            </div>
        {/if}
    {/if}
</div>

<style>
    .omnibar-container {
        flex: 1;
        height: 36px;
        background: var(--bg-secondary);
        border: 1px solid rgba(255, 255, 255, 0.08); /* Border color fallback */
        border-radius: 8px;
        display: flex;
        align-items: center;
        position: relative;
        transition: all 0.2s;
        max-width: 800px;
        margin: 0 12px;
    }

    .omnibar-container.editing {
        background: var(--bg-primary);
        border-color: var(--accent-blue);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    /* Breadcrumbs */
    .breadcrumbs {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 8px;
        height: 100%;
        cursor: text;
        overflow: hidden;
    }

    .crumb-root {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 4px;
        color: var(--text-secondary);
        transition: all 0.2s;
    }

    .crumb-root:hover,
    .crumb:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }

    .separator {
        color: var(--text-muted);
        opacity: 0.5;
        margin: 0 2px;
    }

    .crumb {
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
        padding: 2px 6px;
        border-radius: 4px;
        white-space: nowrap;
    }

    .crumb.placeholder {
        color: var(--text-muted);
        font-style: italic;
    }

    .search-trigger {
        padding: 0 10px;
        color: var(--text-muted);
        border-left: 1px solid rgba(255, 255, 255, 0.05);
        height: 60%;
        display: flex;
        align-items: center;
    }

    .search-trigger:hover {
        color: var(--text-primary);
    }

    /* Input Mode */
    .input-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 10px;
        gap: 8px;
    }

    /* .input-icon was unused or style applied directly to component if valid, removing for now to silence warning */

    .omni-input {
        flex: 1;
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-size: 13px;
        outline: none;
    }

    /* Suggestions */
    .suggestions-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 6px;
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 100;
        max-height: 300px;
        overflow-y: auto;
        padding: 4px;
    }

    .suggestion-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        border-radius: 6px;
        text-align: left;
        transition: all 0.1s;
        color: var(--text-secondary);
    }

    .suggestion-item:hover,
    .suggestion-item.selected {
        background: var(--accent-blue);
        color: white;
    }

    .suggestion-item.selected .s-path {
        color: rgba(255, 255, 255, 0.8);
    }

    .s-info {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .s-name {
        font-size: 13px;
        font-weight: 600;
    }

    .s-path {
        font-size: 11px;
        color: var(--text-muted);
    }
</style>
