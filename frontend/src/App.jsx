import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect } from 'react';
import { ApiContext } from './context/Context';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

function App() {
    const { 
        apiContext, 
        isLoggedIn, 
        setIsLoggedIn, 
        setCurrentuserinfo,
        currentuserinfo
    } = useContext(ApiContext);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsLoggedIn(false);
                    return;
                }

                const response = await apiContext.getCurrentUser();
                if (response.success) {
                    setCurrentuserinfo(response.data);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsLoggedIn(false);
                localStorage.removeItem('token');
            }
        };

        checkAuthStatus();
    }, [setCurrentuserinfo]);

   
    const ProtectedRoute = ({ children }) => {
        if (!isLoggedIn) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <Router>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                    isLoggedIn ? <Navigate to="/home"  /> : <LoginPage />
                } />
                <Route path="/login" element={
                    isLoggedIn ? <Navigate to="/home"  /> : <LoginPage />
                } />
                <Route path="/register" element={
                    <RegisterPage />
                } />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />

                {/* Catch all route ,koi bhi  unknownroute pe jayega toh home pe jayega */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
