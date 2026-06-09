import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  type Row,
} from '@tanstack/react-table';
import type { Lead } from '../../../server/src/types';

type LeadsTableProps = {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onExport: () => void;
};

const colHelper = createColumnHelper<Lead>();

function QuizAnswerRow({ answers }: { answers: Lead['quiz_answers'] }) {
  const labels: Record<string, string> = {
    vibe: 'Vibe',
    scene: 'Scene',
    how_people_see: 'How people see',
    scent_draw: 'Scent draw',
    occasion: 'Occasion',
    room_arrival: 'Room arrival',
    scent_memory: 'Scent memory',
    hidden_self: 'Hidden self',
  };
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 py-3 px-4 text-sm" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
      {Object.entries(labels).map(([key, label]) => {
        const raw = (answers as Record<string, unknown>)[key];
        const display = Array.isArray(raw) ? raw.join(', ') : (raw as string | undefined) ?? '—';
        return (
          <span key={key} style={{ color: 'var(--color-muted)' }}>
            <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{label}:</span>{' '}
            {display}
          </span>
        );
      })}
    </div>
  );
}

export function LeadsTable({ leads, total, page, totalPages, onPageChange, onExport }: LeadsTableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const columns = [
    colHelper.display({
      id: 'expand',
      header: '',
      cell: ({ row }: { row: Row<Lead> }) => (
        <button
          onClick={() => setExpanded(prev => ({ ...prev, [row.id]: !prev[row.id] }))}
          className="p-1 rounded hover:bg-gray-100"
          aria-label="Expand row"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            style={{ transform: expanded[row.id] ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
          >
            <path d="M4 2l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>
      ),
    }),
    colHelper.accessor('created_at', {
      header: 'Date',
      cell: info => new Date(info.getValue()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }),
    colHelper.accessor('email', {
      header: 'Email',
    }),
    colHelper.accessor('recommended_ids', {
      header: 'Primary ID',
      cell: info => {
        const ids = info.getValue();
        return Array.isArray(ids) ? ids[0] ?? '—' : '—';
      },
    }),
    colHelper.accessor('fallback_used', {
      header: 'Fallback?',
      cell: info => info.getValue() ? '✓' : '—',
    }),
  ];

  const table = useReactTable({
    data: leads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{total} leads total</p>
        <button onClick={onExport} className="btn-outline text-sm py-2 px-4">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border" style={{ borderColor: 'var(--color-hairline)', borderRadius: 'var(--r-md)' }}>
        <table className="w-full text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} style={{ backgroundColor: 'var(--color-surface-soft)' }}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-3 font-semibold border-b"
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
              <>
                <tr
                  key={row.id}
                  style={{ backgroundColor: idx % 2 === 0 ? 'var(--color-canvas)' : 'var(--color-surface-soft)' }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 border-b"
                      style={{ color: 'var(--color-ink)', borderColor: 'var(--color-hairline)' }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {expanded[row.id] && (
                  <tr key={`${row.id}-expanded`}>
                    <td colSpan={columns.length} className="border-b" style={{ borderColor: 'var(--color-hairline)' }}>
                      <QuizAnswerRow answers={row.original.quiz_answers} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="btn-outline text-sm py-2 px-4 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="btn-outline text-sm py-2 px-4 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
