import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from "./pages/Editor.tsx";
import Render from "./pages/Render.tsx";
import SiteSettings from "./pages/SiteSettings.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path={"/dashboard/:site"}>
                <Route path="site-settings" element={<SiteSettings />} />
                <Route path="builder" element={<Editor />} />
                <Route path="builder/*" element={<Editor />} />
                <Route path="render/:renderMode" element={<Render />} />
                <Route path="render/:renderMode/*" element={<Render />} />
            </Route>
            <Route path={"*"} element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
