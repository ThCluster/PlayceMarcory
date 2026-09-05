// Client HTTP centralisé pour communiquer avec le backend Django.
// Utilise fetch natif (aucune dépendance supplémentaire nécessaire).
// Le token JWT est stocké dans localStorage et ajouté automatiquement à chaque requête.

const ACCESS_TOKEN_KEY = 'carrefour_access_token';
const REFRESH_TOKEN_KEY = 'carrefour_refresh_token';

export interface LoginResponse {
  access: string;
  refresh: string;
  utilisateur: {
    id_employe: number;
    nom: string;
    prenom: string;
    email: string;
    poste: string;
    actif: boolean;
  };
}

export const tokens = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setAccess: (t: string) => localStorage.setItem(ACCESS_TOKEN_KEY, t),
  setRefresh: (t: string) => localStorage.setItem(REFRESH_TOKEN_KEY, t),
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

async function parseResponse(response: Response): Promise<any> {
  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // corps vide ou non-JSON
  }

  if (!response.ok) {
    const detail =
      data?.detail ||
      (Array.isArray(data) ? data.map((d: any) => d.detail).join(', ') : null) ||
      data?.message ||
      `Erreur ${response.status}`;
    const message = typeof detail === 'string' ? detail : 'Une erreur est survenue';
    throw new ApiError(message, response.status);
  }
  return data;
}

async function request(path: string, options: RequestInit = {}, withAuth = true): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (withAuth) {
    const token = tokens.getAccess();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
    // On désactive le cache HTTP du navigateur pour les appels API :
    // évite d'afficher d'anciennes réponses (ex. total_achats à 0) après
    // un correctif backend, puis qu'elles « reviennent » au rechargement.
    cache: 'no-store',
  });

  // Si le token a expiré (401) et qu'un refresh existe, on tente de le renouveler une fois.
  if (response.status === 401 && withAuth && tokens.getRefresh()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const retry = await fetch(`/api${path}`, {
        ...options,
        headers: { ...headers, Authorization: `Bearer ${tokens.getAccess()}` },
      });
      return parseResponse(retry);
    }
  }

  return parseResponse(response);
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = tokens.getRefresh();
  if (!refresh) return false;
  try {
    const response = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!response.ok) {
      tokens.clear();
      return false;
    }
    const data = await response.json();
    tokens.setAccess(data.access);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  get: <T = any>(path: string, withAuth = true) => request(path, { method: 'GET' }, withAuth),
  post: <T = any>(path: string, body?: any, withAuth = true) =>
    request(path, { method: 'POST', body: JSON.stringify(body ?? {}) }, withAuth),
  patch: <T = any>(path: string, body?: any, withAuth = true) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }, withAuth),
  delete: <T = any>(path: string, withAuth = true) => request(path, { method: 'DELETE' }, withAuth),
};

// ---- Endpoints spécifiques au projet ----

export async function loginBackend(email: string, password: string): Promise<LoginResponse> {
  const data = await api.post<LoginResponse>('/utilisateurs/login/', { email, mot_de_passe: password }, false);
  tokens.setAccess(data.access);
  tokens.setRefresh(data.refresh);
  return data;
}

export async function logoutBackend(): Promise<void> {
  tokens.clear();
}