import { useState, useCallback } from 'react';

/**
 * Tabs — Modern Flora design system
 *
 * Controlled or uncontrolled. Accessible (ARIA tablist roles).
 *
 * Usage:
 *   <Tabs
 *     tabs={[
 *       { id: 'products', label: 'Products', icon: 'inventory_2' },
 *       { id: 'orders',   label: 'Orders',   icon: 'receipt_long', badge: 3 },
 *     ]}
 *     defaultTab="products"
 *     onChange={(id) => console.log(id)}
 *   >
 *     {(active) => active === 'products' ? <ProductsTable /> : <OrdersTable />}
 *   </Tabs>
 */

export default function Tabs({
  tabs = [],
  defaultTab,
  value: controlledTab,
  onChange,
  children,
  className = '',
}) {
  const [internalTab, setInternalTab] = useState(defaultTab ?? tabs[0]?.id);
  const active = controlledTab ?? internalTab;

  const handleSelect = useCallback((id) => {
    if (controlledTab === undefined) setInternalTab(id);
    onChange?.(id);
  }, [controlledTab, onChange]);

  if (!tabs.length) return null;

  return (
    <div className={className}>
      {/* Tab strip */}
      <div
        role="tablist"
        aria-label="Section tabs"
        className="flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-none"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSelect(tab.id)}
              className={`
                relative inline-flex items-center gap-2 px-4 py-3
                text-body-sm font-medium whitespace-nowrap
                transition-colors duration-250 ease-smooth
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                ${isActive ? 'text-primary-700' : 'text-muted hover:text-foreground'}
              `}
            >
              {tab.icon && (
                <span
                  className={`material-symbols-outlined ${isActive ? 'icon-fill' : ''}`}
                  style={{ fontSize: '18px' }}
                  aria-hidden="true"
                >
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge != null && tab.badge > 0 && (
                <span
                  className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-body-xs font-semibold text-white bg-primary-500"
                  aria-label={`${tab.badge} pending`}
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
              {isActive && (
                <span
                  className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary-500"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div
        role="tabpanel"
        id={`tabpanel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className="outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg"
      >
        {typeof children === 'function' ? children(active) : children}
      </div>
    </div>
  );
}
