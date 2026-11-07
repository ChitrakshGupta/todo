import { useEffect, useRef, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

const field = 'w-full rounded-[10px] border border-[#ececec] bg-white px-4 py-3 text-sm text-[#3a4150] outline-none placeholder:text-[#c5c8d0]';

function formatDateLabel(value) {
  if (!value) return 'Set a date';
  const date = new Date(`${value}T00:00:00`);
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  return `${weekday} ${date.getDate()}, ${month}`;
}

const HOURS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

function splitTime(value) {
  const [hour = '', minute = ''] = value ? value.split(':') : [];
  return { hour, minute };
}

function joinTime(value, part, next) {
  const current = splitTime(value);
  const hour = part === 'hour' ? next : current.hour || '00';
  const minute = part === 'minute' ? next : current.minute || '00';
  return `${hour}:${minute}`;
}

function Wheel({ label, options, selected, onPick }) {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const selectedOption = list?.querySelector('[data-selected="true"]');
    if (!list || !selectedOption) return;
    list.scrollTop = selectedOption.offsetTop - list.clientHeight / 2 + selectedOption.clientHeight / 2;
  }, [selected]);

  return (
    <div className="min-w-0 flex-1">
      <p className="pb-1 text-center text-[11px] text-[#8b93a7]">{label}</p>
      <div ref={listRef} className="h-36 overflow-y-auto rounded-[10px] bg-[#f6f7fb]">
        {options.map((option) => {
          const active = option === selected;
          return (
            <button
              key={option}
              type="button"
              data-selected={active}
              onClick={() => onPick(option)}
              className={`block w-full py-1.5 text-sm ${active ? 'bg-[#5470F6] text-white' : 'text-[#3a4150]'}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimePicker({ value, onChange, onClose }) {
  const { hour, minute } = splitTime(value);

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="rounded-[12px] border border-[#ececec] bg-white p-3">
      <div className="flex gap-2">
        <Wheel label="Hour" options={HOURS} selected={hour} onPick={(next) => onChange(joinTime(value, 'hour', next))} />
        <Wheel label="Min" options={MINUTES} selected={minute} onPick={(next) => onChange(joinTime(value, 'minute', next))} />
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-3 h-9 w-full rounded-[10px] bg-[#5470F6] text-sm font-medium text-white"
      >
        Done
      </button>
    </div>
  );
}

function TimeField({ label, value, open, onToggle }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={open}
      onClick={onToggle}
      className={`flex w-full min-w-0 items-center gap-2 rounded-[10px] border px-3 py-3 text-left text-sm ${
        open ? 'border-[#5470F6] text-[#3a4150]' : 'border-[#ececec] text-[#9aa1ad]'
      }`}
    >
      <Clock size={16} className="shrink-0 text-[#c5c8d0]" />
      <span className={`truncate ${value ? 'text-[#3a4150]' : ''}`}>{value || label}</span>
    </button>
  );
}

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function TaskFields({ values, onChange }) {
  const [openTime, setOpenTime] = useState(null);

  function set(fieldName, value) {
    onChange({ ...values, [fieldName]: value });
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-[13px] text-[#8b93a7]">Task title</span>
        <input
          required
          value={values.title}
          onChange={(event) => set('title', event.target.value)}
          placeholder="Doing Homework"
          className={field}
        />
      </label>

      <div>
        <span className="mb-2 block text-[13px] text-[#8b93a7]">Set Time</span>
        <div className="grid grid-cols-2 gap-3">
          <TimeField
            label="Start"
            value={values.start}
            open={openTime === 'start'}
            onToggle={() => setOpenTime((current) => (current === 'start' ? null : 'start'))}
          />
          <TimeField
            label="Ends"
            value={values.end}
            open={openTime === 'end'}
            onToggle={() => setOpenTime((current) => (current === 'end' ? null : 'end'))}
          />
        </div>
        {openTime ? (
          <div className="mt-3">
            <TimePicker
              value={openTime === 'start' ? values.start : values.end}
              onChange={(next) => set(openTime, next)}
              onClose={() => setOpenTime(null)}
            />
          </div>
        ) : null}
      </div>

      <label className="relative block">
        <span className="mb-2 block text-[13px] text-[#8b93a7]">Set Date</span>
        <div className="flex items-center rounded-[10px] border border-[#ececec] px-4 py-3 text-sm text-[#3a4150]">
          <span className="flex-1">{formatDateLabel(values.date)}</span>
          <Calendar size={16} className="text-[#c5c8d0]" />
        </div>
        <input
          required
          type="date"
          aria-label="Set Date"
          value={values.date}
          onChange={(event) => set('date', event.target.value)}
          className="absolute inset-x-0 bottom-0 h-12 cursor-pointer opacity-0"
        />
      </label>

      <div>
        <span className="mb-2 block text-[13px] text-[#8b93a7]">Priority</span>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map((item) => {
            const active = values.priority === item.value;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={active}
                onClick={() => set('priority', active ? '' : item.value)}
                className={`h-10 rounded-[10px] border text-sm ${
                  active ? 'border-[#5470F6] bg-[#eef1ff] text-[#5470F6]' : 'border-[#ececec] text-[#8b93a7]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-[13px] text-[#8b93a7]">Description</span>
        <textarea
          value={values.description}
          onChange={(event) => set('description', event.target.value)}
          rows={3}
          placeholder="Add Description"
          className={`${field} resize-none`}
        />
      </label>
    </div>
  );
}
