import { useRef, useState } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DELETE_WIDTH = 88;

export default function TaskRow({ task, onStatus, onDelete, showActions = true }) {
  const navigate = useNavigate();
  const completed = task.status === 'completed';
  const [offset, setOffset] = useState(0);
  const drag = useRef(null);
  const moved = useRef(false);

  function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    drag.current = { x: event.clientX, offset };
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!drag.current) return;
    const next = drag.current.offset + event.clientX - drag.current.x;
    if (Math.abs(event.clientX - drag.current.x) > 6) moved.current = true;
    setOffset(Math.min(0, Math.max(-DELETE_WIDTH, next)));
  }

  function onPointerUp() {
    drag.current = null;
    setOffset((value) => (value < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0));
  }

  function openTask() {
    if (moved.current) {
      moved.current = false;
      return;
    }
    navigate(`/tasks/${task._id}/edit`);
  }

  return (
    <div className="relative overflow-hidden border-b border-[#f2f2f2]">
      <button
        type="button"
        tabIndex={offset < -20 ? 0 : -1}
        aria-hidden={offset >= -20}
        onClick={() => onDelete(task._id)}
        className="absolute inset-y-0 right-0 w-[88px] bg-[#e25c5c] text-sm font-medium text-white"
      >
        Delete
      </button>
      <div
        className="flex items-center gap-3 bg-white py-3.5"
        style={{ transform: `translateX(${offset}px)`, touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <button
          type="button"
          aria-label={completed ? 'Mark in progress' : 'Mark completed'}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => onStatus(task._id, completed ? 'in_progress' : 'completed')}
          className={`grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border ${
            completed ? 'border-[#5470F6] bg-[#5470F6] text-white' : 'border-[#d5d8e0] bg-white text-transparent'
          }`}
        >
          <Check size={13} strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={openTask}
          className={`min-w-0 flex-1 truncate text-left text-sm ${
            completed ? 'text-[#c5c8d0] line-through' : 'text-[#6b7280]'
          }`}
        >
          {task.title}
        </button>
        {showActions ? (
          <>
            <button
              type="button"
              aria-label="Delete task"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onDelete(task._id)}
              className="shrink-0 text-[#c5c8d0]"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              aria-label="Edit task"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => navigate(`/tasks/${task._id}/edit`)}
              className="shrink-0 text-[#c5c8d0]"
            >
              <Pencil size={16} />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
