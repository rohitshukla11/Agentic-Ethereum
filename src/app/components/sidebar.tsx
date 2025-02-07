// import { Button } from "@/components/ui/button"
// import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Plus, Settings, X } from "lucide-react"

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                } md:relative md:translate-x-0`}
        >
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Conversations</h2>
                <button onClick={onClose} className="md:hidden">
                    <X className="h-6 w-6" />
                </button>
            </div>
            <div className="p-4">
                <button className="w-full justify-start" >
                    <Plus className="mr-2 h-4 w-4" /> New Chat
                </button>
            </div>
            <div className="flex-1 px-4">
                <div className="space-y-2">
                    <button className="w-full justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" /> Chat 1
                    </button>
                    <button className="w-full justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" /> Chat 2
                    </button>
                </div>
            </div>
            <div className="p-4 border-t">
                <button className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                </button>
            </div>
        </aside>
    )
}

