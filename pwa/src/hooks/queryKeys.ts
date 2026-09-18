export const queryKeys = {
  years: ['years'] as const,
  year: (id: string) => ['year', id] as const,
  regions: ['regions'] as const,
  offs: ['offs'] as const,
};
