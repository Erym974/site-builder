import { useState } from "react";
import { X } from "lucide-react";

interface PageModalProps {
    mode: "add" | "edit";
    initialName?: string;
    onConfirm: (name: string) => void;
    onClose: () => void;
}

export function PageModal({ mode, initialName = "", onConfirm, onClose }: PageModalProps) {
    const [name, setName] = useState(initialName);

    return (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-800">
                        {mode === "add" ? "Ajouter une page" : "Modifier la page"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                    </button>
                </div>

                <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onConfirm(name.trim()); }}
                    placeholder="Nom de la page"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={() => { if (name.trim()) onConfirm(name.trim()); }}
                        disabled={!name.trim()}
                        className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40"
                    >
                        {mode === "add" ? "Ajouter" : "Enregistrer"}
                    </button>
                </div>
            </div>
        </div>
    );
}