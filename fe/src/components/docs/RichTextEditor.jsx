"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
    Code,
    Table,
    Trash2,
} from 'lucide-react';
import { Table as TableExtension } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    const toggleClass = (isActive) =>
        `p-2 rounded-md transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
        }`;

    return (
        <div className="border border-border rounded-t-lg bg-card p-2 flex flex-wrap gap-1 sticky top-0 z-10 shadow-sm">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={toggleClass(editor.isActive('bold'))}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={toggleClass(editor.isActive('italic'))}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={toggleClass(editor.isActive('underline'))}
                title="Underline"
            >
                <UnderlineIcon className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={toggleClass(editor.isActive('strike'))}
                title="Strikethrough"
            >
                <Strikethrough className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={toggleClass(editor.isActive('code'))}
                title="Code"
            >
                <Code className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-border mx-1 my-auto" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={toggleClass(editor.isActive('heading', { level: 1 }))}
                title="Heading 1"
            >
                <Heading1 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={toggleClass(editor.isActive('heading', { level: 2 }))}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={toggleClass(editor.isActive('heading', { level: 3 }))}
                title="Heading 3"
            >
                <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-border mx-1 my-auto" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={toggleClass(editor.isActive('bulletList'))}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={toggleClass(editor.isActive('orderedList'))}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={toggleClass(editor.isActive('blockquote'))}
                title="Blockquote"
            >
                <Quote className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-border mx-1 my-auto" />

            <button
                type="button"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                className={toggleClass(editor.isActive('table'))}
                title="Insert Table"
            >
                <Table className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().deleteTable().run()}
                disabled={!editor.can().deleteTable()}
                className="p-2 rounded-md hover:bg-muted text-destructive disabled:opacity-50 transition-colors"
                title="Delete Table"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-border mx-1 my-auto" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-50 transition-colors"
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-50 transition-colors"
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function RichTextEditor({ content, onChange, editable = true }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TableExtension.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        immediatelyRender: false,
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                className: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-6 bg-background rounded-b-lg border border-t-0 border-border',
            },
        },
    });

    return (
        <div className="w-full flex flex-col shadow-sm">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="cursor-text" />
        </div>
    );
}
