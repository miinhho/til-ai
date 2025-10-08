"use client";

import TILEditorToolbar from "@/components/TILEditorToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TIL } from "@/lib/db/schema";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import { Heading } from "@tiptap/extension-heading";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createLowlight } from "lowlight";
import { useState } from "react";
import "./editor.css";

interface TILEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: ({ title, content }: TIL.Insert) => void;
  readOnly?: boolean;
}

const lowlight = createLowlight();
const extensions = [
  StarterKit.configure({
    blockquote: false,
    bulletList: false,
    codeBlock: false,
    heading: false,
    listItem: false,
    orderedList: false,
  }),
  Heading.configure({
    levels: [1, 2, 3],
  }),
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Image.configure({
    HTMLAttributes: {
      class: "rounded-md border",
    },
  }),
  Link.configure({
    autolink: true,
    linkOnPaste: true,
    openOnClick: false,
  }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
];

export default function TILEditor({
  initialTitle,
  initialContent,
  onSave,
  readOnly = false,
}: TILEditorProps) {
  const editor = useEditor(
    {
      extensions,
      content: JSON.parse(initialContent || '""'),
      immediatelyRender: false,
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
    const content = JSON.stringify(editor.getJSON());
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
        <Button onClick={handleSave} className="w-full">
          Save TIL
        </Button>
      )}
    </div>
  );
}
