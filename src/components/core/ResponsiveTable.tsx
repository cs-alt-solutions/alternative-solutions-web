import React from 'react';

// Defines how each column looks
interface Column {
  header: string;
  accessor: (item: any) => React.ReactNode;
}

interface ResponsiveTableProps {
  data: any[];
  columns: Column[];
}

export default function ResponsiveTable({ data, columns }: ResponsiveTableProps) {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <table className="hidden md:table w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-xs font-mono text-zinc-500 uppercase tracking-wider">
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-4">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-zinc-300">
          {data.map((item, idx) => (
            <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
              {columns.map((col, i) => (
                <td key={i} className="px-4 py-4">{col.accessor(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="bg-zinc-900 border border-white/10 rounded-xl p-4 space-y-3">
            {columns.map((col, i) => (
              <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{col.header}</span>
                <span className="text-sm text-white">{col.accessor(item)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}