import {blocksPlugin, createUsePuck, outlinePlugin, Puck} from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import {config} from "../puck.config.tsx";
import {useParams} from "react-router-dom";
import {pagesPlugin} from "../plugins/pagesPlugin.tsx";
import {useSite} from "@/hooks/useSite.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createPage, fetchPage, fetchPages, updatePuckPage} from "@/api.ts";
import {PreviewDropdown} from "@/components/PreviewDropdown.tsx";
import type {Pages} from "@/type.ts";

export default function Editor() {

    const { '*': splat } = useParams();
    const slug = '/' + (splat || '');
    const { site } = useSite()
    const queryClient = useQueryClient();

    const { data: page } = useQuery({
        queryKey: ['page', site?.slug, slug],
        queryFn: () => fetchPage(site!.slug, slug, "draft"),
        enabled: !!site,
        staleTime: 1000 * 60 * 5,
        retry: false,
    });

    const { data: pages } = useQuery({
        queryKey: ['pages', site?.slug],
        queryFn: () => fetchPages(site!.slug),
        enabled: !!site,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const saveDraftMutation = useMutation({
        mutationFn: updatePuckPage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["page", site?.slug, slug] });
        },
    });

    const createPageMutation = useMutation({
        mutationFn: createPage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pages", site?.slug] });
        },
    });

    const onAddPage = (name: string, parentPath: string) => {
        createPageMutation.mutate({ siteSlug: site!.slug, data: { parentPath, name } })
    }

    const onDeletePage = (page: Pages) => {
        console.log("delete page : ", page)
    }

    const onEditPage = (name:string, page: Pages) => {
        console.log("delete page : ", name, page)
    }

    if(!page) return <span>Chargement...</span>

    const usePuck = createUsePuck();

    return (
        <Puck
            key={slug}
            config={config}
            data={page.content}
            plugins={[pagesPlugin(pages ?? [], onAddPage, onDeletePage, onEditPage), blocksPlugin(), outlinePlugin()]}
            overrides={{
                headerActions: () => {
                    const appState = usePuck((s) => s.appState);

                    return (
                        <>
                            <PreviewDropdown pathname={slug} />
                            <button
                                className={"cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
                                onClick={() => {
                                    saveDraftMutation.mutate({ siteSlug: site!.slug, pageId: page!.id, mode: "draft", data: appState.data });
                                }}
                            >
                                Enregistrer le brouillon
                            </button>
                            <button
                                className={"cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}
                                onClick={() => {
                                    saveDraftMutation.mutate({ siteSlug: site!.slug, pageId: page!.id, mode: "live", data: appState.data });
                                }}
                            >
                                Publier en ligne
                            </button>
                        </>
                    );
                },
            }}
        />
    );
}