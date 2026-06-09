import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import type { Product } from '../lib/api';

type CatalogTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdd: () => void;
};

const colHelper = createColumnHelper<Product>();

const TYPE_LABELS: Record<string, string> = {
  edp: 'EDP',
  extrait: 'Extrait',
  mist: 'Mist',
  hair: 'Hair',
  set: 'Set',
};

function formatPrice(price: number): string {
  return `Rp ${price.toLocaleString('id-ID')}`;
}

export function CatalogTable({ products, onEdit, onDelete, onAdd }: CatalogTableProps) {
  const columns = [
    colHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <span className="font-medium" style={{ color: 'var(--color-ink)' }}>
          {info.getValue()}
        </span>
      ),
    }),
    colHelper.accessor('type', {
      header: 'Type',
      cell: info => TYPE_LABELS[info.getValue()] ?? info.getValue().toUpperCase(),
    }),
    colHelper.accessor('scent_family', {
      header: 'Scent Family',
    }),
    colHelper.accessor('price_idr', {
      header: 'Price',
      cell: info => formatPrice(info.getValue()),
    }),
    colHelper.accessor('is_active', {
      header: 'Active',
      cell: info => (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: info.getValue() === 1 ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.06)',
            color: info.getValue() === 1 ? '#16a34a' : 'var(--color-muted)',
          }}
        >
          {info.getValue() === 1 ? 'Active' : 'Inactive'}
        </span>
      ),
    }),
    colHelper.accessor('in_stock', {
      header: 'Stock',
      cell: info => (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: info.getValue() === 1 ? 'rgba(34,197,94,0.1)' : 'rgba(255,56,92,0.1)',
            color: info.getValue() === 1 ? '#16a34a' : 'var(--color-primary)',
          }}
        >
          {info.getValue() === 1 ? 'In stock' : 'Sold out'}
        </span>
      ),
    }),
    colHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="text-sm font-medium px-3 py-1 rounded"
            style={{ color: 'var(--color-ink)', backgroundColor: 'var(--color-surface-soft)' }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(row.original)}
            className="text-sm font-medium px-3 py-1 rounded"
            style={{ color: 'var(--color-primary)', backgroundColor: 'rgba(255,56,92,0.06)' }}
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          {products.length} products
        </p>
        <button onClick={onAdd} className="btn-primary text-sm py-2 px-5">
          + Add product
        </button>
      </div>

      <div
        className="overflow-x-auto rounded-md border"
        style={{ borderColor: 'var(--color-hairline)', borderRadius: 'var(--r-md)' }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} style={{ backgroundColor: 'var(--color-surface-soft)' }}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-3 font-semibold border-b whitespace-nowrap"
                    style={{ color: 'var(--color-muted)', borderColor: 'var(--color-hairline)' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                style={{ backgroundColor: idx % 2 === 0 ? 'var(--color-canvas)' : 'var(--color-surface-soft)' }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 border-b"
                    style={{ color: 'var(--color-muted)', borderColor: 'var(--color-hairline)' }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="py-16 text-center" style={{ color: 'var(--color-muted)' }}>
            No products yet. Add your first product above.
          </div>
        )}
      </div>
    </div>
  );
}
