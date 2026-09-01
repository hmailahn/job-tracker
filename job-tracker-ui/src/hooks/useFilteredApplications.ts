import { useMemo } from 'react';
import type { Application } from '../types/application';

export function useFilteredApplications(
  applications: Application[] | undefined,
  query: string
) {
  return useMemo(() => {
    if (!applications) return [];
    if (!query.trim()) return applications;

    const q = query.toLowerCase();
    return applications.filter(
      (a) =>
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
    );
  }, [applications, query]);
}
