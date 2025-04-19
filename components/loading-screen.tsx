import { Icons } from "@/components/icons"

export function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <Icons.spinner className="h-12 w-12 animate-spin text-gray-500" />
        <h2 className="text-lg font-medium text-gray-700">Loading...</h2>
      </div>
    </div>
  )
}
