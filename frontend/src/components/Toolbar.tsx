"use client"

import {type Editor } from "@tiptap/react"
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

type Props = {
  editor: Editor | null
}

export function Toolbar({ editor }: Props) {
  if (!editor) return null

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-300">
      <div className="flex space-x-2">
        <Bold
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="cursor-pointer"
        />
        <Italic
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="cursor-pointer"
        />
        <Strikethrough
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="cursor-pointer"
        />
        <List
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="cursor-pointer"
        />
        <ListOrdered
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="cursor-pointer"
        />
        <Heading2
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="cursor-pointer"
        />
      </div>
      <Toggle />
    </div>
  )
}