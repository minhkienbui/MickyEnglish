'use client';

export default function ProgressChart() {
  const days = [
    { day: 'T2', mins: 25, active: true },
    { day: 'T3', mins: 40, active: true },
    { day: 'T4', mins: 15, active: true },
    { day: 'T5', mins: 30, active: true },
    { day: 'T6', mins: 50, active: true },
    { day: 'T7', mins: 0, active: false },
    { day: 'CN', mins: 0, active: false },
  ];

  const maxMins = 60;

  return (
    <div className="bg-[#121c2b] border border-[#1e2d42] rounded-3xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-white">Thống kê thời lượng học tuần này</h3>
        <span className="badge-micky-green">
          Tổng: 160 phút
        </span>
      </div>

      <div className="flex items-end justify-between h-40 pt-6 px-2 border-b border-[#1e2d42] gap-3">
        {days.map((item, index) => {
          const heightPercent = Math.min(100, Math.max(10, (item.mins / maxMins) * 100));
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.mins}m
              </span>
              <div className="w-full max-w-[32px] bg-[#0e1726] border border-[#1e2d42] rounded-t-lg h-28 flex items-end overflow-hidden p-0.5">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    item.active ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : 'bg-slate-800'
                  }`}
                />
              </div>
              <span className={`text-xs font-bold ${item.active ? 'text-white' : 'text-slate-500'}`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
