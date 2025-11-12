const routes = {
  LANDING: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  STORE: "/storefront",
  GUESTS: "/guests",
  SETTINGS: "/settings",

  //   USERS: "/users",
  //   USERS_CREATE: "/users/create",
  //   USER: (userId: string) => `/users/${userId}`,
  //   USER_EDIT: (userId: string) => `/users/${userId}/edit`,

  ANY: "*",
  FORBIDDEN: "/forbidden",
};

const apiRoutes = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  INVITEES: "/invitees",
  INVITEE: (inviteeId: string) => `/invitees/${inviteeId}`,

  PROJECT_FOR_USER: (userId: string) => `/projects/user/${userId}`,
  ME: "/auth/me",

  // USERS: "/api/users",
  // USER: (userId: string) => `/api/users/${userId}`,
  // USER_EDIT: (userId: string) => `/api/users/${userId}/edit`,
};

export { routes, apiRoutes };
