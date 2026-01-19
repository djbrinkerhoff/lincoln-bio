# Fix Timeout Cleanup Race Condition

---
status: pending
priority: p3
issue_id: "007"
tags: [code-review, react, bugs]
dependencies: []
---

## Problem Statement

The clipboard copy handler in ThemeEditor sets a timeout without cleanup, which could cause a state update on an unmounted component if the user navigates away quickly.

## Findings

**Location:** `components/theme-editor.tsx` (lines 174-178)

```typescript
const handleCopy = () => {
  navigator.clipboard.writeText(window.location.href);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);  // No cleanup
};
```

## Proposed Solutions

### Option A: Use ref for timeout cleanup (Recommended)
**Pros:** Proper React pattern, prevents memory leak
**Cons:** Slightly more code
**Effort:** Small
**Risk:** Low

```typescript
const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const handleCopy = () => {
  navigator.clipboard.writeText(window.location.href);
  setCopied(true);
  if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
  copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
};

useEffect(() => {
  return () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
  };
}, []);
```

## Recommended Action

Implement Option A.

## Technical Details

**Affected files:**
- `components/theme-editor.tsx`

## Acceptance Criteria

- [ ] Timeout ref tracks the timer
- [ ] Cleanup effect clears timeout on unmount
- [ ] No React warnings about state updates on unmounted components

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | TypeScript reviewer identified issue |

## Resources

- React useEffect cleanup patterns
