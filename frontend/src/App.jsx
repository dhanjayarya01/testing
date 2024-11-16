import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect, useCallback, memo } from 'react';
import { ApiContext } from './context/Context';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import CreatePage from './components/CreatePage';

const App = memo(() => {
    const { 
        apiContext, 
        isLoggedIn, 
        setIsLoggedIn, 
        setCurrentuserinfo,
        currentuserinfo
    } = useContext(ApiContext);

    const checkAuthStatus = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoggedIn(false);
                return;
            }

            setIsLoggedIn(true);

            const response = await apiContext.getCurrentUser();
            if (response?.success) {
                setCurrentuserinfo(response?.data);
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
    }, [apiContext, setIsLoggedIn, setCurrentuserinfo]);
    
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const ProtectedRoute = useCallback(({ children }) => {
        if (!isLoggedIn) {
            return <Navigate to="/login" replace />;
        }
        return children;
    }, [isLoggedIn]);

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
                <Route path="/home" element={
                <Home/>
                } />
                <Route path="/" element={
                  <LoginPage />
                } />
                <Route path="/register" element={
                    <RegisterPage />
                } />
                <Route path="/create" element={
                    <CreatePage />
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

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function
    return true; // Only re-render when currentuserinfo changes through the useEffect
});

App.displayName = 'App';

export default App;
