import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../api/Apiservice';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await ApiService.getCurrentUser();
            if (response.success) {
                setUser(response.data);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Session expired. Please login again.');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await ApiService.logout();
            if (response.success) {
                toast.success('Logged out successfully');
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Error logging out');
        }
    };

    const renderProfileDetails = () => {
        if (!user?.profileDetails) return null;

        switch (user.userType.toLowerCase()) {
            case 'researcher':
                return (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Research Profile</h3>
                        <p><span className="font-medium">Institution:</span> {user.profileDetails.institution}</p>
                        <p><span className="font-medium">Research Area:</span> {user.profileDetails.researchArea}</p>
                        <p><span className="font-medium">Current Projects:</span> {user.profileDetails.currentProjects}</p>
                    </div>
                );

            case 'innovator':
            case 'entrepreneur':
                return (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Startup Profile</h3>
                        <p><span className="font-medium">Startup Name:</span> {user.profileDetails.startUpName}</p>
                        <p><span className="font-medium">Industry:</span> {user.profileDetails.industrySector}</p>
                        <p><span className="font-medium">Stage:</span> {user.profileDetails.developmentStage}</p>
                        <p><span className="font-medium">Funding Required:</span> {user.profileDetails.fundingRequirement ? 'Yes' : 'No'}</p>
                        {user.profileDetails.fundingRequirement && (
                            <p><span className="font-medium">Amount:</span> ₹{user.profileDetails.fundingAmount}</p>
                        )}
                    </div>
                );

            case 'mentor':
                return (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Mentor Profile</h3>
                        <p><span className="font-medium">Expertise Area:</span> {user.profileDetails.expertiseArea}</p>
                        <p><span className="font-medium">Experience:</span> {user.profileDetails.experienceYears} years</p>
                        <p><span className="font-medium">Availability:</span> {user.profileDetails.availability}</p>
                    </div>
                );

            case 'investor':
            case 'funding agency':
                return (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Investment Profile</h3>
                        <p><span className="font-medium">Focus Areas:</span> {user.profileDetails.focusAreas?.join(', ')}</p>
                        <p><span className="font-medium">Investment Range:</span> ₹{user.profileDetails.investmentCapacityRange}</p>
                        <p><span className="font-medium">Preferred Stage:</span> {user.profileDetails.fundingStagePreference}</p>
                        <p><span className="font-medium">Portfolio:</span> {user.profileDetails.portfolio}</p>
                    </div>
                );

            default:
                return <div>Profile details not available for this user type</div>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Welcome, {user?.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-medium">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Organization</p>
                            <p className="font-medium">{user?.organizationName || 'Not specified'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">User Type</p>
                            <p className="font-medium capitalize">{user?.userType}</p>
                        </div>
                    </div>
                </div>

                {renderProfileDetails()}
            </main>
        </div>
    );
};

export default Dashboard; 