import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

import { useNavigate } from "react-router-dom";

function Logout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {

        dispatch(logout());

        navigate("/");
    }

    return (

        <button
            className="btn btn-danger"
            onClick={logoutHandler}
        >
            Logout
        </button>

    )
}

export default Logout;