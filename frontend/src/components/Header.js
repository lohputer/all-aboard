import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    let { user, logoutUser } = useState(AuthContext);
    return (
        <nav class="navbar navbar-default navbar-expand-sm navbar-dark">
            <div class="container-fluid">
                <Link class="navbar-brand" to="/"><h1 class="text-light">All-ABoard {user && user.username}!</h1></Link>
                <div class="navbar-nav">
                    <ul class="navbar-nav d-flex">
                        {!user ? 
                            <>
                                <li class="nav-item">
                                    <Link class="nav-link text-light" to="/register">Register</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link text-light" to="/login">Log In</Link>
                                </li>
                            </>
                        : 
                            <>
                                <li class="nav-item">
                                    <Link class="nav-link text-light" to="/create">Custom Create</Link>
                                </li>
                                <li class="nav-item">
                                    <span class="nav-link text-light" onClick={logoutUser}>Logout</span>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;