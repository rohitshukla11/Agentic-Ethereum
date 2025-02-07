"use client"

import { useState } from "react"
import { useChat } from "ai/react"
import Sidebar from "../components/sidebar"
import ChatArea from "../components/chat-area"
import InputArea from "../components/input-area"
// import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Chat() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { messages, input, handleInputChange, handleSubmit } = useChat()

    return (
        <>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex flex-col w-full">
                <header className="flex items-center justify-between p-4 border-b">
                    <button onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold">AI Assistant</h1>
                    <div className="w-6" /> {/* Placeholder for symmetry */}
                </header>
                <ChatArea messages={messages} />
                <InputArea input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
            </div>
        </>
    )
}

