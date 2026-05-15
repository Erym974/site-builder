import "@puckeditor/core/puck.css";
import {useQuery} from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {createSite, fetchSites} from "@/api.ts";
import type {Sites} from "@/type.ts";
import {useState} from "react";
import {Link} from "react-router-dom";

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

    return <>
        <h1>Mes sites</h1>
        <CreateSiteForm />
        {sites?.map((site: Sites) => (<>
            <span key={site.id}>{site.name}</span>
                <Link to={`/dashboard/${site.slug}/builder`}>Voir le site</Link>
            </>
        ))}
    </>;
}