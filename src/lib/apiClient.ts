export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn(`[apiClient] Fetch failed for ${endpoint}:`, error);
    return null;
  }
}

export async function loginUserApi(email: string, name?: string) {
  return apiFetch<{ success: boolean; user: any }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, name }),
  });
}

export async function fetchVocabApi() {
  return apiFetch<{ success: boolean; words: any[] }>('/api/vocab');
}

export async function reviewVocabApi(wordId: string, rating: string) {
  return apiFetch<{ success: boolean; word: any }>('/api/vocab/review', {
    method: 'POST',
    body: JSON.stringify({ wordId, rating }),
  });
}

export async function fetchDictationApi() {
  return apiFetch<{ success: boolean; lessons: any[] }>('/api/dictation');
}

export async function fetchExamsApi() {
  return apiFetch<{ success: boolean; exams: any[] }>('/api/exams');
}

export async function submitExamApi(examId: string, userAnswers: Record<string, number>, userId?: string) {
  return apiFetch<{ success: boolean; result: any }>('/api/exams', {
    method: 'POST',
    body: JSON.stringify({ examId, userAnswers, userId }),
  });
}
