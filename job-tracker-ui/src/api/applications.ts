import client from './client';
import type { Application } from '../types/application';

export async function getApplications(): Promise<Application[]> {
  const res = await client.get<Application[]>('/applications');
  return res.data;
}

export async function createApplication(app: Omit<Application, 'id'>): Promise<Application> {
  const res = await client.post<Application>('/applications', app);
  return res.data;
}

export async function updateApplication(id: number, app: Application): Promise<Application> {
  const res = await client.put<Application>(`/applications/${id}`, app);
  return res.data;
}

export async function updateApplicationStatus(id: number, status: string): Promise<Application> {
  const res = await client.patch<Application>(`/applications/${id}/status`, { status });
  return res.data;
}

export async function deleteApplication(id: number): Promise<void> {
  await client.delete(`/applications/${id}`);
}