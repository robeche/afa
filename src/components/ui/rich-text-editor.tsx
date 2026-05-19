"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useEffect } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  bucket?: string;
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={[
        "flex h-7 w-7 items-center justify-center rounded text-sm transition",
        active
          ? "bg-[var(--color-primary)] text-white"
          : "text-gray-600 hover:bg-gray-100 disabled:opacity-40",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  bucket = "consejos",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[220px] px-4 py-3 focus:outline-none",
      },
    },
  });

  // Sync external value changes (e.g. when switching language tabs)
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
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });
      if (error) { alert(`Error al subir imagen: ${error.message}`); return; }
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
    } finally {
      uploadingRef.current = false;
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    e.target.value = "";
  }

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white focus-within:border-[var(--color-primary)] focus-within:ring-1 focus-within:ring-[var(--color-primary)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-emerald-100 bg-gray-50 px-2 py-1.5">
        {/* History */}
        <ToolBtn title="Deshacer" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <i className="bi bi-arrow-counterclockwise" />
        </ToolBtn>
        <ToolBtn title="Rehacer" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <i className="bi bi-arrow-clockwise" />
        </ToolBtn>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        {/* Text style */}
        <ToolBtn title="Negrita" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <i className="bi bi-type-bold" />
        </ToolBtn>
        <ToolBtn title="Cursiva" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i className="bi bi-type-italic" />
        </ToolBtn>
        <ToolBtn title="Subrayado" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <i className="bi bi-type-underline" />
        </ToolBtn>

        <span className="mx-1 h-5 w-px bg-gray-200" />

        {/* Headings */}
        <ToolBtn title="Título 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <span className="text-xs font-bold">H2</span>
        </ToolBtn>
        <ToolBtn title="Título 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <span className="text-xs font-bold">H3</span>
        </ToolBtn>

        <span className="mx-1 h-5 w-px bg-gray-200" />

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

        <span className="mx-1 h-5 w-px bg-gray-200" />

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

        <span className="mx-1 h-5 w-px bg-gray-200" />

        {/* Image upload */}
        <ToolBtn title="Insertar imagen" onClick={() => fileInputRef.current?.click()}>
          <i className="bi bi-image" />
        </ToolBtn>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  );
}
