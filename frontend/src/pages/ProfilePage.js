import React, {useState, useContext, useEffect} from "react"
import AuthContext from "../context/AuthContext"
import { useParams, Link } from "react-router-dom";
import "../App.css";

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const { username } = useParams();
    const { user } = useContext(AuthContext);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log(username)
                const response = await fetch("http://127.0.0.1:8000/api/profile/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user: username })
                })
                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.error("Error fetching profile: ", error);
            }
        };
        fetchProfile();
    }, [username]);
    const profileChange = async (e) => {
        const formData = new FormData();
        formData.append("user", JSON.stringify(username));
        formData.append("desc", JSON.stringify(document.getElementById("desc").value));
        formData.append("pic", document.getElementById("photo-upload").files[0]);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/editprofile/", {
                method: "POST",
                body: formData
            })
            const data = await response.json();
            setProfileData(data);
            if (e.target.files) {
                window.location = `/profile/${username}`
            }
        } catch (error) {
            console.error("Error editing profile: ", error);
        }
    }
    return (
        <div className="text-light d-flex my-3 align-items-center justify-content-center">
            {profileData ? (
                <>
                <div id="profileBg" className="d-flex row col-lg-8 col-md-8 col-sm-10 col-10 p-3 align-items-center justify-content-center">
                    <div className="row align-items-center">
                        <div className="col-3">
                            <label className="d-flex" htmlFor="photo-upload" style={{ cursor: "pointer" }}>
                                {profileData.profile.profilePic ? (
                                    <img className="col-12" htmlFor="photo-upload" id="profilePic" src={`http://127.0.0.1:8000${profileData.profile.profilePic}`} alt="Profile Pic" />
                                ) : (
                                    <img className="col-12" htmlFor="photo-upload" id="profilePic" src="https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg" alt="Default Avatar" />
                                )}
                            </label>
                            {user && user.username === profileData.profile.user && (
                                <div>
                                    <input id="photo-upload" type="file" onChange={profileChange} file={profileData.profile.profilePic} style={{ display: "none" }} />
                                </div>
                            )}
                        </div>
                        <div className="col-9">
                            <h3>Name: {profileData.profile.user}</h3>
                            <h3>Description</h3>
                            {user && user.username === profileData.profile.user ? (
                                <textarea id="desc" onChange={profileChange} className="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" type="text" rows={4} defaultValue={profileData.profile.desc} placeholder="Edit your description." />
                            ) : (
                                <p>{profileData.profile.desc}</p>
                            )}
                        </div>
                    </div>
                    {profileData.games.length > 0 ? (
                        <div className="row d-flex justify-content-center">
                            {profileData.games.map(game => (
                                <div className="col text-center board m-2 p-2 col-5" key={game.id}>
                                    <Link className="text-light text-decoration-none" to={{
                                        pathname: `/game/${game.id}`,
                                        state: { boardGame: game }
                                    }}>
                                        <h1>{game.title}</h1>
                                        <p>{game.desc}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="my-3">This user has not created any games yet.</p>
                    )}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProfilePage;
