import { Routes, Route } from "react-router-dom";

import LoginComp from "./components/LoginComp";
import RegisterComp from "./components/RegisterComp";
import UserDashBoard from "./components/UserDashBoard";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {

  return (
    <Routes>

      <Route
        path="/"
        element={<LoginComp />}
      />

      <Route
        path="/register"
        element={<RegisterComp />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <UserDashBoard />
          </ProtectedRoutes>
        }
      />

    </Routes>
  )
}

export default App;