import { SvelteSet } from 'svelte/reactivity';

export class SelectionState {
    #selectedIds = new SvelteSet<string>();

    get selectedIds() {
        return this.#selectedIds;
    }

    get count() {
        return this.#selectedIds.size;
    }

    isSelected(id: string) {
        return this.#selectedIds.has(id);
    }

    toggle(id: string, multi = false) {
        if (!multi) {
            if (this.#selectedIds.has(id) && this.#selectedIds.size === 1) {
                this.#selectedIds.clear();
            } else {
                this.#selectedIds.clear();
                this.#selectedIds.add(id);
            }
        } else {
            if (this.#selectedIds.has(id)) {
                this.#selectedIds.delete(id);
            } else {
                this.#selectedIds.add(id);
            }
        }
    }

    clear() {
        this.#selectedIds.clear();
    }

    selectAll(ids: string[]) {
        ids.forEach(id => this.#selectedIds.add(id));
    }
}

export const selection = new SelectionState();
