import React, {useState, useContext, useEffect} from 'react'
import AuthContext from '../context/AuthContext'
import { useParams, Link } from 'react-router-dom';
import '../App.css';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const { username } = useParams();
    const { user } = useContext(AuthContext);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user: username })
                })
                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.error('Error fetching profile: ', error);
            }
        };
        fetchProfile();
    }, [username]);

    return (
        <div className="text-light d-flex my-3 align-items-center justify-content-center">
            {profileData ? (
                <>
                    <div id="profileBg" className="col-lg-8 col-md-8 col-sm-6 col-6 p-3 justify-content-center">
                        <div className="row align-items-center">
                            {profileData['profile']['profilePic'] ? (
                                <img id="profilePic" className="col-3" src={`../images/${profileData.profile.profilePic.replace("frontend/public/images/", "")}`} alt="Profile Pic" />
                            ) : (
                                <img id="profilePic" className="col-3"  src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" alt="Default Avatar" />
                            )}
                            <div className="col-9">
                                <h3>Name: {profileData['profile']['user']}</h3>
                                <h3>Description</h3>
                                {user && user['username'] == profileData['profile']['user'] ? 
                                    <textarea className="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" type="text" rows={5} value={profileData['profile']['desc']} placeholder="Edit your description." />
                                : 
                                    <p>{profileData['profile']['desc']}</p>
                                }
                            </div>
                        </div>
                        {profileData['games'].length > 0 ?
                            <div className="d-flex justify-content-center">
                                {profileData['games'].map(game => (
                                    <div className="col text-center board m-2 p-2 col-lg-6 col-md-6 col-sm-12 col-12">
                                        <Link className="text-light text-decoration-none" to={{
                                            pathname: `/game/${game.id}`,
                                            state: { boardGame: game }
                                        }}>
                                            <h1>{ game.title }</h1>
                                            <p>{ game.desc }</p>
                                        </Link>
                                    </div> 
                                ))}
                            </div>
                        : 
                            <p className="my-3">This user has not created any games yet.</p>
                        }
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProfilePage;
