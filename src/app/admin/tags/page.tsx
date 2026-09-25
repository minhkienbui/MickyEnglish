'use client';

import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, CheckCircle2, Eye, EyeOff, Layers } from 'lucide-react';
import { useAdminStore, AdminTagItem } from '@/stores/useAdminStore';

const PRESET_COLORS = [
  { bg: '#1e3a8a', text: '#93c5fd' },
  { bg: '#831843', text: '#fbcfe8' },
  { bg: '#7f1d1d', text: '#fca5a5' },
  { bg: '#14532d', text: '#86efac' },
  { bg: '#581c87', text: '#d8b4fe' },
  { bg: '#78350f', text: '#fde68a' },
  { bg: '#134e4a', text: '#99f6e4' },
];

export default function AdminTagsPage() {
  const { tags, addTag, updateTag, deleteTag } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<AdminTagItem | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [bgColor, setBgColor] = useState('#1e3a8a');
  const [textColor, setTextColor] = useState('#93c5fd');
  const [order, setOrder] = useState<number>(1);
  const [isVisible, setIsVisible] = useState(true);

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const openAddModal = () => {
    setTagToEdit(null);
    setName('');
    setSlug('');
    setBgColor('#1e3a8a');
    setTextColor('#93c5fd');
    setOrder(tags.length + 1);
    setIsVisible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (t: AdminTagItem) => {
    setTagToEdit(t);
    setName(t.name);
    setSlug(t.slug);
    setBgColor(t.bgColor);
    setTextColor(t.textColor);
    setOrder(t.order);
    setIsVisible(t.isVisible);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedName = name.startsWith('#') ? name.trim() : `# ${name.trim()}`;

    if (tagToEdit) {
      updateTag(tagToEdit.id, {
        name: formattedName,
        slug: slug.trim() || 'tag-slug',
        bgColor,
        textColor,
        order,
        isVisible,
      });
      showToast(`✓ Đã cập nhật tag "${formattedName}".`);
    } else {
      addTag({
        name: formattedName,
        slug: slug.trim() || 'tag-slug',
        bgColor,
        textColor,
        order,
        isVisible,
      });
      showToast(`🎉 Đã thêm tag mới "${formattedName}".`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="bg-emerald-950/90 border border-emerald-500 py-2.5 px-4 rounded-2xl text-xs font-black text-emerald-300 flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-pink-400" /> Quản lý Tags & Danh mục
          </h1>
          <p className="text-xs text-slate-400 font-medium pt-1">
            Quản lý các danh mục phân loại video, màu sắc badge và thứ tự hiển thị trên thanh tìm kiếm
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>＋ Thêm tag mới</span>
        </button>
      </div>

      {/* Bảng Tags */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase font-black text-[10px] border-b border-[#334155]">
              <tr>
                <th className="py-3.5 px-4 w-12">Thứ tự</th>
                <th className="py-3.5 px-4">Tên Tag (Preview)</th>
                <th className="py-3.5 px-4">Slug URL</th>
                <th className="py-3.5 px-4 text-center">Số video</th>
                <th className="py-3.5 px-4 text-center">Màu sắc</th>
                <th className="py-3.5 px-4 text-center">Hiển thị</th>
                <th className="py-3.5 px-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {[...tags]
                .sort((a, b) => a.order - b.order)
                .map((t) => (
                  <tr key={t.id} className="hover:bg-[#273549]/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{t.order}</td>
                    <td className="py-3 px-4">
                      <span
                        style={{ backgroundColor: t.bgColor, color: t.textColor }}
                        className="px-3 py-1 rounded-full text-xs font-bold inline-block"
                      >
                        {t.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{t.slug}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                      {t.videoCount || 0} bài
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-slate-400">
                        <span style={{ backgroundColor: t.bgColor }} className="w-3.5 h-3.5 rounded-full border border-[#334155]" />
                        <span>{t.bgColor}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => updateTag(t.id, { isVisible: !t.isVisible })}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer ${
                          t.isVisible
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {t.isVisible ? '✓ Hiển thị' : '⊘ Đang ẩn'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(t)}
                          className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] text-emerald-400 hover:text-emerald-300 border border-[#334155] cursor-pointer"
                          title="Sửa tag"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa tag "${t.name}"?`)) {
                              deleteTag(t.id);
                              showToast(`🗑️ Đã xóa tag "${t.name}".`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-[#334155] cursor-pointer"
                          title="Xóa tag"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM / SỬA TAG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in font-sans">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-3 text-pink-400">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">{tagToEdit ? 'Chỉnh sửa Tag' : 'Thêm Tag Mới'}</h3>
                <p className="text-xs text-slate-400">Tùy chỉnh danh mục và phối màu hiển thị</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Tên Tag (VD: # IELTS Listening)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: # BBC Learning"
                className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl py-2 px-3 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Slug URL</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="bbc-learning"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-mono text-slate-300 outline-none"
              />
            </div>

            {/* Color Pickers */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-black text-slate-300">Phối màu mẫu (Preset)</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setBgColor(p.bg);
                      setTextColor(p.text);
                    }}
                    style={{ backgroundColor: p.bg, color: p.text }}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-bold border border-white/20 cursor-pointer"
                  >
                    Mẫu {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-300">Màu nền</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-slate-300">{bgColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-300">Màu chữ</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-slate-300">{textColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-slate-300">Thứ tự hiển thị</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs font-mono text-white outline-none"
              />
            </div>

            {/* Preview Box */}
            <div className="p-3 bg-[#0f172a] border border-[#334155] rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-slate-400 block">Xem trước Tag</span>
              <span
                style={{ backgroundColor: bgColor, color: textColor }}
                className="px-4 py-1.5 rounded-full text-xs font-bold inline-block"
              >
                {name || '# Tag Mẫu'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-[#334155] text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
              >
                Lưu Tag
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
