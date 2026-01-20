"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Link {
  id: string
  title: string
  url: string
  isActive: boolean
}

interface LinkEditorProps {
  link: Link
  onChange: (link: Link) => void
  onDelete: () => void
}

export function LinkEditor({ link, onChange, onDelete }: LinkEditorProps) {
  const handleChange = (field: keyof Link, value: string | boolean) => {
    onChange({ ...link, [field]: value })
  }

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${link.id}`}>Title</Label>
          <Input
            id={`title-${link.id}`}
            value={link.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Link title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`url-${link.id}`}>URL</Label>
          <Input
            id={`url-${link.id}`}
            type="url"
            value={link.url}
            onChange={(e) => handleChange("url", e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={link.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="rounded border-input"
            />
            <span className="text-sm">Active</span>
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
