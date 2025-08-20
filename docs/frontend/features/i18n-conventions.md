# i18n Feature Conventions

This document defines how localization is organized for per-feature domains.

## Directory Layout

```
src/
  i18n/
    locales/
      pt-BR/
        common.json
        records.json        # Generic entity UI strings (list, form, table, toasts)
      en-US/
        common.json
        records.json
  features/
    comunicacoes/
      i18n/
        pt-BR.json          # Validation / domain-specific messages
        en-US.json
    records/                # (bridge) re-exports comunicacoes during rename
```

## Namespacing Strategy

- Global reusable UI copy lives in `common` (buttons, generic labels).
- Entity-style UI for the generic Records feature resides in `records` namespace.
- Highly specific validation or domain rules for an individual feature variant live in a feature-local namespace (currently `comunicacoes`).

## When to Add a New Namespace

Add a dedicated feature namespace only if at least one of:

- Domain-specific validation messages not reusable elsewhere.
- Distinct business terminology that would pollute generic bundles.
- Need for lazy-loading large, feature-only copy.

Otherwise, extend `records` or `common`.

## Key Authoring Guidelines

- Use dot notation: `section.element.state` (e.g. `form.placeholders.title`).
- Prefer semantic names over UI shapes (`delete.confirm` not `modal.confirmButton`).
- Support pluralization via `key` + `key_plural` with interpolation: `"count": "{{count}} item", "count_plural": "{{count}} items"`.
- Provide complete English and Portuguese entries simultaneously in PRs.

## Validation Messages

Feature-local Zod schemas map issue codes to translation keys; keep keys stable:

- `validation.title.required`
- `validation.title.min` (use interpolation like `{{min}}`).

## Adding Strings Workflow

1. Add keys to both `pt-BR` and `en-US` JSON (keep ordering mirrored).
2. Import the new namespace JSON in `src/i18n/init.ts` if it's a new namespace.
3. Consume via `const { t } = useTranslation('records')` or `i18n.getFixedT(lang,'records')` in non-hook contexts.
4. Update tests: avoid hard-coded Portuguese; accept both locales or set language explicitly with `setLocale`.

## Testing Locale-Sensitive Components

- Explicitly set locale at test start (`setLocale('en-US')`) to avoid flakiness from detection.
- For assertions, prefer stable keys / placeholders or accept regex for both languages when difference is trivial.

## Gradual Feature Rename (comunicacoes -> records)

- Keep translation keys already placed under `records` generic.
- Validation-specific namespace (`comunicacoes`) will be renamed last after code move.

## Future Enhancements

- Lazy-load feature namespaces with dynamic `i18n.addResourceBundle` on route split.
- Extract translation extraction lint rule.
- CLI script to diff missing keys across locales.
