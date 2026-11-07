export default function Onboarding({ onStart }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="relative min-h-[220px] flex-1 overflow-hidden bg-[#5470F6]">
        <svg
          viewBox="0 0 390 520"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <circle cx="348" cy="18" r="78" fill="#6C86F8" />
          <g fill="none" stroke="#8AA4FF" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
            <path d="M18 168 l22-18 22 18 22-18 22 18 22-18 22 18" />
            <path d="M18 190 l22-18 22 18 22-18 22 18 22-18 22 18" />
            <path d="M18 212 l22-18 22 18 22-18 22 18 22-18 22 18" />
            <path d="M28 360 l16-12 16 12 16-12 16 12" />
            <path d="M28 378 l16-12 16 12 16-12 16 12" />
            <path d="M28 396 l16-12 16 12 16-12 16 12" />
            <path d="M248 430 l18-14 18 14 18-14 18 14 18-14" />
            <path d="M248 450 l18-14 18 14 18-14 18 14 18-14" />
            <path d="M248 470 l18-14 18 14 18-14 18 14 18-14" />
          </g>
        </svg>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-8 pt-8">
        <h1 className="text-[22px] font-bold leading-tight text-[#1c1c1c]">Manage What To Do</h1>
        <p className="mt-3 max-w-[250px] text-[13px] leading-5 text-[#9aa1ad]">
          The best way to manage what you have to do, don&apos;t forget your plans
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-auto h-12 w-full rounded-[10px] bg-[#5470F6] text-[15px] font-medium text-white"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
