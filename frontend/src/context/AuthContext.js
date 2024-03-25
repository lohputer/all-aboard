import { createContext, useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null))
    let [loading, setLoading] = useState(true)
    let [boardGames, setBoardGames] = useState([]);
    let [currencies, setCurrencies] = useState([]);
    let [spaces, setSpaces] = useState([]);

    const navigate = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault();
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: e.target.username.value, password: e.target.password.value })
        });

        let data = await response.json();

        if(Object.keys(data).length > 1){
            localStorage.setItem("authTokens", JSON.stringify(data));
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            navigate("/");
        } else {
            alert("Wrong username or password.");
        }
    }

    let registerUser = async (e) => {
        e.preventDefault();
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: e.target.username.value, password: e.target.password.value, email: e.target.email.value })
        });
        const data = await response.json();
        if (data["message"] == 'User registered successfully') {
            navigate("/login")
        } else {
            alert("Something went wrong");
        }
    }

    let logoutUser = () => {
        localStorage.removeItem("authTokens");
        setAuthTokens(null);
        setUser(null);
    }

    const updateToken = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({refresh:authTokens?.refresh})
        });
       
        const data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("authTokens",JSON.stringify(data));
        } else {
            logoutUser();
        }

        if(loading){
            setLoading(false);
        }
    }

    useEffect(()=>{
        if (loading) {
            updateToken();
        }

        const fetchBoardGames = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/board-games/");
                const data = await response.json();
                console.log(data);
                setBoardGames(data["boards"]);
                setCurrencies(data["currencies"]);
                setSpaces(data["spaces"]);
            } catch (error) {
                console.error("Error fetching board games:", error);
            }
        };

        fetchBoardGames();

        const REFRESH_INTERVAL = 1000 * 60 * 4 
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken();
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval);

    },[authTokens, loading]);

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
        boardGames: boardGames,
        currencies: currencies,
        spaces: spaces
    }
    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}