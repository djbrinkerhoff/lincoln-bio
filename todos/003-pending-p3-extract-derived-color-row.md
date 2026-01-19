# Extract DerivedColorRow Component

---
status: pending
priority: p3
issue_id: "003"
tags: [code-review, architecture, maintainability]
dependencies: []
---

## Problem Statement

The `DerivedColorRow` component (130 lines) is defined inside `theme-editor.tsx` rather than as a separate file. This reduces testability, makes the main file harder to navigate, and prevents reuse.

## Findings

**Location:** `components/theme-editor.tsx` (lines 9-148)

1. **Large embedded component** - 130 lines with three distinct UI states
2. **Unused prop** - `colorKey` is defined but never used (line 11)
3. **Tight coupling** - Could be more reusable if extracted

## Proposed Solutions

### Option A: Extract to separate file (Recommended)
**Pros:** Better organization, testable, reusable
**Cons:** One more file
**Effort:** Small
**Risk:** Low

Create `components/derived-color-row.tsx`

### Option B: Keep inline but simplify
**Pros:** Fewer files
**Cons:** Still large theme-editor.tsx
**Effort:** Small
**Risk:** Low

Remove unused `colorKey` prop, simplify UI states.

## Recommended Action

Implement Option A - Extract to separate file.

## Technical Details

**Affected files:**
- `components/theme-editor.tsx` (remove embedded component)
- `components/derived-color-row.tsx` (new file)

## Acceptance Criteria

- [ ] DerivedColorRow in separate file
- [ ] Unused colorKey prop removed
- [ ] Component exports proper TypeScript types
- [ ] theme-editor.tsx imports and uses extracted component
- [ ] All functionality preserved

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Architecture review identified coupling |

## Resources

- React component organization best practices
