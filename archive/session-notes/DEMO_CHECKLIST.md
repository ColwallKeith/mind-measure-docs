# Mind Measure — Investor Demo Checklist

- [ ] **Preflight**: `npm run demo:preflight` passed
- [ ] **Env**: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` configured
- [ ] **Auth Gate**: unauth → sign-in, verified admin → `/university`, superuser → `/superuser`
- [ ] **Dashboards**: render without console errors (fixtures acceptable)
- [ ] **Security**: CSP headers present (`frame-ancestors 'none'`, `X-Frame-Options DENY`)
- [ ] **Tests**: Playwright smoke + CSP checks pass in CI
- [ ] **Edge Function**: `admin-upsert-membership` deployed (if required for demo)
- [ ] **Tag**: `npm run demo:tag` created a tag (e.g. `demo-YYYYMMDD-HHMM`)
- [ ] **Artifact/Deploy**: CI produced a build artifact / Preview URL

## Quick Commands

```bash
# Check demo readiness
npm run demo:preflight

# Tag a demo release (if preflight passes)
npm run demo:tag

# Manual build
npm run demo:build
```

## Environment Setup

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://XXXX.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

## Demo Flow Validation

1. **Unauthenticated**: Visit `/` → should see "Please sign in"
2. **Admin Login**: Sign in with admin credentials → should route to `/university`
3. **Superuser Login**: Sign in with superuser credentials → should route to `/superuser`
4. **Dashboard Rendering**: Both dashboards should load without errors
5. **Security Headers**: Check browser dev tools for CSP headers

## Troubleshooting

- **Preflight fails on env**: Set `NEXT_PUBLIC_SUPABASE_*` variables
- **Preflight fails on routes**: Ensure dashboard pages exist in `src/app/`
- **Tests fail**: Run `npm run test:e2e` separately to debug
- **Build fails**: Check TypeScript errors with `npm run typecheck`
