import { Link } from "react-router-dom";

function RegisterComp() {

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card p-4">

                        <h2 className="text-center mb-4">
                            Register
                        </h2>

                        <input
                            className="form-control mb-3"
                            placeholder="First Name"
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Last Name"
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Email"
                        />

                        <input
                            className="form-control mb-3"
                            placeholder="Username"
                        />

                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Password"
                        />

                        <button className="btn btn-success">
                            Register
                        </button>

                        <p className="mt-3">

                            Already Registered ?

                            <Link to="/">
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default RegisterComp