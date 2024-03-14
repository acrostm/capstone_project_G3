'use client'

import React, { useState } from 'react'
import Tiptap from '@/components/Tiptap'

const Editor = () => {
  const [content, setContent] = useState<string>('')
  const handleContentChange = (reason: any) => {
    setContent(reason)
  }

  const handleSubmit = (e: any) => {
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10"
    >
      <div className="text-3xl text-center text-black-300 mb-10">
        Create Article
      </div>
      <Tiptap
        content={content}
        onChange={(newContent: string) => handleContentChange(newContent)}
      />
    </form>
  )
}

export default Editor