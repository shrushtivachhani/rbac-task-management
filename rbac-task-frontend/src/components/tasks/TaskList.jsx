import React from 'react';
import TaskModal from './TaskModal';

export default function TaskList({ tasks = [], refresh }) {
  return (
    <div>
      <div className="grid gap-3">
        {tasks.length === 0 && <div className="p-4 text-sm text-slate-500">No tasks.</div>}
        {tasks.map(task => (
          <div key={task._id || task.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <div className="font-semibold">{task.title}</div>
              <div className="text-sm text-slate-600">{task.description}</div>
              <div className="text-xs text-slate-400 mt-2">Status: {task.status || task.status?.toLowerCase()}</div>
            </div>
            <div className="flex items-center gap-2">
              <TaskModal task={task} refresh={refresh} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
