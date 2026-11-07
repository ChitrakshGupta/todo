import { ChevronDown } from 'lucide-react';
import TaskRow from './TaskRow';
import { formatWeekLabel } from '../../utils/week';

export default function WeekCard({ week, expanded, onToggle, onStatus, onDelete }) {
  return (
    <section className="rounded-3xl bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-4 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm text-[#6d647f]">Week</p>
            <p className="text-base font-semibold">{formatWeekLabel(week.start)}</p>
          </div>
          <ChevronDown
            size={18}
            className={`text-[#6d647f] transition ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-[#f3eefe] px-3 py-2">
            <p className="text-xs text-[#6d647f]">Open Tasks</p>
            <p className="text-lg font-semibold text-[#2b2144]">{week.open}</p>
          </div>
          <div className="rounded-2xl bg-[#eef8d8] px-3 py-2">
            <p className="text-xs text-[#6d647f]">Completed Tasks</p>
            <p className="text-lg font-semibold text-[#2b2144]">{week.completed}</p>
          </div>
        </div>
      </button>
      {expanded ? (
        <div className="space-y-2 px-3 pb-3">
          {week.tasks.length === 0 ? (
            <p className="px-1 pb-2 text-sm text-[#8b829c]">No tasks this week yet.</p>
          ) : (
            week.tasks.map((task) => (
              <TaskRow key={task._id} task={task} onStatus={onStatus} onDelete={onDelete} />
            ))
          )}
        </div>
      ) : null}
    </section>
  );
}
