import { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                return {
                    success: false,
                    error: {
                        name: "Login Error",
                        message: error.message || "Invalid email or password",
                    },
                };
            }

            return {
                success: true,
                redirectTo: "/",
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    name: "Login Error",
                    message: "An unexpected error occurred",
                },
            };
        }
    },
    logout: async () => {
        try {
            await authClient.signOut();
            return {
                success: true,
                redirectTo: "/login",
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: "Failed to logout",
                    name: "Logout Error",
                },
            };
        }
    },
    check: async () => {
        try {
            const { data, error } = await authClient.getSession();

            if (error || !data?.session) {
                return {
                    authenticated: false,
                    redirectTo: "/login",
                    error: {
                        message: "Session expired",
                        name: "Unauthorized",
                    },
                };
            }

            return {
                authenticated: true,
            };
        } catch (error) {
            return {
                authenticated: false,
                redirectTo: "/login",
            };
        }
    },
    getPermissions: async () => {
        const { data } = await authClient.getSession();
        return (data?.user as any)?.role || null;
    },
    getIdentity: async () => {
        const { data } = await authClient.getSession();
        
        if (data?.user) {
            return {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                avatar: data.user.image,
                role: (data.user as any).role,
            };
        }
        
        return null;
    },
    onError: async (error) => {
        console.error("Auth provider error:", error);
        
        if (error.status === 401 || error.status === 403) {
            return {
                logout: true,
                redirectTo: "/login",
                error,
            };
        }
        
        return { error };
    },
};
