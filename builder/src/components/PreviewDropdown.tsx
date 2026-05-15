import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, ChevronDown, Eye } from "lucide-react";
import { useSite } from "@/hooks/useSite.ts";

export function PreviewDropdown({ pathname }: { pathname: string }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { site } = useSite();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                buttonRef.current?.contains(e.target as Node) ||
                dropdownRef.current?.contains(e.target as Node)
            ) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOpen = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
        }
        setOpen((o) => !o);
    };

    return (
        <>
            <button
                ref={buttonRef}
                onClick={handleOpen}
                className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                <Eye size={15} />
                Aperçu
                <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && createPortal(
                <div
                    ref={dropdownRef}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute w-40 rounded-md border border-gray-200 bg-white shadow-md z-[9999]"
                >
                    <button
                        className="w-full flex items-center gap-2 cursor-pointer text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                            setOpen(false);
                            window.open(`/dashboard/${site!.slug}/render/live${pathname}`, "_blank");
                        }}
                    >
                        <ExternalLink size={15} /> Vue live
                    </button>
                    <button
                        className="w-full flex items-center gap-2 cursor-pointer text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                            setOpen(false);
                            window.open(`/dashboard/${site!.slug}/render/draft${pathname}`, "_blank");
                        }}
                    >
                        <ExternalLink size={15} /> Vue draft
                    </button>
                </div>,
                document.body
            )}
        </>
    );
}