import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const StartupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        industry: '',
        stage: '',
        team_size: '',
        website: '',
        social_links: {
            linkedin: '',
            twitter: ''
        },
        logo: null,
        pitch_deck: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'social_links') {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else if (key === 'logo' || key === 'pitch_deck') {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch('/api/v1/startups/create', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Startup created successfully!');
                navigate('/dashboard');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create startup');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.industry}
                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                        <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.stage}
                            onChange={(e) => setFormData({...formData, stage: e.target.value})}
                        >
                            <option value="">Select Stage</option>
                            <option value="Idea">Idea</option>
                            <option value="MVP">MVP</option>
                            <option value="Early Stage">Early Stage</option>
                            <option value="Growth">Growth</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.team_size}
                            onChange={(e) => setFormData({...formData, team_size: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            placeholder="https://"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">Social Links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">LinkedIn</label>
                            <input
                                type="url"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.social_links.linkedin}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    social_links: { ...formData.social_links, linkedin: e.target.value }
                                })}
                                placeholder="https://linkedin.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Twitter</label>
                            <input
                                type="url"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.social_links.twitter}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    social_links: { ...formData.social_links, twitter: e.target.value }
                                })}
                                placeholder="https://twitter.com/..."
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={(e) => setFormData({...formData, logo: e.target.files[0]})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pitch Deck</label>
                        <input
                            type="file"
                            accept=".pdf,.ppt,.pptx"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            onChange={(e) => setFormData({...formData, pitch_deck: e.target.files[0]})}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    Create Startup
                </button>
            </div>
        </form>
    );
};

export default StartupForm;