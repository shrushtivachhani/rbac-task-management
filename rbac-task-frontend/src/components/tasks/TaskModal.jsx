import React, { useState } from 'react';

export default function TaskModal({ task }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="px-3 py-1 bg-sky-600 text-white rounded">View</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-xl">
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <p className="mb-4">{task.description}</p>
            <div className="text-sm text-slate-500">Assigned To: {task.assignedTo?.name || task.assignedTo}</div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-3 py-1 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
