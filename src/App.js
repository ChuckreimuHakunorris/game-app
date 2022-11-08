import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Unauthorized from "./components/Unauthorized";
import Missing from "./components/Missing";
import Admin from "./components/Admin";
import Game from "./components/Game";
import LinkPage from "./components/LinkPage";
import RoomList from "./components/RoomList";
import Profile from "./components/Profile";
import Players from "./components/Players";

import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
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
                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth allowedRoles={[1000]} />}>
                        <Route path="/" element={<Home />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="game" element={<Game />} />
                        <Route path="rooms" element={<RoomList />} />
                        <Route path="players" element={<Players />} />
                        <Route path="rooms/:id" element={<Game />} />
                    </Route>
                    
                    <Route element={<RequireAuth allowedRoles={[9000]} />}>
                        <Route path="admin" element={<Admin />} />
                    </Route>
                </Route>

                {/* catch all */}
                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    )
}

export default App;