// import { ScrollArea } from "../components/"
import type { Message } from "ai"
import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface ChatAreaProps {
    messages: Message[]
}

export default function ChatArea({ messages }: ChatAreaProps) {
    return (
        <div className="flex-1 p-4">
            <div className="space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`flex items-start space-x-2 ${message.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                                }`}
                        >
                            <div className={`p-2 rounded-full ${message.role === "user" ? "bg-primary" : "bg-muted"}`}>
                                {message.role === "user" ? (
                                    <User className="h-6 w-6 text-primary-foreground" />
                                ) : (
                                    <Bot className="h-6 w-6 text-foreground" />
                                )}
                            </div>
                            <div
                                className={`p-4 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                                    }`}
                            >
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || "")
                                            return !inline && match ? (
                                                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                                    {String(children).replace(/\n$/, "")}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        },
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

