import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    const { user } = useContext(AuthContext);
    let { logoutUser } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: user['username'] })
                })
                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.error('Error fetching profile: ', error);
            }
        };
        fetchProfile();
    }, [user]);
    return (
        <nav class="navbar navbar-default navbar-expand-sm navbar-dark">
            <div class="container-fluid">
                <Link class="navbar-brand d-inline" to="/">
                    <h1 class="text-light">
                    All-ABoard
                    {user &&
                        <Link className="text-light text-decoration-none" to={{
                            pathname: `/profile/${user['username']}`,
                        }}>
                            {profileData && profileData['profile']['profilePic'] ? (
                                <img className="m-2" width="50" id="profilePic" src={`http://127.0.0.1:8000${profileData.profile.profilePic}`} alt="Profile Pic" />
                            ) : (
                                <img className="m-2" width="50" id="profilePic" src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" alt="Default Avatar" />
                            )}
                        </Link>
                    }
                    </h1>
                </Link>
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