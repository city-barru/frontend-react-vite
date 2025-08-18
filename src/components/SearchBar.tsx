import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useNavigate } from "react-router"

export function SearchBar() {
  const navigate = useNavigate()

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Cari"
        className="h-10 rounded-full pl-9 bg-muted"
        onFocus={() => navigate("/search")}
        readOnly
      />
    </div>
  )
}
