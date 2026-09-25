'use client';

import { useState } from 'react';
import { CheckCircle, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

interface WordMatchPair {
  en: string;
  vi: string;
}

export function WordMatchWidget({
  pairs,
  onComplete,
}: {
  pairs: WordMatchPair[];
  onComplete: () => void;
}) {
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [errorPair, setErrorPair] = useState<boolean>(false);

  const handleEnClick = (en: string) => {
    if (matched.includes(en)) return;
    setSelectedEn(en);
    setErrorPair(false);
  };

  const handleViClick = (vi: string) => {
    if (!selectedEn) return;
    const correctPair = pairs.find((p) => p.en === selectedEn && p.vi === vi);

    if (correctPair) {
      const newMatched = [...matched, selectedEn];
      setMatched(newMatched);
      setSelectedEn(null);
      setErrorPair(false);

      if (newMatched.length === pairs.length) {
        onComplete();
      }
    } else {
      setErrorPair(true);
      setTimeout(() => setErrorPair(false), 1000);
    }
  };

  return (
    <div className="card-bibung bg-white p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#17261c] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-600" /> Nối từ Tiếng Anh với Nghĩa Tiếng Việt
        </h3>
        <span className="badge-green">
          Đã nối {matched.length}/{pairs.length}
        </span>
      </div>

      {errorPair && (
        <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4" /> Chưa chính xác! Vui lòng chọn cặp tương ứng.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Column English */}
        <div className="space-y-2">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Tiếng Anh</p>
          {pairs.map((item) => {
            const isMatched = matched.includes(item.en);
            const isSelected = selectedEn === item.en;
            return (
              <button
                key={item.en}
                disabled={isMatched}
                onClick={() => handleEnClick(item.en)}
                className={`w-full p-3 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                  isMatched
                    ? 'bg-green-100 text-green-800 border-green-300 opacity-60'
                    : isSelected
                    ? 'bg-green-600 text-white border-green-600 shadow-md ring-2 ring-green-200'
                    : 'bg-gray-50 text-[#17261c] border-gray-200 hover:bg-gray-100'
                }`}
              >
                {item.en} {isMatched && '✓'}
              </button>
            );
          })}
        </div>

        {/* Column Vietnamese */}
        <div className="space-y-2">
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Tiếng Việt</p>
          {pairs.map((item) => {
            const isMatched = matched.includes(item.en);
            return (
              <button
                key={item.vi}
                disabled={isMatched}
                onClick={() => handleViClick(item.vi)}
                className={`w-full p-3 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                  isMatched
                    ? 'bg-green-100 text-green-800 border-green-300 opacity-60'
                    : 'bg-gray-50 text-[#17261c] border-gray-200 hover:bg-gray-100'
                }`}
              >
                {item.vi} {isMatched && '✓'}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SentenceOrderWidget({
  words,
  correctSentence,
  onSuccess,
}: {
  words: string[];
  correctSentence: string;
  onSuccess: () => void;
}) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const addWord = (w: string) => {
    setSelectedWords([...selectedWords, w]);
  };

  const removeWord = (index: number) => {
    const updated = [...selectedWords];
    updated.splice(index, 1);
    setSelectedWords(updated);
  };

  const checkOrder = () => {
    const userSentence = selectedWords.join(' ');
    const result = userSentence.trim().toLowerCase() === correctSentence.trim().toLowerCase();
    setIsCorrect(result);
    setIsSubmitted(true);
    if (result) onSuccess();
  };

  const reset = () => {
    setSelectedWords([]);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className="card-bibung bg-white p-6 space-y-4">
      <h3 className="text-base font-bold text-[#17261c]">Sắp xếp từ thành câu hoàn chỉnh</h3>

      {/* Answer Drop Area */}
      <div className="min-h-14 p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-wrap gap-2 items-center">
        {selectedWords.length === 0 && (
          <span className="text-xs text-gray-400 font-medium">Chạm vào các từ bên dưới để ghép câu...</span>
        )}
        {selectedWords.map((word, idx) => (
          <button
            key={idx}
            onClick={() => removeWord(idx)}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors shadow-2xs"
          >
            {word} ✕
          </button>
        ))}
      </div>

      {/* Bank Words */}
      <div className="flex flex-wrap gap-2 pt-1">
        {words.map((word, idx) => (
          <button
            key={idx}
            onClick={() => addWord(word)}
            className="px-3.5 py-2 bg-white text-[#17261c] border border-gray-300 rounded-xl text-xs font-bold hover:bg-gray-100 shadow-2xs cursor-pointer"
          >
            {word}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={reset} className="text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> Làm lại
        </button>

        <button onClick={checkOrder} className="btn-primary py-2 px-5 text-xs">
          Kiểm tra
        </button>
      </div>

      {isSubmitted && (
        <div className={`p-3 rounded-xl text-xs font-bold ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
          {isCorrect ? '✓ Chính xác! Bạn xếp câu chuẩn 100%.' : '✕ Chưa đúng. Hãy thử sắp xếp lại nhé!'}
        </div>
      )}
    </div>
  );
}

export function FillInBlankWidget({
  parts,
  answers,
  hints,
}: {
  parts: string[];
  answers: string[];
  hints?: string[];
}) {
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const checkAnswers = () => {
    let correct = 0;
    answers.forEach((ans, idx) => {
      const userAns = (userInputs[idx] || '').trim().toLowerCase();
      if (userAns === ans.toLowerCase()) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  return (
    <div className="card-bibung bg-white p-6 space-y-4">
      <h3 className="text-base font-bold text-[#17261c]">Điền từ vào chỗ trống trong đoạn văn</h3>
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-[#17261c] leading-relaxed font-medium">
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < answers.length && (
              <input
                type="text"
                value={userInputs[idx] || ''}
                onChange={(e) => setUserInputs({ ...userInputs, [idx]: e.target.value })}
                placeholder={hints ? hints[idx] : `[Chỗ trống ${idx + 1}]`}
                className={`inline-block mx-1 px-2.5 py-1 rounded-lg border text-xs font-bold w-32 text-center transition-all ${
                  submitted
                    ? (userInputs[idx] || '').trim().toLowerCase() === answers[idx].toLowerCase()
                      ? 'bg-green-100 border-green-500 text-green-900 font-extrabold'
                      : 'bg-red-100 border-red-500 text-red-900 font-extrabold'
                    : 'bg-white border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100'
                }`}
              />
            )}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            setUserInputs({});
            setSubmitted(false);
          }}
          className="text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm lại
        </button>

        <button onClick={checkAnswers} className="btn-primary py-2 px-5 text-xs">
          Kiểm tra chỗ trống
        </button>
      </div>

      {submitted && (
        <div className={`p-3 rounded-xl text-xs font-bold ${score === answers.length ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
          {score === answers.length
            ? '✓ Tuyệt vời! Bạn đã điền chính xác 100% các từ.'
            : `Đã điền đúng ${score}/${answers.length} chỗ trống. Đáp án đúng: ${answers.join(', ')}.`}
        </div>
      )}
    </div>
  );
}

