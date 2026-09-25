'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Copy,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Upload,
} from 'lucide-react';
import AdminVideoModal from '@/components/admin/AdminVideoModal';
import { useAdminVideoStore } from '@/stores/useAdminVideoStore';
import { DictationLesson, VideoStatus } from '@/lib/types';

export default function AdminVideosPage() {
  const {
    videos,
    searchQuery,
    selectedTag,
    selectedLevel,
    selectedStatus,
    currentPage,
    pageSize,
    setSearchQuery,
    setSelectedTag,
    setSelectedLevel,
    setSelectedStatus,
    setCurrentPage,
    setPageSize,
    addVideo,
    updateVideo,
    toggleVideoStatus,
    softDeleteVideo,
    restoreVideo,
    hardDeleteVideo,
  } = useAdminVideoStore();

  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views' | 'name'>('newest');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<DictationLesson | null>(null);
  const [deleteConfirmVideo, setDeleteConfirmVideo] = useState<DictationLesson | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Filter & Sort
  const filteredAndSortedVideos = useMemo(() => {
    let result = videos.filter((v) => {
      // 1. Search Query
      const matchesSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.youtubeId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.topic || '').toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Tag Filter
      const matchesTag = selectedTag === 'all' || (v.tags && v.tags.includes(selectedTag));

      // 3. Level Filter
      const matchesLevel = selectedLevel === 'all' || v.level === selectedLevel;

      // 4. Status Filter
      const isDeleted = v.status === 'deleted';
      let matchesStatus = true;
      if (selectedStatus === 'all') {
        matchesStatus = !isDeleted;
      } else if (selectedStatus === 'deleted') {
        matchesStatus = isDeleted;
      } else {
        matchesStatus = v.status === selectedStatus;
      }

      return matchesSearch && matchesTag && matchesLevel && matchesStatus;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
      if (sortBy === 'oldest') return (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0);
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [videos, searchQuery, selectedTag, selectedLevel, selectedStatus, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedVideos.length / pageSize) || 1;
  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedVideos.slice(start, start + pageSize);
  }, [filteredAndSortedVideos, currentPage, pageSize]);

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedVideos.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkStatusChange = (newStatus: VideoStatus) => {
    selectedIds.forEach((id) => updateVideo(id, { status: newStatus }));
    showToast(`✓ Đã đổi trạng thái ${selectedIds.length} video sang "${newStatus}".`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} video đã chọn?`)) {
      selectedIds.forEach((id) => softDeleteVideo(id));
      showToast(`🗑️ Đã chuyển ${selectedIds.length} video vào thùng rác.`);
      setSelectedIds([]);
    }
  };

  // Duplicate Video
  const handleDuplicate = (video: DictationLesson) => {
    const copy = {
      ...video,
      title: `${video.title} (Bản sao)`,
      views: 0,
      createdAt: Date.now(),
    };
    addVideo(copy);
    showToast(`📋 Đã nhân bản video "${video.title}" thành công!`);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast thông báo */}
      {toastMsg && (
        <div className="bg-emerald-950/90 border border-emerald-500 py-2.5 px-4 rounded-2xl text-xs font-black text-emerald-300 flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER TRANG VIDEO */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-white">Quản lý Video</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black">
              {videos.length} video
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium pt-1">
            Quản lý bài học YouTube, phân chia cấp độ, chỉnh sửa transcript và trạng thái hiển thị
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/videos/new"
            className="px-5 py-2.5 bg-[#22c55e] hover:bg-emerald-600 text-white rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>＋ Thêm video mới</span>
          </Link>
        </div>
      </div>

      {/* SEARCH & FILTERS TOOLBAR */}
      <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-3xl space-y-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, YouTube ID, chủ đề..."
              className="w-full bg-[#0f172a] border border-[#334155] focus:border-emerald-500 rounded-2xl py-2 pl-9 pr-4 text-xs text-white font-medium outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Level Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white font-bold outline-none cursor-pointer"
            >
              <option value="all">Tất cả cấp độ</option>
              <option value="A1">A1 - Sơ cấp</option>
              <option value="A2">A2 - Cơ bản</option>
              <option value="B1">B1 - Trung cấp</option>
              <option value="B2">B2 - Khá</option>
              <option value="C1">C1 - Cao cấp</option>
              <option value="C2">C2 - Thành thạo</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white font-bold outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Công khai (Published)</option>
              <option value="hidden">Ẩn (Hidden)</option>
              <option value="draft">Bản nháp (Draft)</option>
              <option value="deleted">Thùng rác (Trash)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-2xl py-2 px-3 text-xs text-white font-bold outline-none cursor-pointer"
            >
              <option value="newest">Sắp xếp: Mới nhất</option>
              <option value="oldest">Sắp xếp: Cũ nhất</option>
              <option value="views">Sắp xếp: Xem nhiều nhất</option>
              <option value="name">Sắp xếp: Tên A-Z</option>
            </select>
          </div>
        </div>

        {/* BULK ACTIONS BAR (Khi chọn nhiều checkbox) */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-[#0f172a] border border-emerald-500/50 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <span className="text-xs font-black text-emerald-400">
              Đang chọn {selectedIds.length} video
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkStatusChange('published')}
                className="px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Công khai
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('hidden')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Ẩn video
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
              >
                Xóa {selectedIds.length} video
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BẢNG DANH SÁCH VIDEO */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] border-b border-[#334155] text-slate-400 uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-3 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={paginatedVideos.length > 0 && selectedIds.length === paginatedVideos.length}
                    className="w-4 h-4 rounded-sm bg-[#1e293b] border-[#334155] text-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-3">Thumbnail</th>
                <th className="py-3.5 px-3">Tiêu đề & URL</th>
                <th className="py-3.5 px-3">Tags</th>
                <th className="py-3.5 px-3 text-center">Cấp độ</th>
                <th className="py-3.5 px-3 text-center">Số câu</th>
                <th className="py-3.5 px-3 text-center">Lượt xem</th>
                <th className="py-3.5 px-3 text-center">Trạng thái</th>
                <th className="py-3.5 px-3 text-center">Nổi bật</th>
                <th className="py-3.5 px-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {paginatedVideos.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 font-bold">
                    Không tìm thấy video nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                paginatedVideos.map((video) => {
                  const isDeleted = video.status === 'deleted';
                  const isPublished = video.status === 'published';
                  const isChecked = selectedIds.includes(video.id);

                  return (
                    <tr
                      key={video.id}
                      className={`hover:bg-[#273549]/60 transition-colors ${
                        isChecked ? 'bg-emerald-950/20' : isDeleted ? 'opacity-60 bg-rose-950/10' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelect(video.id)}
                          className="w-4 h-4 rounded-sm bg-[#0f172a] border-[#334155] text-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Thumbnail */}
                      <td className="py-3 px-3">
                        <div className="w-[60px] h-[40px] rounded-lg overflow-hidden bg-black border border-[#334155] relative shrink-0">
                          <img
                            src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-3 px-3 max-w-xs">
                        <p className="font-black text-white truncate hover:text-emerald-300">{video.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {video.youtubeId ? `ID: ${video.youtubeId}` : video.topic}
                        </p>
                      </td>

                      {/* Tags */}
                      <td className="py-3 px-3 max-w-[150px]">
                        <div className="flex flex-wrap gap-1">
                          {(video.tags || ['# Video']).slice(0, 2).map((t, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-[#0f172a] border border-[#334155] text-slate-300 text-[10px] font-bold truncate max-w-[110px]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Level */}
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-black text-[10px]">
                          {video.level || 'B1'}
                        </span>
                      </td>

                      {/* Sentences */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                        {video.sentences?.length || video.totalSentences || 0} câu
                      </td>

                      {/* Views */}
                      <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">
                        {(video.views || 0).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {!isDeleted ? (
                          <button
                            type="button"
                            onClick={() => toggleVideoStatus(video.id)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                              isPublished
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {isPublished ? '✓ Hiển thị' : '⊘ Đang ẩn'}
                          </button>
                        ) : (
                          <span className="px-2 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-black">
                            Đã xóa
                          </span>
                        )}
                      </td>

                      {/* Pinned Star */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => updateVideo(video.id, { isPinned: !video.isPinned })}
                          className="cursor-pointer"
                          title="Ghim nổi bật"
                        >
                          <Star
                            className={`w-4 h-4 mx-auto ${
                              video.isPinned ? 'fill-amber-400 text-amber-400' : 'text-slate-600 hover:text-slate-400'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isDeleted ? (
                            <>
                              <Link
                                href={`/dictation-shadowing/${video.id}?mode=shadowing`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155]"
                                title="Xem trước bài học"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>

                              <button
                                type="button"
                                onClick={() => handleDuplicate(video)}
                                className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] text-purple-400 hover:text-purple-300 border border-[#334155] cursor-pointer"
                                title="Nhân bản video"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setVideoToEdit(video);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-[#334155] text-emerald-400 hover:text-emerald-300 border border-[#334155] cursor-pointer"
                                title="Chỉnh sửa video"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeleteConfirmVideo(video)}
                                className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-[#334155] cursor-pointer"
                                title="Xóa video"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                restoreVideo(video.id);
                                showToast(`✓ Đã khôi phục video "${video.title}".`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" /> Khôi phục
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Phân trang */}
        <div className="p-4 border-t border-[#334155] bg-[#0f172a] flex items-center justify-between text-xs font-bold text-slate-400">
          <span>
            Hiển thị {paginatedVideos.length} / {filteredAndSortedVideos.length} video (Trang {currentPage} / {totalPages})
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl bg-[#1e293b] border border-[#334155] text-slate-300 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Trước
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl bg-[#1e293b] border border-[#334155] text-slate-300 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            >
              Sau <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL THÊM / SỬA VIDEO */}
      <AdminVideoModal
        isOpen={isModalOpen}
        videoToEdit={videoToEdit}
        onClose={() => setIsModalOpen(false)}
        onSave={(videoData) => {
          if (videoToEdit) {
            updateVideo(videoToEdit.id, videoData);
            showToast('✓ Đã cập nhật video thành công!');
          } else {
            addVideo(videoData);
            showToast('🎉 Đã thêm video mới!');
          }
        }}
      />

      {/* DIALOG XÁC NHẬN XÓA VIDEO */}
      {deleteConfirmVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] p-6 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Xác nhận xóa video</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Bạn có chắc chắn muốn xóa video <strong className="text-white">"{deleteConfirmVideo.title}"</strong>?
              <br />
              <span className="text-rose-400 pt-1 block">
                Xóa video này sẽ chuyển vào thùng rác và có thể khôi phục trong 30 ngày.
              </span>
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmVideo(null)}
                className="px-4 py-2 border border-[#334155] hover:bg-[#334155] text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  softDeleteVideo(deleteConfirmVideo.id);
                  showToast(`🗑️ Đã xóa video "${deleteConfirmVideo.title}".`);
                  setDeleteConfirmVideo(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-md"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
