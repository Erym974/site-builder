import { useQuery } from '@tanstack/react-query';
import {fetchMe} from "@/api.ts";

export function useUser() {
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user', 'me'],
        queryFn: fetchMe,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    return {
        user,
        isLoading,
        isAuthenticated: !isError && !!user,
    };
}