import React, { useContext, useState, useEffect } from 'react';
import { ApiContext } from '../context/Context';

const UserProfile = ({ user }) => {
    const { apiContext } = useContext(ApiContext);
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const response = await apiContext.getWalletBalance();
            setWalletData(response.data);
        } catch (error) {
            console.error('Error fetching wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* User Details Card */}
            <div className="bg-white rounded-lg shadow-md p-4 h-[100px]">
                <div className="flex items-center space-x-4">
                    {/* Profile Image */}
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-900 truncate">{user.name}</h2>
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                                {user.userType}
                            </span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-600">
                            {user.userType === "Researcher" ? (
                                <>
                                    <span className="truncate">{user.profileDetails.institution}</span>
                                    <span className="mx-2">•</span>
                                    <span className="text-gray-500">{user.profileDetails.currentProjects} Projects</span>
                                </>
                            ) : (
                                <>
                                    <span className="truncate">{user.profileDetails.startUpName}</span>
                                    <span className="mx-2">•</span>
                                    <span className="text-gray-500">{user.profileDetails.developmentStage}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Details Card */}
            <div className="bg-white rounded-lg shadow-md p-4 h-[100px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-gray-500">Loading wallet...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-between h-full">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
                            <div className="text-xl font-bold text-indigo-600 mt-1">
                                ₹{walletData?.balance || 0}
                            </div>
                        </div>
                        <button 
                            className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors"
                            onClick={() => {/* Add your add funds logic */}}
                        >
                            Add Funds
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile; 