import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ value = '', onChange, onSubmit }) {
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    if (onSubmit) onSubmit(value);
    else navigate(value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : '/search');
  }

  return (
    <header>
      <form onSubmit={submit}>
        <label className="flex items-center gap-2 rounded-xl border border-[#ececec] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          <input
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder="Search for a task"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#3a4150] outline-none placeholder:text-[#b0b6c0]"
          />
          <button type="submit" aria-label="Search tasks" className="text-[#9aa1ad]">
            <Search size={18} strokeWidth={2} />
          </button>
        </label>
      </form>
    </header>
  );
}
