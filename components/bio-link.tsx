import { cn } from "@/lib/utils"

interface BioLinkProps {
  title: string
  url: string
  isPreview?: boolean
}

export function BioLink({ title, url, isPreview }: BioLinkProps) {
  const Component = isPreview ? "div" : "a"
  const linkProps = isPreview
    ? {}
    : { href: url, target: "_blank", rel: "noopener noreferrer" }

  return (
    <Component
      {...linkProps}
      className={cn(
        "block w-full p-4 rounded-lg border border-border bg-card text-card-foreground",
        "text-center font-medium transition-colors",
        !isPreview && "hover:bg-accent hover:text-accent-foreground cursor-pointer"
      )}
    >
      {title}
    </Component>
  )
}
