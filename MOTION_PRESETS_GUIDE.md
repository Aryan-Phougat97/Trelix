# 🎬 Motion Presets Quick Reference

## Import
```typescript
import { 
  fadeIn, slideUp, pop, lift, glow,
  SPRING, DURATION, EASING,
  gpuAccelerated, mobileOptimized 
} from '@/lib/motionPresets';
```

---

## Variants

### fadeIn
Fade in with slight upward movement
```tsx
<motion.div
  variants={fadeIn}
  initial="initial"
  animate="animate"
>
  Content
</motion.div>
```

### slideUp
Slide up from below
```tsx
<motion.div
  variants={slideUp}
  initial="initial"
  animate="animate"
>
  Content
</motion.div>
```

### pop
Hover scale with spring
```tsx
<motion.div {...pop}>
  Button
</motion.div>
```

### lift
Smooth lift on hover
```tsx
<motion.div {...lift}>
  Card
</motion.div>
```

---

## Springs

### SPRING.smooth
Buttery smooth motion
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  transition={SPRING.smooth}
>
  Button
</motion.div>
```

### SPRING.bouncy
Playful bouncy motion
```tsx
<motion.div
  whileTap={{ scale: 0.95 }}
  transition={SPRING.bouncy}
>
  Button
</motion.div>
```

---

## Durations

### DURATION.normal
Standard 0.6s smooth
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={DURATION.normal}
>
  Content
</motion.div>
```

### DURATION.fast
Quick 0.3s
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={DURATION.fast}
>
  Toast
</motion.div>
```

---

## Utilities

### gpuAccelerated
Add GPU acceleration class
```tsx
<motion.div className={gpuAccelerated}>
  GPU-accelerated content
</motion.div>
```

### mobileOptimized
Different values for mobile
```tsx
const blur = mobileOptimized(120, 60); // Desktop: 120, Mobile: 60
const particles = mobileOptimized(20, 10); // Desktop: 20, Mobile: 10
```

---

## Custom Animations

### pulse()
Pulsing scale + opacity
```tsx
<motion.div {...pulse(2)}>
  Pulsing dot
</motion.div>
```

### drift()
Floating drift motion
```tsx
<motion.div {...drift(10)}>
  Floating element
</motion.div>
```

### rotate()
Continuous rotation
```tsx
<motion.div {...rotate(20)}>
  Spinning element
</motion.div>
```

---

## Best Practices

### ✅ Do
```tsx
// Use presets
<motion.div variants={fadeIn} />

// Add GPU hints
<motion.div 
  className={gpuAccelerated}
  style={{ willChange: 'transform' }}
/>

// Spring physics
<motion.div 
  whileHover={{ scale: 1.05 }}
  transition={SPRING.smooth}
/>
```

### ❌ Don't
```tsx
// Don't animate expensive properties
<motion.div animate={{ width: 200 }} /> // ❌

// Don't forget GPU hints
<motion.div animate={{ x: 100 }} /> // Missing GPU acceleration

// Don't use inline transitions
<motion.div transition={{ duration: 0.5 }} /> // Use DURATION.normal
```

---

## Performance Tips

1. **Always use transform/opacity**
   ```tsx
   animate={{ x: 100, opacity: 1 }} // ✅
   animate={{ left: '100px' }} // ❌
   ```

2. **Add will-change**
   ```tsx
   style={{ willChange: 'transform, opacity' }}
   ```

3. **Use React.memo**
   ```tsx
   export const MyComponent = React.memo(() => {
     return <motion.div {...fadeIn} />
   });
   ```

4. **Optimize for mobile**
   ```tsx
   const blur = mobileOptimized(120, 60);
   ```

5. **Use LazyMotion**
   ```tsx
   <LazyMotion features={domAnimation}>
     <motion.div />
   </LazyMotion>
   ```

---

## Easing Curves

```typescript
EASING.smooth = [0.16, 1, 0.3, 1] // Arc/Framer-style
EASING.snappy = [0.34, 1.56, 0.64, 1] // Bouncy
EASING.soft = [0.25, 0.46, 0.45, 0.94] // Gentle
```

Use with:
```tsx
transition={{ duration: 0.6, ease: EASING.smooth }}
```

---

## Mobile Optimization Pattern

```typescript
// Define desktop and mobile values
const desktopBlur = 120;
const mobileBlur = 60;

// Use mobileOptimized helper
const blur = mobileOptimized(desktopBlur, mobileBlur);

// Apply
<GlowOrb blur={blur} />
```

---

## Accessibility

Respect reduced motion preferences (automatically handled in CSS):

```css
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

---

## Examples

### Fade In Card
```tsx
<motion.div
  variants={fadeIn}
  initial="initial"
  animate="animate"
  className={`p-6 rounded-xl ${gpuAccelerated}`}
>
  Card content
</motion.div>
```

### Interactive Button
```tsx
<motion.button
  className={gpuAccelerated}
  whileHover={{ scale: 1.05, transition: SPRING.smooth }}
  whileTap={{ scale: 0.95, transition: SPRING.bouncy }}
>
  Click me
</motion.button>
```

### Staggered List
```tsx
<motion.div
  variants={staggerContainer}
  initial="initial"
  animate="animate"
>
  {items.map((item, i) => (
    <motion.div
      key={i}
      variants={staggerItem}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Floating Element
```tsx
<motion.div
  {...drift(6)}
  className={gpuAccelerated}
>
  Floating icon
</motion.div>
```

---

*Use these presets to maintain consistent, buttery-smooth animations across TRELIX!* 🚀
