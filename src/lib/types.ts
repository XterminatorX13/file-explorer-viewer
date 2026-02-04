export interface FileEntry {
    id: string;
    name: string;
    path: string;
    extension: string;
    size: number;
    modified: Date;
    type: 'file' | 'folder' | 'disk';
    tags: string[];
    children?: FileEntry[];
    color?: string;
    specialType?: 'home' | 'documents' | 'downloads' | 'pictures' | 'music' | 'videos' | 'desktop' | 'trash' | 'recents' | 'shared';
}

export interface Tab {
    id: string;
    name: string;
    folder: FileEntry;
    explorerFiles: FileEntry[];
    viewMode: 'grid' | 'list' | 'columns' | 'masonry';
    history: FileEntry[];
    historyIndex: number;
}
