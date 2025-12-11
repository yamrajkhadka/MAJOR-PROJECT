import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HeroPage from "./pages/HeroPage";
import NotFoundPage from "./pages/NotFoundPage";
function AppRoutes() {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<HeroPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;