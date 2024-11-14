import React, { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../context/Context';

const WalletCard = () => {
    const { apiContext } = useContext(ApiContext);
    const [walletData, setWalletData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWalletData();
    }, [walletData,setWalletData]);

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

    if (loading) return <div>Loading wallet...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h3 className="text-xl font-semibold mb-4">Wallet</h3>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-600">Current Balance</p>
                    <p className="text-2xl font-bold text-indigo-600">₹{walletData?.balance || 0}</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Add Funds
                </button>
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-500">Recent Transactions</p>
                <div className="mt-2 space-y-2">
                    {walletData?.transactions?.slice(0, 3).map((transaction, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                                {transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount}
                            </span>
                            <span className="text-gray-500">{new Date(transaction.timestamp).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WalletCard; 