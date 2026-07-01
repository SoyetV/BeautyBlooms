import { forwardRef, useId } from 'react';

/**
 * Input — Modern Flora design system
 *
 * Variants:
 *   - text     → single-line <input>
 *   - textarea → multi-line
 *   - select   → dropdown
 *
 * Features:
 *   - Accessible label + optional hint + optional error
 *   - Icon slot (left) for search/mail/lock etc.
 *   - Forwarded ref for parent control
 *   - Generated id for label association
 */

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    iconLeft,
    iconRight,
    type = 'text',
    as = 'input',
    rows = 4,
    className = '',
    id: idProp,
    required = false,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const describedById = `${id}-described`;
  const errorId = `${id}-error`;

  const sharedClasses = 'input-field';
  const iconPadLeft = iconLeft ? 'pl-11' : '';
  const iconPadRight = iconRight ? 'pr-11' : '';
  const errorClasses = error
    ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgb(200_52_26_/_0.18)]'
    : '';
  const combinedClasses = `${sharedClasses} ${iconPadLeft} ${iconPadRight} ${errorClasses} ${className}`.trim();

  const describedBy = [
    hint ? describedById : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ') || undefined;

  const renderField = () => {
    if (as === 'textarea') {
      return (
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={combinedClasses}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          {...rest}
        />
      );
    }

    if (as === 'select') {
      return (
        <select
          ref={ref}
          id={id}
          className={combinedClasses}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          required={required}
          {...rest}
        />
      );
    }

    return (
      <input
        ref={ref}
        id={id}
        type={type}
        className={combinedClasses}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        {...rest}
      />
    );
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span className="ml-0.5 text-primary-600" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative">
        {iconLeft && (
          <span
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle material-symbols-outlined"
            style={{ fontSize: '20px' }}
            aria-hidden="true"
          >
            {iconLeft}
          </span>
        )}

        {renderField()}

        {iconRight && (
          <span
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-subtle material-symbols-outlined"
            style={{ fontSize: '20px' }}
            aria-hidden="true"
          >
            {iconRight}
          </span>
        )}
      </div>

      {hint && !error && (
        <p id={describedById} className="mt-1.5 text-body-xs text-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-body-xs text-error-fg">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
