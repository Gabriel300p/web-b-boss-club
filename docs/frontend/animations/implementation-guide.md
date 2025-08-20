# Animation System Implementation

## Overview

Standardized animation wrappers and variants for consistent motion design across the application.

## Components Created

### Animation Variants (`/shared/components/animations/variants.ts`)

- `fadeInVariants` - Simple opacity transitions
- `slideInVariants` - Slide from left with fade
- `scaleInVariants` - Scale up from center with fade
- `listItemVariants` - Staggered list item animations
- `modalVariants` - Spring-based modal/dialog animations
- `overlayVariants` - Background overlay fade

### Wrapper Components (`/shared/components/animations/motion.tsx`)

- `<AnimatedBox>` - General purpose animation wrapper with variant selection
- `<AnimatedList>` - Staggered animation for list items
- `<AnimatedTableRow>` - Specialized table row animations with index-based delays

## Usage Examples

```tsx
// Basic fade in
<AnimatedBox variant="fadeIn">
  <MyContent />
</AnimatedBox>

// Animated list with stagger effect
<AnimatedList itemClassName="mb-2">
  {items.map(item => <ItemComponent key={item.id} {...item} />)}
</AnimatedList>

// Table with animated rows
<tbody>
  {data.map((row, index) => (
    <AnimatedTableRow key={row.id} index={index}>
      <td>{row.name}</td>
      <td>{row.value}</td>
    </AnimatedTableRow>
  ))}
</tbody>
```

## Integration Strategy

- Components export both high-level wrappers and low-level variants
- Variants can be used directly with framer-motion components
- Follows react-refresh rules (variants in separate .ts file)
- Consistent timing and easing across all animations

## Next Steps

- Apply to existing components (DataTable, Modals, Forms)
- Add more specialized variants as needed
- Consider animation preferences/reduced motion support
