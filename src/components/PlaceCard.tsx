import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

type CardProps = {
  title: string
  rating: number
  description: string
  imageSrc?: string
  className?: string
}

export function PlaceCard({ title, rating, description, imageSrc, className }: CardProps) {
  return (
    <Card className={`w-[320px] p-3 ${className || ""}`}>
      <div className="flex gap-3">
        {/* image placeholder */}
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="h-16 w-16 rounded-md object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-md bg-muted" />
        )}

        <CardContent className="p-0">
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-foreground" />
            <span>{rating}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-foreground/80">{description}</p>
        </CardContent>
      </div>
    </Card>
  )
}