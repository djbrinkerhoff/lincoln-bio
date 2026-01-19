# Consider Simplifying Palette Source Picker

---
status: pending
priority: p3
issue_id: "005"
tags: [code-review, simplicity, ux]
dependencies: []
---

## Problem Statement

The palette source picker (~60 lines) allows users to generate palettes from a color different than their current accent. This feature may be over-engineered - users could simply set the accent color directly and palettes would update.

## Findings

**Location:** `components/theme-editor.tsx` (lines 154, 169, 209-268)

1. **Extra state** - `paletteSource` state variable
2. **Derived value** - `effectiveSource = paletteSource ?? accent`
3. **Full color picker UI** - 60 lines for this single feature
4. **"Use Primary" button** - Exists only because this feature created its own problem

**YAGNI concern:** Do users actually need to generate palettes from a color different than their accent?

## Proposed Solutions

### Option A: Remove palette source picker entirely
**Pros:** 60+ LOC removed, simpler UX, one less concept
**Cons:** Less flexibility (may not matter)
**Effort:** Small
**Risk:** Low

Just use `accent` directly:
```typescript
const palettes = useMemo(() => generatePalettes(accent), [accent]);
```

### Option B: Keep as-is
**Pros:** Feature exists for power users
**Cons:** Complexity for questionable value
**Effort:** None
**Risk:** None

### Option C: Simplify to button-only
**Pros:** Keeps feature, reduces UI
**Cons:** Still some complexity
**Effort:** Small
**Risk:** Low

Replace full picker with "Freeze palettes" toggle button.

## Recommended Action

Discuss with product/design whether this feature is needed. If not, implement Option A.

## Technical Details

**Affected files:**
- `components/theme-editor.tsx`

## Acceptance Criteria

- [ ] Decision made on feature value
- [ ] If removing: paletteSource state removed
- [ ] If removing: sourcePickerOpen state removed
- [ ] If removing: Palettes generate from accent directly
- [ ] Tests pass, functionality preserved

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Simplicity reviewer identified YAGNI |

## Resources

- YAGNI principle
- User feedback on feature usage
