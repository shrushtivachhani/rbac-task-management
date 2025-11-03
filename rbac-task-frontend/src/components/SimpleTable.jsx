import React from 'react';

export default function SimpleTable({ columns, data, renderRowActions }) {
  return (
    <table className="simple-table">
      <thead>
        <tr>{columns.map(c => <th key={c.key}>{c.title}</th>)}</tr>
      </thead>
      <tbody>
        {data.length === 0 && <tr><td colSpan={columns.length}>No records</td></tr>}
        {data.map(row => (
          <tr key={row._id || row.id}>
            {columns.map(col => <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>)}
            {renderRowActions && <td>{renderRowActions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
