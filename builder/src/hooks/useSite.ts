import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {fetchSite} from "@/api.ts";

export function useSite() {
    const { site: siteId } = useParams<{ site: string }>();

    const { data: site, isLoading, isError } = useQuery({
        queryKey: ['site', siteId],
        queryFn: () => fetchSite(siteId!),
        enabled: !!siteId,
    });

    return { site, isLoading, isError };
}