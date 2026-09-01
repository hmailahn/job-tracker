import { useMemo } from 'react';
import type { Application } from '../types/application';

export function useStats(applications: Application[] | undefined) {
  return useMemo(() => {
    if (!applications || applications.length === 0) {
      return {
        total: 0,
        responseRate: 0,
        activeCount: 0,
        avgDaysToResponse: null as number | null,
      };
    }

    const total = applications.length;

    // "responded" = moved past Applied stage
    const responded = applications.filter((a) => a.status !== 'APPLIED');
    const responseRate = Math.round((responded.length / total) * 100);

    const active = applications.filter(
      (a) => !['REJECTED', 'WITHDRAWN'].includes(a.status)
    );

    // average days since applying, for applications still awaiting a response
    const stillWaiting = applications.filter((a) => a.status === 'APPLIED');
    let avgDaysToResponse: number | null = null;
    if (stillWaiting.length > 0) {
      const now = Date.now();
      const totalDays = stillWaiting.reduce((sum, a) => {
        const applied = new Date(a.appliedDate).getTime();
        return sum + (now - applied) / (1000 * 60 * 60 * 24);
      }, 0);
      avgDaysToResponse = Math.round(totalDays / stillWaiting.length);
    }

    return {
      total,
      responseRate,
      activeCount: active.length,
      avgDaysToResponse,
    };
  }, [applications]);
}