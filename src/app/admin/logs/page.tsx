'use client';

import React, { useState, useMemo } from 'react';
import { Shield, Search, Filter, Info, Eye, Clock } from 'lucide-react';
import { useAdminStore, AdminLogItem } from '@/stores/useAdminStore';

export default function AdminLogsPage() {
  const { logs } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AdminLogItem | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch =
        l.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.ipAddress.includes(searchQuery);

      const matchesTarget = targetTypeFilter === 'all' || l.targetType === targetTypeFilter;
      return matchesSearch && matchesTarget;
    });
  }, [logs, searchQuery, targetTypeFilter]);

  const getActionBadgeColor = (action: string) => {
    if (action.includes('delete') || action.includes('ban'))
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (action.includes('create') || action.includes('publish') || action.includes('grant'))
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-400" /> Nhật ký Hoạt động (Audit Logs)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
              Chế độ chỉ đọc (Read-Only)
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium pt-1">
            Ghi nhận toàn bộ thao tác thay đổi dữ liệu, cấp quyền, cấu hình hệ thống và địa chỉ IP của Quản trị viên
          </p>
        </div>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên Admin, hành động, ID đối tượng, IP..."
              className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl py-2 pl-9 pr-4 text-xs text-white font-medium outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="sm:col-span-4">
            <select
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white font-bold outline-none"
            >
              <option value="all">Tất cả đối tượng</option>
              <option value="video">Video bài học</option>
              <option value="user">Người dùng / Tài khoản</option>
              <option value="diamond">Đá Quý / Giao dịch</option>
              <option value="setting">Cài đặt hệ thống</option>
              <option value="auth">Xác thực / Bảo mật</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng Nhật ký Logs */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase font-black text-[10px] border-b border-[#334155]">
              <tr>
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4">Quản trị viên</th>
                <th className="py-3.5 px-4">Hành động</th>
                <th className="py-3.5 px-4">Đối tượng</th>
                <th className="py-3.5 px-4 text-center">Địa chỉ IP</th>
                <th className="py-3.5 px-4 text-right">Chi tiết thay đổi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-bold">
                    Chưa có nhật ký hoạt động nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-[#273549]/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{l.adminName}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase ${getActionBadgeColor(
                          l.action
                        )}`}
                      >
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-300 text-[11px]">
                        [{l.targetType}] {l.targetId}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400 text-[11px]">{l.ipAddress}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(l)}
                        className="px-2.5 py-1 bg-[#0f172a] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] rounded-xl text-[10px] font-bold cursor-pointer"
                      >
                        Xem JSON
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT JSON LOG */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
          <div className="w-full max-w-lg bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-400" /> Chi tiết nhật ký: {selectedLog.action}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-300">
                <strong>Admin:</strong> {selectedLog.adminName} ({selectedLog.adminId})
              </p>
              <p className="text-slate-300">
                <strong>Thời gian:</strong> {new Date(selectedLog.timestamp).toLocaleString('vi-VN')}
              </p>
              <p className="text-slate-300">
                <strong>IP:</strong> {selectedLog.ipAddress}
              </p>

              {selectedLog.oldValue && (
                <div className="space-y-1 pt-1">
                  <span className="font-bold text-rose-400 block">Giá trị trước khi đổi:</span>
                  <pre className="p-3 bg-[#0f172a] border border-[#334155] rounded-xl text-[11px] text-rose-300 font-mono overflow-x-auto max-h-36">
                    {JSON.stringify(selectedLog.oldValue, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.newValue && (
                <div className="space-y-1 pt-1">
                  <span className="font-bold text-emerald-400 block">Giá trị mới (Thay đổi):</span>
                  <pre className="p-3 bg-[#0f172a] border border-[#334155] rounded-xl text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-36">
                    {JSON.stringify(selectedLog.newValue, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-[#0f172a] hover:bg-[#334155] text-slate-300 rounded-xl text-xs font-bold border border-[#334155]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
