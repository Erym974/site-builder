import { Link } from "react-router-dom";

interface NotFoundProps {
    detail?: string;
    redirect?: string;
}

export default function NotFound({ detail = "Oops, il semblerait que tu sois perdu", redirect = "/" }: NotFoundProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <p className="text-8xl font-black text-gray-200 select-none">404</p>
            <h1 className="mt-2 text-2xl font-bold text-gray-800">Page introuvable</h1>
            <p className="mt-3 text-gray-500 max-w-sm">{detail}</p>
            <Link
                to={redirect}
                className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
            >
                Retour à l'accueil
            </Link>
        </div>
    );
}