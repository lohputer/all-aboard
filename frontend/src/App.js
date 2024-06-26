import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreatePage from './pages/CreatePage'
import Header from './components/Header'
import PrivateRoute from './utils/PrivateRoute'
import GamePage from './pages/GamePage'
import ProfilePage from './pages/ProfilePage'
import { AuthProvider } from './context/AuthContext'
import GenerateRoom from './pages/GenerateRoom'
import Room from './pages/Room'

function App() {
    return (
        <div className="App vw-100 vh-100">
            <Router>
              <AuthProvider>
                <Header/>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route exact path="/game/:gameId" element={<GamePage/>}/>
                    <Route exact path="/profile/:username" element={<ProfilePage/>}/>
                    <Route path="/create" element={<PrivateRoute><CreatePage/></PrivateRoute>}/>
                    <Route path="/generate" element={<PrivateRoute><GenerateRoom/></PrivateRoute>}/>
                    <Route exact path="/room/:roomCode" element={<PrivateRoute><Room/></PrivateRoute>}/>
                </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;