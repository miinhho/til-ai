"use client";

import TILEditorToolbar from "@/components/til/TILEditorToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TIL } from "@/lib/db/schema";
import { EditorContent, useEditor } from "@tiptap/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { extensions } from "./editor-config";
import "./editor.css";

interface TILEditorProps {
  initialTitle?: string;
  /** HTML content stored in DB */
  initialContent?: string;
  onSave?: ({ title, content }: TIL.Create) => void;
  readOnly?: boolean;
  isSaving?: boolean;
}

export default function TILEditor({
  initialTitle,
  initialContent,
  onSave,
  readOnly = false,
  isSaving = false,
}: TILEditorProps) {
  const editor = useEditor(
    {
      extensions,
      content: initialContent || '""',
      editable: !readOnly,
      editorProps: {
        attributes: {
          class: "ProseMirror focus:outline-none",
          spellcheck: "true",
        },
      },
    },
    [extensions],
  );

  const [title, setTitle] = useState(initialTitle || "");

  const handleSave = async () => {
    if (!editor) return;
    const content = JSON.stringify(editor.getHTML());
    onSave?.({ title, content });
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Title"
        aria-label="Title"
        readOnly={readOnly}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="px-2 py-5 text-2xl font-semibold md:px-3 md:py-6 md:text-4xl"
      />
      {!readOnly && editor && <TILEditorToolbar editor={editor} />}
      <div className="border rounded-md">
        <EditorContent editor={editor} />
      </div>
      {!readOnly && (
        <Button onClick={handleSave} className="w-full" disabled={isSaving}>
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> 저장 중...
            </span>
          ) : (
            "Save TIL"
          )}
        </Button>
      )}
    </div>
  );
}
