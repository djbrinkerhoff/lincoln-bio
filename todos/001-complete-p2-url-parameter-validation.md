# URL Parameter Validation

---
status: pending
priority: p2
issue_id: "001"
tags: [code-review, security, typescript]
dependencies: []
---

## Problem Statement

URL parameters are read and used with minimal validation. Type assertions like `(params.get('btn') as ButtonStyle)` bypass TypeScript's safety guarantees, allowing invalid URL parameters to pass through and potentially cause runtime issues.

## Findings

**Location:** `lib/theme-store.ts` (lines 53-76)

1. **Unsafe type casting** - `buttonStyle` and `borderRadius` are cast directly from URL params without validation
2. **No hex color validation** - Colors are just prepended with `#` without checking format
3. **Potential CSS injection** - While unlikely due to colord library handling, explicit validation is defense-in-depth

**Example of current unsafe code:**
```typescript
buttonStyle: (params.get('btn') as ButtonStyle) || DEFAULT_STATE.buttonStyle,
borderRadius: (params.get('radius') as BorderRadius) || DEFAULT_STATE.borderRadius,
background: bg ? `#${bg}` : DEFAULT_STATE.background,
```

## Proposed Solutions

### Option A: Add validation functions (Recommended)
**Pros:** Simple, explicit, type-safe
**Cons:** ~20 lines of additional code
**Effort:** Small
**Risk:** Low

```typescript
const VALID_BUTTON_STYLES = ['filled', 'outline', 'soft'] as const;
const VALID_BORDER_RADII = ['none', 'sm', 'md', 'lg', 'full'] as const;

function isValidHexColor(value: string): boolean {
  return /^[0-9a-fA-F]{6}$/.test(value) || /^[0-9a-fA-F]{3}$/.test(value);
}

function isValidButtonStyle(v: string | null): v is ButtonStyle {
  return VALID_BUTTON_STYLES.includes(v as ButtonStyle);
}
```

### Option B: Use zod schema validation
**Pros:** More declarative, reusable
**Cons:** Adds dependency, heavier
**Effort:** Medium
**Risk:** Low

## Recommended Action

Implement Option A - Add lightweight validation functions.

## Technical Details

**Affected files:**
- `lib/theme-store.ts`

## Acceptance Criteria

- [ ] Hex colors validated before use (3 or 6 chars, 0-9/a-f only)
- [ ] ButtonStyle validated against allowed values
- [ ] BorderRadius validated against allowed values
- [ ] Invalid values fall back to defaults gracefully
- [ ] No TypeScript type assertions on URL params

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Found during security + TypeScript review |

## Resources

- PR: N/A (main branch review)
- TypeScript docs on type guards
