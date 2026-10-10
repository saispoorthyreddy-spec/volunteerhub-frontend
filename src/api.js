
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Get the saved authentication token.
function getToken() {
  return localStorage.getItem("vh_token");
}

// Save or remove the authentication token.
function setToken(token) {
  if (token) {
    localStorage.setItem("vh_token", token);
  } else {
    localStorage.removeItem("vh_token");
  }
}

// Get the saved user.
function getUser() {
  try {
    const raw = localStorage.getItem("vh_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Save or remove the user.
function setUser(user) {
  if (user) {
    localStorage.setItem("vh_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("vh_user");
  }
}

// Common function for all API requests.
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
        "Unable to connect to the server. Please ensure the backend is running."
    );
  }

  if (response.status === 204) {
    return null;
  }

  let data = null;
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
        (data && typeof data === "object" &&
            (data.message || data.error)) ||
        (typeof data === "string" && data) ||
        `Request failed with status ${response.status}`;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

// Save authentication details returned by the backend.
function saveAuthResponse(response) {
  if (response && response.token) {
    setToken(response.token);

    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
    });
  }
}

export const api = {
  getToken,
  setToken,
  getUser,
  setUser,

  // Authentication APIs
  auth: {
    async register({ name, email, password, role }) {
      const response = await request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      saveAuthResponse(response);
      return response;
    },

    async login({ email, password }) {
      const response = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      saveAuthResponse(response);
      return response;
    },

    async getMe() {
      return request("/api/auth/me");
    },

    logout() {
      setToken(null);
      setUser(null);
    },
  },

  // Event APIs
  events: {
    list() {
      return request("/api/events");
    },

    get(id) {
      return request(`/api/events/${id}`);
    },

    getShifts(id) {
      return request(`/api/events/${id}/shifts`);
    },

    create(data) {
      return request("/api/events", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update(id, data) {
      return request(`/api/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete(id) {
      return request(`/api/events/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Shift APIs
  shifts: {
    browse(params = {}) {
      const query = new URLSearchParams();

      if (params.eventId) query.append("eventId", params.eventId);
      if (params.role) query.append("role", params.role);
      if (params.date) query.append("date", params.date);

      const queryString = query.toString()
          ? `?${query.toString()}`
          : "";

      return request(`/api/shifts${queryString}`);
    },

    get(id) {
      return request(`/api/shifts/${id}`);
    },

    create(eventId, data) {
      return request(`/api/events/${eventId}/shifts`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    edit(id, data) {
      return request(`/api/shifts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    close(id) {
      return request(`/api/shifts/${id}/close`, {
        method: "POST",
      });
    },

    reopen(id) {
      return request(`/api/shifts/${id}/reopen`, {
        method: "POST",
      });
    },

    getSignups(id) {
      return request(`/api/shifts/${id}/signups`);
    },
  },

  // Volunteer signup APIs
  signups: {
    join(shiftId) {
      return request(`/api/shifts/${shiftId}/signup`, {
        method: "POST",
      });
    },

    cancel(signupId) {
      return request(`/api/signups/${signupId}`, {
        method: "DELETE",
      });
    },

    mine() {
      return request("/api/signups/mine");
    },
  },

  // Dashboard APIs
  dashboards: {
    organizer() {
      return request("/api/organizer/dashboard");
    },

    volunteer() {
      return request("/api/volunteer/dashboard");
    },
  },

  // Notification APIs
  notifications: {
    list() {
      return request("/api/notifications");
    },
  },
};

export default api;
