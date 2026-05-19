"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { useRef, useEffect } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

// ─── Custom Image with alignment support ─────────────────────────────────────

const AlignableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: "left",
        parseHTML: (el) => el.getAttribute("data-align") ?? "left",
        renderHTML: ({ align }) => {
          const style =
            align === "center" ? "display:block;margin-left:auto;margin-right:auto;" :
            align === "right"  ? "display:block;margin-left:auto;" : "";
          return { "data-align": align, style };
        },
      },
    };
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  bucket?: string;
}

// ─── Toolbar helpers ──────────────────────────────────────────────────────────

function Sep() {
  return <span className="mx-0.5 h-5 w-px bg-gray-200 shrink-0" />;
}

function ToolBtn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={[
        "flex h-7 min-w-7 items-center justify-center rounded px-1 text-sm transition",
        active ? "bg-[var(--color-primary)] text-white" : "text-gray-600 hover:bg-gray-100 disabled:opacity-40",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────

export function RichTextEditor({
  value, onChange, placeholder = "Escribe aquí...", bucket = "consejos",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, horizontalRule: {} }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
      Link.configure({ openOnClick: false }),
      AlignableImage.configure({ allowBase64: false, inline: false }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate({ editor }) { onChange(editor.getHTML()); },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[260px] px-4 py-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  async function handleImageFile(file: File) {
    if (uploadingRef.current || !editor) return;
    uploadingRef.current = true;
    try {
      const supabase = getBrowserSupabaseClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
      if (error) { alert(`Error al subir imagen: ${error.message}`); return; }
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (editor.chain().focus() as any).setImage({ src: urlData.publicUrl }).run();
    } finally { uploadingRef.current = false; }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    e.target.value = "";
  }

  // Detect if image node is selected
  const imageSelected = editor?.isActive("image") ?? false;
  const inTable = editor?.isActive("table") ?? false;

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">

      {/* ── Main toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-emerald-100 bg-gray-50 px-2 py-1.5">
        {/* History */}
        <ToolBtn title="Deshacer (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <i className="bi bi-arrow-counterclockwise" />
        </ToolBtn>
        <ToolBtn title="Rehacer (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <i className="bi bi-arrow-clockwise" />
        </ToolBtn>
        <Sep />

        {/* Text format */}
        <ToolBtn title="Negrita (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <i className="bi bi-type-bold" />
        </ToolBtn>
        <ToolBtn title="Cursiva (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i className="bi bi-type-italic" />
        </ToolBtn>
        <ToolBtn title="Subrayado (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <i className="bi bi-type-underline" />
        </ToolBtn>
        <ToolBtn title="Tachado" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <i className="bi bi-type-strikethrough" />
        </ToolBtn>
        <ToolBtn title="Código inline" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <i className="bi bi-code" />
        </ToolBtn>
        <Sep />

        {/* Headings */}
        <ToolBtn title="Título 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <span className="text-xs font-bold">H2</span>
        </ToolBtn>
        <ToolBtn title="Título 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <span className="text-xs font-bold">H3</span>
        </ToolBtn>
        <Sep />

        {/* Lists */}
        <ToolBtn title="Lista viñetas" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <i className="bi bi-list-ul" />
        </ToolBtn>
        <ToolBtn title="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <i className="bi bi-list-ol" />
        </ToolBtn>
        <ToolBtn title="Cita" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <i className="bi bi-quote" />
        </ToolBtn>
        <ToolBtn title="Bloque de código" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <i className="bi bi-braces" />
        </ToolBtn>
        <ToolBtn title="Separador horizontal" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <i className="bi bi-dash-lg" />
        </ToolBtn>
        <Sep />

        {/* Alignment */}
        <ToolBtn title="Alinear izquierda" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <i className="bi bi-text-left" />
        </ToolBtn>
        <ToolBtn title="Centrar" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <i className="bi bi-text-center" />
        </ToolBtn>
        <ToolBtn title="Alinear derecha" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <i className="bi bi-text-right" />
        </ToolBtn>
        <Sep />

        {/* Insert image */}
        <ToolBtn title="Insertar imagen" onClick={() => fileInputRef.current?.click()}>
          <i className="bi bi-image" />
        </ToolBtn>

        {/* Insert table */}
        <ToolBtn title="Insertar tabla 3×3" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <i className="bi bi-table" />
        </ToolBtn>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} onClick={(e) => e.stopPropagation()} />
      </div>

      {/* ── Contextual: image alignment ── */}
      {imageSelected && (
        <div className="flex items-center gap-1 border-b border-blue-100 bg-blue-50 px-3 py-1">
          <span className="mr-1 text-xs font-semibold text-blue-700">Imagen:</span>
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().updateAttributes("image", { align: a }).run();
              }}
              title={a === "left" ? "Izquierda" : a === "center" ? "Centrar" : "Derecha"}
              className={[
                "flex h-6 w-6 items-center justify-center rounded text-xs transition",
                (editor.getAttributes("image").align ?? "left") === a
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 hover:bg-blue-100",
              ].join(" ")}
            >
              <i className={`bi bi-align-${a === "center" ? "middle" : a}`} />
            </button>
          ))}
        </div>
      )}

      {/* ── Contextual: table controls ── */}
      {inTable && (
        <div className="flex flex-wrap items-center gap-1 border-b border-violet-100 bg-violet-50 px-3 py-1">
          <span className="mr-1 text-xs font-semibold text-violet-700">Tabla:</span>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowAfter().run(); }}
            className="rounded bg-white px-2 py-0.5 text-xs font-medium text-violet-700 shadow-sm hover:bg-violet-100">
            + Fila
          </button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnAfter().run(); }}
            className="rounded bg-white px-2 py-0.5 text-xs font-medium text-violet-700 shadow-sm hover:bg-violet-100">
            + Columna
          </button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteRow().run(); }}
            className="rounded bg-white px-2 py-0.5 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50">
            − Fila
          </button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteColumn().run(); }}
            className="rounded bg-white px-2 py-0.5 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50">
            − Columna
          </button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeaderRow().run(); }}
            className="rounded bg-white px-2 py-0.5 text-xs font-medium text-violet-700 shadow-sm hover:bg-violet-100">
            Cabecera
          </button>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteTable().run(); }}
            className="rounded bg-white px-2 py-0.5 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50">
            Eliminar tabla
          </button>
        </div>
      )}

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
