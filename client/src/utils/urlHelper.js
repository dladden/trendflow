const API_BASE_URL = import.meta.env.VITE_DEV_API_BASE_URL || '';
const FRONTEND_BASE_URL = import.meta.env.VITE_DEV_BASE_URL || '';

export const getFullIconUrl = (iconUrl) => `${API_BASE_URL}${iconUrl}`;

export const getFullTrendUrl = (slug) =>
  `${FRONTEND_BASE_URL}/dashboard/trend/${slug}`;
