import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/applications';
import type { Application } from '../types/application';

const QUERY_KEY = ['applications'];

export function useApplications() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: api.getApplications,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useUpdateApplicationFull() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, application }: { id: number; application: Application }) =>
      api.updateApplication(id, application),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}