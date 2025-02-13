export const ROUTES = {
    HOME: "/",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    EMAIL_VERIFICATION: "/auth/verification",
    FORGOT_PASSWORD: "/auth/forgot-password",
    DASHBOARD: "/dashboard",
    POLLS: "/polls",
    VOTER_POLLS: "/polls/voter",
    CREATE_POLL: "/polls/create",
    POLL_DETAILS: {
        STATIC: "/polls/:id",
        DYNAMIC: (id: string | number) => `/polls/${id}`,
    },
    EDIT_POLL: {
        STATIC: "/polls/:id/edit",
        DYNAMIC: (id: string | number) => `/polls/${id}/edit`,
    },
    VOTE: {
        STATIC: "/polls/:id/vote",
        DYNAMIC: (id: string | number) => `/polls/${id}/vote`,
    },
    POLL_RESULTS: { 
        STATIC: "/poll/:id/results",
        DYNAMIC: (id: string | number) => `/poll/${id}/results`,
    },
}