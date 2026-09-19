import { Reservation, ReservationRequest } from '../types';
import { fetchApi } from './api';

export async function submitReservation(data: ReservationRequest): Promise<Reservation> {
  return await fetchApi<Reservation>('/api/v1/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getReservationsAdmin(status?: string, page = 0, size = 15): Promise<{ content: Reservation[]; totalElements: number }> {
  try {
    const url = status && status !== 'ALL' 
      ? `/api/v1/admin/reservations?status=${status}&page=${page}&size=${size}`
      : `/api/v1/admin/reservations?page=${page}&size=${size}`;
    const response = await fetchApi<{ content: Reservation[]; totalElements: number }>(url);
    return response;
  } catch (err) {
    // Return empty fallback list if admin endpoints unavailable
    return { content: [], totalElements: 0 };
  }
}

export async function updateReservationStatusAdmin(id: number, status: string): Promise<Reservation> {
  return await fetchApi<Reservation>(`/api/v1/admin/reservations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteReservationAdmin(id: number): Promise<void> {
  await fetchApi<void>(`/api/v1/admin/reservations/${id}`, {
    method: 'DELETE',
  });
}
