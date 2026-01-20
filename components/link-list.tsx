"use client"

import { Button } from "@/components/ui/button"
import { LinkEditor } from "@/components/link-editor"

interface Link {
  id: string
  title: string
  url: string
  isActive: boolean
}

interface LinkListProps {
  links: Link[]
  onChange: (links: Link[]) => void
  onAdd: () => void
  saving?: boolean
}

function moveLink(links: Link[], index: number, direction: "up" | "down"): Link[] {
  const newIndex = direction === "up" ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= links.length) return links

  const newLinks = [...links]
  ;[newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]]
  return newLinks
}

export function LinkList({ links, onChange, onAdd, saving }: LinkListProps) {
  const handleLinkChange = (index: number, updatedLink: Link) => {
    const newLinks = [...links]
    newLinks[index] = updatedLink
    onChange(newLinks)
  }

  const handleDelete = (index: number) => {
    onChange(links.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Links</h2>
        {saving && <span className="text-sm text-muted-foreground">Saving...</span>}
      </div>

      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={link.id} className="flex items-start gap-2">
            <div className="flex flex-col gap-1 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onChange(moveLink(links, i, "up"))}
                disabled={i === 0}
              >
                <span className="sr-only">Move up</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onChange(moveLink(links, i, "down"))}
                disabled={i === links.length - 1}
              >
                <span className="sr-only">Move down</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </Button>
            </div>
            <div className="flex-1">
              <LinkEditor
                link={link}
                onChange={(updated) => handleLinkChange(i, updated)}
                onDelete={() => handleDelete(i)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onAdd} className="w-full">
        Add link
      </Button>
    </div>
  )
}
