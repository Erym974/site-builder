import {useNavigate, useParams} from "react-router-dom";
import { useState } from "react";
import {FileText, Plus, Trash2, ChevronRight, Pencil} from "lucide-react";
import { useSite } from "@/hooks/useSite.ts";
import {PageModal} from "@/components/pucks/addons/PageModal.tsx";
import {useQueryClient} from "@tanstack/react-query";

interface Page {
    id: string;
    path: string;
    title: string;
}

interface PageNode extends Page {
    children: PageNode[];
}

function buildTree(pages: Page[]): PageNode[] {
    const map = new Map<string, PageNode>();
    const roots: PageNode[] = [];

    const sorted = [...pages].sort((a, b) => a.path.localeCompare(b.path));

    for (const page of sorted) {
        map.set(page.path, { ...page, children: [] });
    }

    for (const [path, node] of map) {
        const parts = path.split("/").filter(Boolean);
        if (parts.length <= 1) {
            roots.push(node);
        } else {
            const parentPath = "/" + parts.slice(0, -1).join("/");
            const parent = map.get(parentPath);
            if (parent) {
                parent.children.push(node);
            } else {
                roots.push(node);
            }
        }
    }

    return roots;
}

interface ContextMenu {
    x: number;
    y: number;
    page: PageNode;
}

interface PageNodeItemProps {
    node: PageNode;
    depth: number;
    onContextMenu: (e: React.MouseEvent, page: PageNode) => void;
}

function PageNodeItem({ node, depth, onContextMenu }: PageNodeItemProps) {
    const [expanded, setExpanded] = useState(true);
    const navigate = useNavigate();
    const { site } = useSite();
    const { '*': splat } = useParams();
    const currentSlug = '/' + (splat || '');
    const isActive = node.path === currentSlug;

    const hasChildren = node.children.length > 0;

    const queryClient = useQueryClient();

    return (
        <div>
            <div
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer group select-none
                    ${isActive
                    ? "bg-gray-200 border-gray-900 text-gray-900"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                style={{ paddingLeft: `${depth * 16 + 8}px` }}
                onClick={() => {
                    navigate(`/dashboard/${site!.slug}/builder${node.path}`, { replace: true });
                    queryClient.invalidateQueries({ queryKey: ["page", site?.slug, currentSlug] });
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    onContextMenu(e, node);
                }}
            >
                {hasChildren ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <ChevronRight size={14} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
                    </button>
                ) : (
                    <span className="w-3.5" />
                )}
                <FileText size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm text-gray-700 truncate">{node.title}</span>
                <span className="text-xs text-gray-400 ml-auto hidden group-hover:block truncate max-w-[80px]">{node.path}</span>
            </div>

            {expanded && hasChildren && (
                <div>
                    {node.children.map((child) => (
                        <PageNodeItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            onContextMenu={onContextMenu}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface PageListProps {
    pages: Page[];
    onAddPage: (name: string, parentPath: string) => void;
    onDeletePage: (page: Page) => void;
    onEditPage: (name: string, page: Page) => void;
}

type ModalState =
    | { type: "add"; parentPath: string }
    | { type: "edit"; page: PageNode }
    | null;

export function PageList({ pages, onAddPage, onDeletePage, onEditPage }: PageListProps) {
    const [modal, setModal] = useState<ModalState>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
    const tree = buildTree(pages);

    const handleContextMenu = (e: React.MouseEvent, page: PageNode) => {
        setContextMenu({ x: e.clientX, y: e.clientY, page });
    };

    return (
        <div
            className="w-full"
            onClick={() => setContextMenu(null)}
        >
            <div className="flex items-center justify-between px-4 py-1 mb-1 pt-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages</span>
                <button
                    onClick={() => { setModal({ type: "add", parentPath: "/" }); setContextMenu(null); }}
                    className="cursor-pointer text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <Plus size={15} />
                </button>
            </div>

            {tree.map((node) => (
                <PageNodeItem
                    key={node.id}
                    node={node}
                    depth={0}
                    onContextMenu={handleContextMenu}
                />
            ))}

            {contextMenu && (
                <div
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    className="fixed z-9999 w-44 rounded-lg border border-gray-200 bg-white shadow-lg py-1"
                >
                    <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => { setModal({ type: "add", parentPath: contextMenu.page.path }); setContextMenu(null); }}
                    >
                        <Plus size={14} /> Ajouter une page
                    </button>
                    <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => { setModal({ type: "edit", page: contextMenu.page }); setContextMenu(null); }}
                    >
                        <Pencil size={14} /> Modifier
                    </button>
                    <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => { onDeletePage(contextMenu.page); setContextMenu(null); }}
                    >
                        <Trash2 size={14} /> Supprimer
                    </button>
                </div>
            )}

            {modal && (
                <PageModal
                    mode={modal.type === "add" ? "add" : "edit"}
                    initialName={modal.type === "edit" ? modal.page.title : ""}
                    onClose={() => setModal(null)}
                    onConfirm={(name) => {
                        if (modal.type === "add") onAddPage(name, modal.parentPath);
                        if (modal.type === "edit") onEditPage(name, modal.page);
                        setModal(null);
                    }}
                />
            )}
        </div>
    );
}