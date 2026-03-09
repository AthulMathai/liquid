"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  width?: string | number;
  className?: string;
  render: (row: T, index: number) => ReactNode;
};

type DataTableProps<T> = {
  title?: string;
  subtitle?: string;
  columns: DataTableColumn<T>[];
  rows?: T[];
  rowKey: (row: T, index: number) => string;
  emptyTitle?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  actions?: ReactNode;
  footer?: ReactNode;
};

export default function DataTable<T>({
  title = "Data Table",
  subtitle = "Review and manage records from one clean table.",
  columns,
  rows = [],
  rowKey,
  emptyTitle = "No records found",
  emptyText = "When data is available, it will appear here.",
  searchPlaceholder = "Search...",
  actions,
  footer,
}: DataTableProps<T>) {
  const hasRows = rows.length > 0;

  return (
    <div className="card">
      <div className="card-content">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>
              {title}
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              {subtitle}
            </p>
          </div>

          <div className="toolbar">
            <div
              style={{
                position: "relative",
                minWidth: 260,
              }}
            >
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgb(var(--muted))",
                }}
              />
              <input
                className="input"
                placeholder={searchPlaceholder}
                style={{ paddingLeft: 40 }}
              />
            </div>

            {actions}
          </div>
        </div>

        {!hasRows ? (
          <div
            className="empty-state"
            style={{
              borderRadius: 20,
              border: "1px solid rgba(var(--border), 0.86)",
              background: "rgba(248,250,252,0.72)",
            }}
          >
            <h3 className="empty-state-title">{emptyTitle}</h3>
            <p className="empty-state-text">{emptyText}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={column.className}
                      style={
                        column.width
                          ? {
                              width: column.width,
                            }
                          : undefined
                      }
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={rowKey(row, index)}>
                    {columns.map((column) => (
                      <td key={column.key} className={column.className}>
                        {column.render(row, index)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasRows ? (
          <div
            className="toolbar"
            style={{
              marginTop: 18,
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div className="toolbar">
              <span className="badge badge-success">Rows loaded</span>
              <span className="badge badge-neutral">
                {rows.length} record{rows.length === 1 ? "" : "s"}
              </span>
            </div>

            {footer ? (
              footer
            ) : (
              <div
                style={{
                  color: "rgb(var(--muted))",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Showing {rows.length} row{rows.length === 1 ? "" : "s"}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}