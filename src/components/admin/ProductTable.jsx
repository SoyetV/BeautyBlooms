import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency } from '@/utils/formatCurrency'

export function ProductTable({ products, loading, error, onEdit, onDelete }) {
  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
  if (error) return <div className="p-8 text-center text-brand-error font-medium">{error}</div>

  return (
    <div className="overflow-x-auto scrollbar-none -mx-8 px-8">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-brand-secondary/5">
            <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant/60">Product</th>
            <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant/60">Category</th>
            <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant/60">Stock</th>
            <th className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant/60 text-right">Price</th>
            <th className="py-4 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-secondary/5">
          {products.map(p => (
            <tr key={p.id} className="group hover:bg-white/30 transition-colors">
              <td className="py-4 pr-4">
                <div className="flex items-center gap-4">
                  <img src={p.image_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-brand-secondary/5" />
                  <div>
                    <p className="text-sm font-bold text-brand-on-surface">{p.name}</p>
                    {!p.is_available && <Badge label="Hidden" variant="default" />}
                  </div>
                </div>
              </td>
              <td className="py-4 text-xs font-medium text-brand-on-surface-variant">{p.category}</td>
              <td className="py-4">
                <Badge
                  label={p.stock_count > 0 ? `${p.stock_count} units` : 'Sold Out'}
                  variant={p.stock_count > 5 ? 'instock' : p.stock_count > 0 ? 'lowstock' : 'outofstock'}
                />
              </td>
              <td className="py-4 text-sm font-bold text-brand-on-surface text-right tabular-nums">
                {formatCurrency(p.price)}
              </td>
              <td className="py-4 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(p)} className="p-2 text-brand-on-surface-variant hover:text-brand-primary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <button onClick={() => { if(confirm('Delete product?')) onDelete(p.id) }} className="p-2 text-brand-on-surface-variant hover:text-brand-error">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
