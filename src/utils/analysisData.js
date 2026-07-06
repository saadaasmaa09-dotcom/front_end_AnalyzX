export function safeJsonParse(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('فشل تحويل analysis_result إلى JSON:', error);
    return null;
  }
}

export function unwrapHistoryResponse(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.history)) {
    return response.history;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}