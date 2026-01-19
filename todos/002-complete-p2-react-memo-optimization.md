# React Memo Optimization

---
status: pending
priority: p2
issue_id: "002"
tags: [code-review, performance, react]
dependencies: []
---

## Problem Statement

Components lack `React.memo` wrapping and inline callbacks create new function references on every render. During color picker drag operations (60+ changes/second), this causes excessive re-renders throughout the component tree.

## Findings

**Locations:**
- `components/theme-editor.tsx` - DerivedColorRow, inline callbacks
- `components/color-input.tsx` - no memoization

1. **Inline arrow functions** create new references every render:
   ```typescript
   <DerivedColorRow
     onOverride={(value) => setOverride('card', value)}  // New function each render
   />
   ```

2. **Missing React.memo** on frequently-rendered components:
   - `DerivedColorRow` (130 lines, complex)
   - `ColorInput` (with contrast calculations)

3. **Unmemoized contrast calculations** in ColorInput:
   ```typescript
   const contrast = contrastAgainst ? getContrastRatio(value, contrastAgainst) : null;
   ```

## Proposed Solutions

### Option A: Add React.memo + useCallback (Recommended)
**Pros:** Standard React optimization, minimal code change
**Cons:** Slightly more verbose
**Effort:** Small
**Risk:** Low

```typescript
// Wrap components
const DerivedColorRow = React.memo(function DerivedColorRow({...}) { ... });

// Memoize callbacks
const handleCardOverride = useCallback(
  (value: string | null) => setOverride('card', value),
  [setOverride]
);

// Memoize calculations
const { contrast, passesAA } = useMemo(() => ({
  contrast: contrastAgainst ? getContrastRatio(value, contrastAgainst) : null,
  passesAA: contrastAgainst ? isReadable(value, contrastAgainst, 'AA') : null,
}), [value, contrastAgainst]);
```

### Option B: Debounce color picker onChange
**Pros:** Reduces render frequency at source
**Cons:** Adds slight input lag
**Effort:** Small
**Risk:** Low

## Recommended Action

Implement Option A for components and callbacks. Consider Option B as additional optimization.

## Technical Details

**Affected files:**
- `components/theme-editor.tsx`
- `components/color-input.tsx`

## Acceptance Criteria

- [ ] DerivedColorRow wrapped with React.memo
- [ ] ColorInput wrapped with React.memo
- [ ] onOverride callbacks use useCallback
- [ ] Contrast calculations memoized with useMemo
- [ ] No visible re-render cascades during color drag (React DevTools)

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Performance oracle identified render issues |

## Resources

- React docs: memo, useCallback, useMemo
- React DevTools profiler for verification
