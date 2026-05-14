import {Puck} from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import {config} from "../puck.config.tsx";
import {useLocation} from "react-router-dom";
import {pagesPlugin} from "../plugins/pagesPlugin.tsx";

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

export default function Editor() {

    const { pathname } = useLocation();
    const slug = pathname.replace("/dashboard/builder", "") || "/";

    return (
        <Puck
            config={config}
            data={initialData}
            onPublish={(data) => {
                console.log("Page:", slug, data);
            }}
            plugins={[pagesPlugin]}
        >
            <Puck.Layout />
        </Puck>
    );
}