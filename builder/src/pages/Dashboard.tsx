import "@puckeditor/core/puck.css";
import {useQuery} from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createSite, fetchSites} from "@/api.ts";
import type {Sites} from "@/type.ts";
import {useState} from "react";
import {Link} from "react-router-dom";
import {Globe, Plus} from "lucide-react";
import "@/styles/dashboard.css"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

function CreateSiteForm() {
    const [name, setName] = useState<string>("");
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createSite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sites"] });
            setName("");
        },
    });

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du site"
            />
            <button
                onClick={() => mutate({ name })}
                disabled={isPending || !name.trim()}
            >
                {isPending ? "Création..." : "Créer"}
            </button>
        </div>
    );
}

export default function Dashboard() {

    const { data: sites } = useQuery({
        queryKey: ['sites'],
        queryFn: fetchSites,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    if(!sites) return <></>

    return <>
        <main className="container mx-auto py-10 space-y-3">
            <section className="">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-heading md:text-4xl lg:text-5xl">
                    Mes sites
                </h2>
                <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <Dialog>
                        <DialogTrigger className="cursor-pointer group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-neutral-300 bg-transparent p-8 text-neutral-400 transition-all hover:border-primary hover:text-primary hover:bg-primary/5 min-h-[160px]">
                            <Plus className="h-8 w-8 transition-transform group-hover:scale-110" />
                            <span className="text-sm font-medium">Créer un site</span>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Créer un site</DialogTitle>
                            </DialogHeader>
                            <CreateSiteForm />
                        </DialogContent>
                    </Dialog>
                    {sites?.map((site: Sites) => (
                        <Link
                            key={site.id}
                            to={`/dashboard/${site.slug}/builder`}
                            className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                        >
                            {/* Cover image */}
                            <div className="relative h-36 w-full overflow-hidden bg-neutral-100">
                                {site.coverImage ? (
                                    <img
                                        src={site.coverImage}
                                        alt={site.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-100 to-neutral-200">
                                        <Globe className="h-10 w-10 text-neutral-400" />
                                    </div>
                                )}
                            </div>

                            {/* Card body */}
                            <div className="flex items-center gap-3 p-4">
                                {/* Logo */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
                                    {site.logo ? (
                                        <img
                                            src={site.logo}
                                            alt={`${site.name} logo`}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <Globe className="h-5 w-5 text-neutral-400" />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-heading">{site.name}</p>
                                    <p className="truncate text-xs text-neutral-400">{site.slug}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    </>;
}