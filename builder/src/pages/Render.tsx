import {Render as PuckRender} from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import {config} from "../puck.config.tsx";
import { useParams } from "react-router-dom";
import {useSite} from "@/hooks/useSite.ts";
import {useQuery} from "@tanstack/react-query";
import {fetchPage} from "@/api.ts";
import NotFound from "@/pages/NotFound.tsx";

export default function Render() {
    const { renderMode, '*': splat } = useParams<{ renderMode: "draft" | "live", "*": string }>();
    const slug = '/' + (splat || '');
    const { site } = useSite()

    const { data: page, isError } = useQuery({
        queryKey: ['page', site?.slug, slug],
        queryFn: () => fetchPage(site!.slug, slug, renderMode!),
        enabled: !!site,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    if (isError) return <NotFound detail={`La page ${slug} n'existe pas.`} />;
    if (!page) return <span>Chargement...</span>;
    return <PuckRender config={config} data={page.content} />;
}