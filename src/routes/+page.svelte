<script lang="ts">
  import { onMount } from "svelte";
  import { listDrives } from "$lib/api";
  import { selection } from "$lib/selection.svelte";
  import { layout } from "$lib/layout.svelte";
  import { tabState } from "$lib/tabs.svelte";
  import { useKeyboardShortcuts } from "$lib/shortcuts.svelte";

  // Modular Components
  import TabBar from "$lib/components/TabBar.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import SidebarContainer from "$lib/components/SidebarContainer.svelte";
  import FilesArea from "$lib/components/FilesArea.svelte";
  import InspectorContainer from "$lib/components/InspectorContainer.svelte";
  import StatusBar from "$lib/components/StatusBar.svelte";
  import ActionBar from "$lib/components/ActionBar.svelte";

  import type { FileEntry } from "$lib/types";

  let driveList = $state<FileEntry[]>([]);
  let selectedFile = $state<FileEntry | null>(null);
  let searchQuery = $state("");

  // Keyboard Shortcuts Integration
  const handlers = {
    newTab: () => tabState.createTab(),
    closeTab: () => tabState.closeTab(tabState.activeTabId),
    nextTab: () => {
      const idx = tabState.tabs.findIndex((t) => t.id === tabState.activeTabId);
      tabState.activeTabId = tabState.tabs[(idx + 1) % tabState.tabs.length].id;
    },
    prevTab: () => {
      const idx = tabState.tabs.findIndex((t) => t.id === tabState.activeTabId);
      tabState.activeTabId =
        tabState.tabs[
          (idx - 1 + tabState.tabs.length) % tabState.tabs.length
        ].id;
    },
    goBack: () => tabState.goBack(),
    goForward: () => tabState.goForward(),
    goUp: () => tabState.goUp(),
    toggleSidebar: () => layout.toggleSidebar(),
    toggleInspector: () => layout.toggleInspector(),
    focusSearch: () => {},
    editPath: () => {},
    refresh: () => tabState.loadFolder(tabState.activeTab.folder, true),
    selectAll: () => {
      const ids = tabState.activeTab.explorerFiles.map((f) => f.id);
      selection.selectAll(ids);
    },
    deleteSelected: () => console.log("Delete not implemented"),
    renameSelected: () => console.log("Rename not implemented"),
  };

  useKeyboardShortcuts(handlers);

  onMount(async () => {
    try {
      driveList = await listDrives();
      if (driveList.length > 0) {
        tabState.loadFolder(driveList[0]);
      }
    } catch (e) {
      console.error("Failed to load drives:", e);
    }
  });

  async function handleDoubleSelect(file: FileEntry) {
    if (file.type === "folder") {
      await tabState.loadFolder(file);
    }
  }
</script>

<main class="app-container charcoal-theme">
  <!-- Layout Orchestration -->
  <TabBar bind:activeTabId={tabState.activeTabId} />
  <TopBar bind:searchQuery />

  <div class="content-area">
    <SidebarContainer {driveList} />

    <FilesArea
      {searchQuery}
      bind:selectedFile
      onDoubleSelect={handleDoubleSelect}
    />

    <InspectorContainer {selectedFile} />
  </div>

  <!-- Action Bars -->
  {#if selection.count > 0}
    <ActionBar
      onAction={(action, ids) => console.log("Action:", action, ids)}
    />
  {/if}

  <StatusBar />
</main>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
  }

  .content-area {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  :global(.charcoal-theme) {
    --bg-primary: #0d0d0d;
    --bg-secondary: #161616;
    --border-color: #2a2a2a;
  }
</style>
