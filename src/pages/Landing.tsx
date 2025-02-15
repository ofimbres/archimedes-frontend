import React from 'react'
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div>
            <h1>Landing</h1>
            <p>This is the landing page.</p>

            <Link to="/signin">
                <button className="btn btn-outline-primary">Sign in</button>
            </Link>
        </div>
    );
}

export default Landing;