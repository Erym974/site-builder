import { useQuery } from '@tanstack/react-query';
import {fetchMe} from "@/api.ts";

export function useUser() {
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user', 'me'],
        queryFn: fetchMe,
        retry: false,
    });

    console.log(user)

    return {
        user,
        isLoading,
        isAuthenticated: !isError && !!user,
    };
}