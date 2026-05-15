import { Navigate, Outlet } from 'react-router-dom';
import { useSite } from '@/hooks/useSite';

export function SiteRoute() {
    const { site, isLoading, isError } = useSite();

    if (isLoading) return null; // ou un spinner

    if (isError || !site) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}