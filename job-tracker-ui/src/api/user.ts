import client from './client';

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await client.put('/auth/change-password', { currentPassword, newPassword });
  return res.data;
}
