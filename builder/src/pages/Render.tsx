import {Render as PuckRender} from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import {config} from "../puck.config.tsx";
import { useLocation, useParams } from "react-router-dom";

const initialData = {
    root: {
        props: {},
    },
    content: [
        {
            "type": "Heading",
            "props": {
                "title": "Test",
                "id": "Heading-d312b3e3-a0ae-403b-8d2f-cf18656e4219"
            }
        }
    ],
};

export default function Render() {
    const { renderMode } = useParams<{ renderMode: "live" | "draft" }>();
    const { pathname } = useLocation();
    const slug = pathname.replace(`/dashboard/render/${renderMode}`, "") || "/";

    console.log({ renderMode, slug });

    return <PuckRender config={config} data={initialData} />;
}