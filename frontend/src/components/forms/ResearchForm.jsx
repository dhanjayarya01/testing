import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResearchForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        field: '',
        status: 'Ongoing',
        keywords: [],
        collaborators: [],
        paper: null,
        supporting_documents: []
    });

    const [keywordInput, setKeywordInput] = useState('');
    const [collaboratorEmail, setCollaboratorEmail] = useState('');

    const handleAddKeyword = () => {
        if (keywordInput.trim()) {
            setFormData({
                ...formData,
                keywords: [...formData.keywords, keywordInput.trim()]
            });
            setKeywordInput('');
        }
    };

    const handleRemoveKeyword = (index) => {
        setFormData({
            ...formData,
            keywords: formData.keywords.filter((_, i) => i !== index)
        });
    };

    const handleAddCollaborator = () => {
        if (collaboratorEmail.trim() && !formData.collaborators.includes(collaboratorEmail.trim())) {
            setFormData({
                ...formData,
                collaborators: [...formData.collaborators, collaboratorEmail.trim()]
            });
            setCollaboratorEmail('');
        }
    };

    const handleRemoveCollaborator = (index) => {
        setFormData({
            ...formData,
            collaborators: formData.collaborators.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'keywords' || key === 'collaborators') {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else if (key === 'paper') {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            } else if (key === 'supporting_documents') {
                formData[key].forEach((doc) => {
                    formDataToSend.append('supporting_documents', doc);
                });
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch('/api/v1/research/create', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Research project created successfully!');
                navigate('/dashboard');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create research project');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Section */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Research Title</label>
                    <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter research title"
                    />
                </div>

                {/* Abstract Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Abstract</label>
                    <textarea
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows={6}
                        value={formData.abstract}
                        onChange={(e) => setFormData({...formData, abstract: e.target.value})}
                        placeholder="Provide a brief summary of your research"
                    />
                </div>

                {/* Field and Status Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Field of Research</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.field}
                            onChange={(e) => setFormData({...formData, field: e.target.value})}
                            placeholder="e.g., Computer Science"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                            <option value="Planning">Planning</option>
                        </select>
                    </div>
                </div>

                {/* Keywords Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Keywords</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            placeholder="Add keywords"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                        />
                        <button
                            type="button"
                            onClick={handleAddKeyword}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.keywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                            >
                                {keyword}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveKeyword(index)}
                                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200 transition-colors duration-200"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Collaborators Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Collaborators</label>
                    <div className="flex space-x-2">
                        <input
                            type="email"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={collaboratorEmail}
                            onChange={(e) => setCollaboratorEmail(e.target.value)}
                            placeholder="Enter collaborator's email"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCollaborator())}
                        />
                        <button
                            type="button"
                            onClick={handleAddCollaborator}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.collaborators.map((email, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                            >
                                {email}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCollaborator(index)}
                                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200 transition-colors duration-200"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* File Upload Sections */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Research Paper</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="paper-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id="paper-upload"
                                            type="file"
                                            className="sr-only"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setFormData({...formData, paper: e.target.files[0]})}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="supporting-docs-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Upload files</span>
                                        <input
                                            id="supporting-docs-upload"
                                            type="file"
                                            className="sr-only"
                                            multiple
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                supporting_documents: Array.from(e.target.files)
                                            })}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, DOC, Images up to 10MB each</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    Create Research Project
                </button>
            </div>
        </form>
    );
};

export default ResearchForm;