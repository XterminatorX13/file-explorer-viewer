# 🗺️ Nexus Explorer Roadmap

**PROJECT**: Nexus Explorer  
**GOAL**: Create the most high-performance, visually stunning file explorer for Windows using Tauri 2.0 & Svelte 5.

---

## 📦 Recomendações de Bibliotecas

Para elevar o Nexus ao nível "FilePilot" e além, aqui estão as libs que recomendo:

### 🎨 Frontend (Svelte 5 / JS / TS)

| Biblioteca | Por que usar? | Status |
| :--- | :--- | :--- |
| **`bits-ui`** | Componentes "headless" (Dropdowns, Dialogs) perfeitos para Svelte 5. | 🚀 Recomendado |
| **`clsx` & `tailwind-merge`** | Se decidirmos usar Tailwind, são essenciais para gerenciar classes. | 🛠️ Opcional |
| **`fuzzysort`** | Busca instantânea no frontend com algoritmo de fuzzy search. | ✨ Recomendado |
| **`date-fns`** | Manipulação de datas (ex: "há 2 minutos") de forma leve. | ✅ Recomendado |
| **`nanoid`** | Geração de IDs curtos e únicos para abas e seleções temporárias. | ✅ Útil |

### 🦀 Backend (Rust / Tauri)

| Crate | Por que usar? | Status |
| :--- | :--- | :--- |
| **`tauri-plugin-fs`** | Plugin oficial para acesso seguro e performático ao sistema de arquivos. | 🛡️ **Essencial** |
| **`tauri-plugin-shell`** | Para abrir arquivos no app padrão do sistema (já temos o opener, mas este é mais completo). | ✅ Recomendado |
| **`sysinfo`** | Pegar uso de CPU/RAM e informações reais de discos/partições. | 📊 Recomendado |
| **`infer`** | Identificar tipos de arquivos por "magic bytes" (não apenas extensão). | 🔍 Recomendado |
| **`image`** | Gerar thumbnails/miniaturas de imagens de forma ultra rápida no Rust. | 🖼️ Recomendado |

---

## 🚀 Próximos Passos (Phases)

### ✅ Phase 1: Modularização (CONCLUÍDO)

- Separação de lógica em Runes (`layout.svelte.ts`, `tabs.svelte.ts`).
- Componentização da UI (`Sidebar`, `TopBar`, `FilesArea`, `Inspector`).

### 🛠️ Phase 2: Integração de Sistema (Em Breve)

- [ ] Implementar `tauri-plugin-fs` para listar arquivos reais.
- [ ] Criar sistema de Thumbnails no Rust para não travar a UI.
- [ ] Lógica de Lixeira (Trash) e Favoritos persistentes.

### ✨ Phase 3: Visual Polish & UX

- [ ] Implementar `bits-ui` para context menus (botão direito) luxuosos.
- [ ] Adicionar animações de transição entre pastas (Layout Transitions).
- [ ] Tema dinâmico baseado no Wallpaper do Windows (Acrylic/Mica feel).

---

> [!TIP]
> **Dica de Performance**: Para o Nexus ser "instantâneo", o segredo é o Rust fazer o trabalho pesado (thumbnails, busca) e o Svelte 5 apenas renderizar o que está visível usando o virtual scroll.
