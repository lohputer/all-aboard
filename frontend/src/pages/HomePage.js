import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';

const HomePage = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            {user && 
                <div>
                    <p>You are logged in to the homepage!</p>
                    <p>Name: {user.username} </p>
                </div>
            }
        </>
    );
}

export default HomePage