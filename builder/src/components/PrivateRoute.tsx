import { Outlet } from 'react-router-dom';
import { useUser } from '@/hooks/useUser.ts';
import {config} from "@/app.config.ts";

export function PrivateRoute() {
    const { isLoading, isAuthenticated } = useUser();

    if (isLoading) return null;

    if (!isAuthenticated) return window.location.href = `${config.API_URL}/auth/login`;

    return <Outlet />;
}