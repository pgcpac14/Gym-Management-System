import { useSelector } from "react-redux";

import Logout from "./Logout";

function UserDashBoard() {

    const user = useSelector(
        state => state.auth.user
    )

    return (

        <div className="container mt-5">

            <div className="d-flex justify-content-between">

                <h2>
                    Dashboard
                </h2>

                <Logout />

            </div>

            <hr />

            <h4>
                Welcome {user?.username}
            </h4>

            <h5>
                User ID : {user?.userid}
            </h5>

            <h5>
                Role ID : {user?.role}
            </h5>

        </div>
    )
}

export default UserDashBoard;