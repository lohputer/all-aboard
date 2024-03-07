import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import '../App.css'

const ProfilePage = () => {
    let { username } = useParams();
    const [ profileData, setData ] = useState({})
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: username })
                });
                const data = await response.json();
                setData(data);
                return (
                    <div className="text-light m-2 p-2">
                        <div className="row">
                            {profileData['profile']['profilePic'] ?
                                <img className="col-4" 
                                    src={`../images/${profileData['profile']['profilePic'].replace("frontend/public/images/", "")}`}  
                                />
                            : 
                                <img className="col-4" src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" />
                            }
                            <h1 className="col-8">{ username }</h1>
                        </div>
                    </div>
                );
            } catch (error) {
                console.error('Error fetching profile: ', error);
            }
        };
        fetchProfile();
        return () => {
            
        };
    }, [username]);
} 

export default ProfilePage