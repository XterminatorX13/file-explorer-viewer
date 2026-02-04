<script lang="ts">
    import { layout } from "$lib/layout.svelte";
    import { tabState } from "$lib/tabs.svelte";
    import OmniBar from "$lib/components/OmniBar.svelte";
    import ViewOptions from "$lib/components/ViewOptions.svelte";
    import {
        PanelLeft,
        PanelRight,
        ChevronLeft,
        ChevronRight,
        ChevronUp,
        RefreshCw,
        RotateCw,
    } from "lucide-svelte";

    let { searchQuery = $bindable() } = $props<{ searchQuery: string }>();

    let omniBarRef: any = $state(null);

    const activeTab = $derived(tabState.activeTab);
</script>

<header class="topbar">
    <div class="topbar-left">
        <button
            class="btn-icon toggle-sidebar-btn"
            onclick={() => layout.toggleSidebar()}
            title="Toggle Sidebar (Ctrl+B)"
        >
            <PanelLeft size={20} />
        </button>

        <div class="nav-controls">
            <button
                class="btn-icon"
                onclick={() => tabState.goBack()}
                disabled={activeTab.historyIndex <= 0}
                title="Go Back (Alt+←)"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                class="btn-icon"
                onclick={() => tabState.goForward()}
                disabled={activeTab.historyIndex >=
                    activeTab.history.length - 1}
                title="Go Forward (Alt+→)"
            >
                <ChevronRight size={20} />
            </button>
            <button
                class="btn-icon"
                onclick={() => tabState.goUp()}
                disabled={activeTab.folder.path === "/" ||
                    !activeTab.folder.path}
                title="Go Up (Alt+↑)"
            >
                <ChevronUp size={20} />
            </button>

            <button
                class="btn-icon"
                onclick={() => tabState.loadFolder(activeTab.folder, true)}
                title="Refresh (Ctrl+R / F5)"
                disabled={tabState.isLoading}
            >
                <RefreshCw
                    size={20}
                    class={tabState.isLoading ? "spinning" : ""}
                />
            </button>
        </div>

        <!-- Unified OmniBar -->
        <OmniBar
            bind:this={omniBarRef}
            path={activeTab.folder.path}
            onNavigate={(path) =>
                tabState.loadFolder({ ...activeTab.folder, id: path, path })}
            onSearch={(query) => {
                searchQuery = query;
            }}
        />
    </div>

    <!-- Center is merged into left/main flow now, or we can remove this div if not needed -->
    <!-- <div class="topbar-center"></div> -->

    <div class="topbar-right">
        <div class="actions">
            {#if tabState.isLoading}
                <div class="loader"></div>
            {/if}

            <ViewOptions
                viewMode={activeTab.viewMode}
                iconSize={100}
                showHidden={false}
                sortBy="name"
                sortDirection="asc"
                onChangeView={(mode) => (activeTab.viewMode = mode)}
                onChangeSize={() => {}}
                onToggleHidden={() => {}}
                onSortChange={() => {}}
            />

            <div class="divider"></div>

            <button
                class="btn-icon"
                class:active={layout.showInspector}
                onclick={() => layout.toggleInspector()}
                title="Toggle Inspector (Ctrl+I)"
            >
                <PanelRight size={20} />
            </button>
        </div>
    </div>
</header>

<style>
    .topbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        border-bottom: 1px solid var(--border-color);
        background: rgba(13, 13, 13, 0.8);
        backdrop-filter: blur(24px);
        z-index: 10;
    }

    .topbar-left {
        display: flex;
        align-items: center;
        flex: 1; /* OmniBar takes available space */
    }

    .nav-controls {
        display: flex;
        gap: 4px;
        background: rgba(255, 255, 255, 0.05);
        padding: 2px;
        border-radius: var(--radius-md);
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin-right: 12px;
    }

    /* .topbar-center was removed/merged */

    .topbar-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 12px;
        min-width: 150px;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .btn-icon :global(.spinning) {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .loader {
        width: 16px;
        height: 16px;
        border: 2px solid var(--border-color);
        border-top-color: var(--accent-blue);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    .divider {
        width: 1px;
        height: 16px;
        background: var(--border-color);
        margin: 0 4px;
    }
</style>
