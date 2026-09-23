const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('maansarovar_jwt');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch (err) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }


  if (!response.ok || (json.success !== undefined && !json.success)) {
    const errorMsg = json.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return json.data !== undefined ? json.data : json;
}

