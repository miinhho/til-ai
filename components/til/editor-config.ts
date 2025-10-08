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
import { generateHTML, generateJSON, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createLowlight } from "lowlight";

const lowlight = createLowlight();

export const extensions = [
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

export const getJsonFromTipTapHtml = (html: string) => {
  return generateJSON(html, extensions);
};

export const getHtmlFromTipTapJson = (json: JSONContent) => {
  return generateHTML(json, extensions);
};
