import { List } from "lucide-react";
import {PageList} from "@/components/pucks/addons/PageList.tsx";
import type {Pages} from "@/type.ts";

export const pagesPlugin = (
    pages: Pages[],
    onAddPage: (name: string, parentPath: string) => void,
    onDeletePage: (page: Pages) => void,
    onEditPage: (name: string, page: Pages) => void
) => ({
    name: "pages",
    label: "Pages",
    icon: <List />,
    render: () => <PageList pages={pages} onAddPage={onAddPage} onDeletePage={onDeletePage} onEditPage={onEditPage} />,
});