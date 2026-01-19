# Add Security Headers

---
status: pending
priority: p3
issue_id: "004"
tags: [code-review, security]
dependencies: []
---

## Problem Statement

The Next.js configuration has no security headers defined. While this is a client-side only app with no sensitive data, adding CSP and other headers is a best practice for defense-in-depth.

## Findings

**Location:** `next.config.ts`

Currently just:
```typescript
const nextConfig: NextConfig = {
  /* config options here */
};
```

## Proposed Solutions

### Option A: Add security headers (Recommended)
**Pros:** Industry best practice, prevents classes of attacks
**Cons:** Slightly more config
**Effort:** Small
**Risk:** Low

```typescript
const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};
```

## Recommended Action

Implement Option A.

## Technical Details

**Affected files:**
- `next.config.ts`

## Acceptance Criteria

- [ ] X-Frame-Options header set
- [ ] X-Content-Type-Options header set
- [ ] Referrer-Policy header set
- [ ] Headers visible in browser dev tools

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-01-19 | Created from code review | Security sentinel identified gap |

## Resources

- Next.js security headers docs
- OWASP secure headers project
