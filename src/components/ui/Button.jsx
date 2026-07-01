import { forwardRef } from 'react';

/**
 * Button — Modern Flora design system
 *
 * Variants:
 *   - primary   → bloom fill, white text (main CTAs)
 *   - secondary → surface bg, border, dark text (secondary CTAs)
 *   - ghost     → transparent, muted text (tertiary actions, nav)
 *   - danger    → error fill, white text (destructive actions)
 *
 * Sizes:
 *   - sm  → icon-only or compact
 *   - md  → default
 *   - lg  → hero / prominent CTA
 *
 * Polymorphic: pass `as="a"` to render an anchor (preserves styles).
 */

const VARIANTS = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
};

const SIZES = {
  sm: 'text-body-xs px-3 py-1.5',
  md: '', // default from .btn-* classes
  lg: 'text-body-md px-8 py-3.5',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    as: Component = 'button',
    className = '',
    loading = false,
    disabled = false,
    iconLeft,
    iconRight,
    type = 'button',
    ...rest
  },
  ref
) {
  const variantClass = VARIANTS[variant] ?? VARIANTS.primary;
  const sizeClass = SIZES[size] ?? '';
  const isDisabled = disabled || loading;

  return (
    <Component
      ref={ref}
      type={Component === 'button' ? type : undefined}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-busy={loading || undefined}
      className={`${variantClass} ${sizeClass} ${className}`.trim()}
      {...rest}
    >
      {loading ? (
        <>
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
          <span className="opacity-90">{children}</span>
        </>
      ) : (
        <>
          {iconLeft && <span className="inline-flex shrink-0" aria-hidden="true">{iconLeft}</span>}
          {children}
          {iconRight && <span className="inline-flex shrink-0" aria-hidden="true">{iconRight}</span>}
        </>
      )}
    </Component>
  );
});

export default Button;
