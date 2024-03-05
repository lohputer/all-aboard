import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreatePage from './pages/CreatePage'
import Header from './components/Header'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

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
                    <Route path="/create" element={<PrivateRoute><CreatePage/></PrivateRoute>}/>
                </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;