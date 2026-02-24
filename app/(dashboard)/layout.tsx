import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "../../components/app-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="relative flex w-full flex-col">
                <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                    <SidebarTrigger />
                </div>
                <div className="flex-1 p-4 md:p-6 pb-12 w-full max-w-5xl mx-auto flex">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
