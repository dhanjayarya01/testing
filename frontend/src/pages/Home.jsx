import React, { useContext } from 'react';
import { ApiContext } from '../context/Context';
import UserProfile from '../components/UserProfile';
import WalletCard from '../components/WalletCard';

const Home = () => {
    const { currentuserinfo } = useContext(ApiContext);
    const hasWalletAccess = ["Researcher", "Innovator"].includes(currentuserinfo.userType);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
                <UserProfile user={currentuserinfo} />
                
                {hasWalletAccess && <WalletCard />}
                
                <div className="bg-gray-900 text-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4">Startup Opportunities</h3>
                    <p className="text-gray-300">
                        Discover new opportunities and connect with potential partners.
                    </p>
                    <button className="mt-4 bg-white text-gray-900 px-4 py-2 rounded hover:bg-gray-100">
                        Explore Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home; 