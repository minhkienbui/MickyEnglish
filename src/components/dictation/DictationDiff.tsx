'use client';

import { DiffResult } from '@/lib/diffEngine';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

interface DictationDiffProps {
  diffResult: DiffResult;
  originalText: string;
}

export default function DictationDiff({ diffResult, originalText }: DictationDiffProps) {
  return (
    <div className="card-bibung bg-white space-y-4 border-green-200">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-base font-bold text-[#17261c] flex items-center gap-2">
          Kết quả chép chính tả
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-black ${
            diffResult.accuracy >= 80
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-amber-100 text-amber-700 border border-amber-300'
          }`}
        >
          Độ chính xác: {diffResult.accuracy}%
        </span>
      </div>

      {/* Color-coded Word Diff Container */}
      <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 leading-relaxed font-semibold text-sm flex flex-wrap gap-1.5">
        {diffResult.tokens.map((token, idx) => {
          if (token.status === 'correct') {
            return (
              <span
                key={idx}
                className="bg-green-100 text-green-800 px-2 py-0.5 rounded-lg border border-green-300 shadow-2xs font-bold"
                title="Đúng"
              >
                {token.word}
              </span>
            );
          }
          if (token.status === 'typo') {
            return (
              <span
                key={idx}
                className="bg-red-100 text-red-700 px-2 py-0.5 rounded-lg border border-red-300 font-bold line-through decoration-red-500"
                title={token.explanation}
              >
                {token.userWord} <span className="no-underline text-xs text-red-500">({token.word})</span>
              </span>
            );
          }
          if (token.status === 'missing') {
            return (
              <span
                key={idx}
                className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-300 font-bold border-dashed"
                title={token.explanation}
              >
                [{token.word}]
              </span>
            );
          }
          return (
            <span
              key={idx}
              className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-lg border border-gray-300 line-through text-xs"
              title="Từ thừa"
            >
              {token.word}
            </span>
          );
        })}
      </div>

      {/* Legend guide */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5b6a60] pt-1">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Từ đúng
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Sai chính tả
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Thiếu từ
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-400 inline-block" /> Thừa từ
        </span>
      </div>

      {/* Error Taxonomy Section */}
      {diffResult.errorTaxonomy.length > 0 && (
        <div className="bg-orange-50 p-3.5 rounded-xl border border-orange-200 text-xs text-orange-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-orange-700">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            Nhóm lỗi cần chú ý:
          </p>
          <ul className="list-disc pl-5 space-y-0.5 text-orange-800 font-medium">
            {diffResult.errorTaxonomy.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
