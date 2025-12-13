import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Pages
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function AppRoutes() {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;