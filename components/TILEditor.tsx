"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TIL } from "@/lib/db/schema";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

interface TILEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: ({ title, content }: TIL.Insert) => void;
  readOnly?: boolean;
}

export default function TILEditor({
  initialTitle,
  initialContent,
  onSave,
  readOnly = false,
}: TILEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent || "",
    immediatelyRender: false,
    editable: !readOnly,
  });
  const [title, setTitle] = useState(initialTitle || "");

  const handleSave = async () => {
    const content = JSON.stringify(editor?.getJSON());
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
        className="text-lg font-semibold"
      />
      <div className="min-h-[200px] border rounded-md p-4">
        <EditorContent editor={editor} />
      </div>
      {!readOnly && (
        <Button onClick={handleSave} className="w-full">
          Save TIL
        </Button>
      )}
    </div>
  );
}
