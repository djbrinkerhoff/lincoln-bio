# Extract Mock Data from BioPreview

---
status: pending
priority: p3
issue_id: "006"
tags: [code-review, architecture, testing]
dependencies: []
---

## Problem Statement

Mock profile and links data is hardcoded inside `BioPreview` component, reducing testability and reusability. When real data integration happens, this will need to change anyway.

## Findings

**Location:** `components/bio-preview.tsx` (lines 5-16)

```typescript
const mockProfile = {
  name: 'Jane Creator',
  bio: 'Designer & Developer',
  avatar: null,
};

const mockLinks = [
  { id: '1', title: 'My Portfolio', url: '#', icon: 'globe' },
  // ...
];
```

## Proposed Solutions

### Option A: Accept as props with defaults (Recommended)
**Pros:** Testable, flexible, prepares for real data
**Cons:** Slightly more code
**Effort:** Small
**Risk:** Low

```typescript
interface BioPreviewProps {
  profile?: typeof defaultProfile;
  links?: typeof defaultLinks;
}

export function BioPreview({
  profile = defaultProfile,
  links = defaultLinks
}: BioPreviewProps) {
```

### Option B: Move to fixtures file
**Pros:** Cleaner component
**Cons:** Still hardcoded
**Effort:** Small
**Risk:** Low

## Recommended Action

Implement Option A.

## Technical Details

**Affected files:**
- `components/bio-preview.tsx`
- Optionally: `lib/mock-data.ts` (new)

## Acceptance Criteria

- [ ] BioPreview accepts profile and links as optional props
- [ ] Defaults exported for testing
- [ ] Component works the same without props
- [ ] Easy to pass real data when available

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Architecture review noted coupling |

## Resources

- React testing patterns
