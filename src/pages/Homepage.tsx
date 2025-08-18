import React from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"
import { PlaceCard } from "@/components/PlaceCard"
import { MobileNavbar } from "@/components/MobileNavbar"

function Homepage() {
  const navigate = useNavigate()

  const rekomendasi = [
    { title: "Gedung Sate", rating: 4.7, description: "Gedung Sate adalah sebuah bangunan bersejarah di Bandung yang..." },
    { title: "Alun-Alun", rating: 4.6, description: "Ruang publik populer untuk bersantai dan berfoto." },
  ]
  const paket = [
    { title: "Paket Kota Bandung", rating: 4.5, description: "Paket keliling kota Bandung dari jam 7 pagi sampai 1 siang..." },
    { title: "Paket Kuliner", rating: 4.4, description: "Jelajah kuliner legendaris dan hits dalam satu hari." },
  ]

  return (
    <div className="mx-auto min-h-screen max-w-sm pb-20 px-4 pt-4">
      <div className="flex items-center">
        <Button variant="outline" className="rounded-full h-8 px-3 gap-1">
          Bandung <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <h1 className="mt-4 text-xl font-semibold">Mau kemana hari ini?</h1>

      <div className="relative mt-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari"
          className="h-10 rounded-full pl-9 bg-muted"
          readOnly
          onFocus={() => navigate("/search")}
          onClick={() => navigate("/search")}
        />
      </div>

      {/* Rekomendasi */}
      <SectionTitle className="mt-6">Rekomendasi</SectionTitle>
      <HorizontalList>
        {rekomendasi.map((item) => (
          <PlaceCard key={item.title} {...item} />
        ))}
      </HorizontalList>

      {/* Paket */}
      <SectionTitle className="mt-4">Paket</SectionTitle>
      <HorizontalList>
        {paket.map((item) => (
          <PlaceCard key={item.title} {...item} />
        ))}
      </HorizontalList>

      <MobileNavbar />
      
    </div>
  )
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-base font-semibold ${className}`}>{children}</h2>
}

function HorizontalList({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 -mx-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 px-4 pb-2 snap-x snap-mandatory ">
        {React.Children.map(children, (child) => (
          <div className="snap-start">{child}</div>
        ))}
      </div>
    </div>
  )
}

export default Homepage;