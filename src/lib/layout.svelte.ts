export class LayoutState {
    sidebarWidth = $state(260);
    inspectorWidth = $state(320);
    sidebarCollapsed = $state(false);
    showInspector = $state(true);

    // Private resizing state
    #resizingSidebar = $state(false);
    #resizingInspector = $state(false);
    #startX = 0;
    #startWidth = 0;

    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    toggleInspector() {
        this.showInspector = !this.showInspector;
    }

    startSidebarResize(e: MouseEvent) {
        if (this.sidebarCollapsed) return;
        this.#resizingSidebar = true;
        this.#startX = e.clientX;
        this.#startWidth = this.sidebarWidth;
        this.#setupListeners();
    }

    startInspectorResize(e: MouseEvent) {
        if (!this.showInspector) return;
        this.#resizingInspector = true;
        this.#startX = e.clientX;
        this.#startWidth = this.inspectorWidth;
        this.#setupListeners();
    }

    #setupListeners() {
        const handleMouseMove = (e: MouseEvent) => {
            if (this.#resizingSidebar) {
                const delta = e.clientX - this.#startX;
                this.sidebarWidth = Math.max(180, Math.min(450, this.#startWidth + delta));
            } else if (this.#resizingInspector) {
                const delta = this.#startX - e.clientX;
                this.inspectorWidth = Math.max(250, Math.min(600, this.#startWidth + delta));
            }
        };

        const handleMouseUp = () => {
            this.#resizingSidebar = false;
            this.#resizingInspector = false;
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }
}

export const layout = new LayoutState();
