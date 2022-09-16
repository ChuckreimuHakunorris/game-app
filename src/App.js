import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Unauthorized from "./components/Unauthorized";
import Missing from "./components/Missing";
import Admin from "./components/Admin";
import LinkPage from "./components/LinkPage";

import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="linkpage" element={<LinkPage />} />
                <Route path="unauthorized" element={<Unauthorized />} />

                {/* protected routes */}
                <Route element={<RequireAuth allowedRoles={[1000]}/>}>
                    <Route path="/" element={<Home />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={[9000]}/>}>
                    <Route path="admin" element={<Admin />} />
                </Route>
                {/* catch all */}
                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    )
}

export default App;