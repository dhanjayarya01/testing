import React from 'react';

const UserProfile = ({ user }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-6">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-500">{user.userType}</p>
                    
                    {user.userType === "Researcher" && (
                        <div className="mt-4">
                            <p className="text-gray-600"><span className="font-semibold">Institution:</span> {user.profileDetails.institution}</p>
                            <p className="text-gray-600"><span className="font-semibold">Research Area:</span> {user.profileDetails.researchArea}</p>
                            <p className="text-gray-600"><span className="font-semibold">Current Projects:</span> {user.profileDetails.currentProjects}</p>
                        </div>
                    )}

                    {user.userType === "Innovator" && (
                        <div className="mt-4">
                            <p className="text-gray-600"><span className="font-semibold">Startup:</span> {user.profileDetails.startUpName}</p>
                            <p className="text-gray-600"><span className="font-semibold">Industry:</span> {user.profileDetails.industrySector}</p>
                            <p className="text-gray-600"><span className="font-semibold">Stage:</span> {user.profileDetails.developmentStage}</p>
                        </div>
                    )}
                </div>
                
                <div className="w-32 h-32 bg-gray-200 rounded-full">
                    {/* User image placeholder */}
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile; 