import { MapPin, Share2, Bookmark, User } from "lucide-react"

export function MobileNavbar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t bg-background">
      <div className="mx-auto flex max-w-sm items-center justify-between px-6 py-2">
        <Tab icon={<MapPin size={36} strokeWidth={1.5} />} label="Lokasi" />
        <Tab icon={<Share2 size={36} strokeWidth={1.5} />} label="Rute" />
        <Tab icon={<Bookmark size={36} strokeWidth={1.5} />} label="Penanda" />
        <Tab icon={<User size={36} strokeWidth={1.5} />} label="Profil" />
      </div>
      <div className="h-4" />
    </nav>
  )
}

function Tab({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 text-xs text-foreground/70">
      {icon}
      <span>{label}</span>
    </button>
  )
}
