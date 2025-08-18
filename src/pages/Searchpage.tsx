import React from "react";
import { useNavigate } from "react-router"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search, Home, Sun } from "lucide-react"

const HISTORY = ["Lorem", "Dolor", "Amet", "Ipsum", "Sit"]

const Searchpage: React.FC = () => {
    const navigate = useNavigate()
    return (
    	<div className="mx-auto h-screen max-w-sm p-4">
      		{/* Top bar */}
      		<div className="flex items-center gap-3">
        		<Button
		        	variant="ghost"
		        	size="icon"
		        	onClick={() => navigate(-1)}
		        	aria-label="Back"
		        	className="rounded-full"
		        >
          			<ArrowLeft className="h-5 w-5" />
        		</Button>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari"
            className="h-10 rounded-full pl-9 bg-muted"
            autoFocus
          />
        </div>
      </div>

      {/* History */}
      <section className="mt-5">
        <h2 className="text-sm font-medium text-foreground/80">History</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {HISTORY.map((tag) => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              className="h-8 rounded-full px-3"
            >
              {tag}
            </Button>
          ))}
        </div>
      </section>

      {/* Kategori */}
      <section className="mt-6">
        <h2 className="text-sm font-medium text-foreground/80">Kategori</h2>
        <div className="mt-3 grid grid-cols-2 gap-6">
          {/* Indoor */}
          <button className="flex flex-col items-center gap-1">
            <span className="rounded-xl border p-4">
              <Home className="h-7 w-7" />
            </span>
            <span className="text-xs text-foreground/70">indoor</span>
          </button>

          {/* Outdoor */}
          <button className="flex flex-col items-center gap-1">
            <span className="rounded-xl border p-4">
              <Sun className="h-7 w-7" />
            </span>
            <span className="text-xs text-foreground/70">outdoor</span>
          </button>
        </div>
      </section>

      <div className="h-8" />
    </div>
    )
}

export default Searchpage;