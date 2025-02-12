export const ROUTES = {
    HOME: "/",
    PRICING: "/pricing",
    PLAYGROUND: {
        STATIC: "/playground/:id",
        DYNAMIC: (id: string | number) => `/playground/${id}`,
    },
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    EMAIL_VERIFICATION: "/auth/verification",
    FORGOT_PASSWORD: "/auth/forgot-password",
    DASHBOARD: "/dashboard"
}