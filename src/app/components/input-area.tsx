"use client"

import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface InputAreaProps {
    input: string
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function InputArea({ input, handleInputChange, handleSubmit }: InputAreaProps) {
    const [rows, setRows] = useState(1)

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleInputChange(e)
        const textareaLineHeight = 24
        const newRows = Math.min(5, Math.floor(e.target.scrollHeight / textareaLineHeight))
        setRows(newRows)
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex items-end space-x-2">
                <textarea
                    value={input}
                    onChange={handleTextareaChange}
                    placeholder="Type your message..."
                    className="flex-1 resize-none"
                    rows={rows}
                />
                <button type="submit" disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </form>
    )
}

