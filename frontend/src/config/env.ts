export const env = {
  API_BASE_URL:
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    'http://localhost:5000',
  APP_NAME: (import.meta.env.VITE_APP_NAME as string | undefined) ?? 'Kartly',
} as const;
