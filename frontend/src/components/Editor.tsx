"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Toolbar } from '@mui/material';

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure()
    ],
    content: `
      <h2>Hello World! 🌍👋</h2>
      <p>This is a basic example of Tiptap.</p>
    `,
    editorProps: {
      attributes: {
        class: "prose max-w-none"
      }
    }
  })

  if (!editor) return null;

  return (
    <div className="flex flex-col justify-stretch min-h-[250px]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
