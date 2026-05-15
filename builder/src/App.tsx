import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Editor from "./pages/Editor.tsx";
import Render from "./pages/Render.tsx";
import SiteSettings from "./pages/SiteSettings.tsx";
import NotFound from "./pages/NotFound.tsx";
import {PrivateRoute} from "./components/PrivateRoute.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import {SiteRoute} from "@/components/SiteRoute.tsx";

function App() {

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
                retry: false,
            },
        },
    });

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
            <Route index element={<Navigate to={"/dashboard"} />} />
            <Route element={<PrivateRoute />}>
                <Route path={"/dashboard"} element={<Dashboard />} />
                <Route path={"/dashboard/:site"} element={<SiteRoute />}>
                    <Route path="site-settings" element={<SiteSettings />} />
                    <Route path="builder" element={<Editor />} />
                    <Route path="builder/*" element={<Editor />} />
                    <Route path="render/:renderMode" element={<Render />} />
                    <Route path="render/:renderMode/*" element={<Render />} />
                </Route>
            </Route>
            <Route path={"*"} element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    </>
  )
}

export default App
