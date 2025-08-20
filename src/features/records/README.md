# Records Feature (Bridge)

This directory is an interim alias to the former `comunicacoes` feature.
It re-exports all public APIs from `../comunicacoes` to enable a gradual rename
without breaking existing imports.

Phases:

1. Bridge (current): `@features/records` re-exports `@features/comunicacoes`.
2. Dual Structure: Move source files into `records/` while keeping stub barrel in `comunicacoes/` that re-exports back for backwards compatibility.
3. Final: Remove old `comunicacoes` directory after external repos & docs updated.

Guidelines for New Code:

- New imports should prefer `@features/records`.
- Do not introduce new public barrel exports inside `comunicacoes`; add them here instead.
- Keep translation namespace keys generic (`records.*`) for UI strings and reserve feature-specific validation/text domain if needed.

Cleanup Criteria:

- Search codebase: no occurrences of `@features/comunicacoes` (excluding bridge comments).
- Update routes: route path may later become `/records` (will require router + navigation update & migration note).
- Documentation updated (Feature Guide, Changelog, Migration section).
