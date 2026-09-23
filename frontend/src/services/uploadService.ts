import { fetchApi } from './api';

export interface UploadResponse {
  imageUrl: string;
  filename: string;
  contentType: string;
  size: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function uploadImageAdmin(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('maansarovar_jwt');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/admin/uploads/image`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const text = await response.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Upload failed with HTTP status ${response.status}: ${response.statusText}`);
    }
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Image upload failed (${response.status}).`);
  }

  return data.data;
}


export async function checkImageReferencesAdmin(filename: string): Promise<string[]> {
  return await fetchApi<string[]>(`/api/v1/admin/uploads/check-reference/${filename}`);
}

export async function deleteImageAdmin(filename: string): Promise<void> {
  await fetchApi<void>(`/api/v1/admin/uploads/image/${filename}`, {
    method: 'DELETE',
  });
}
