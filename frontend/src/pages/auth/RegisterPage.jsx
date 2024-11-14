import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ApiContext } from '../../context/Context.jsx';
import { useContext } from 'react';
const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [remindLater, setRemindLater] = useState(false);

    const {apiContext}=useContext(ApiContext)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        userType: '',
        organizationName: '',
        profileDetails: {}
    });

    const userTypes = [
        "Researcher",
        "Innovator",
        "Entrepreneur",
        "Mentor",
        "Investor",
        "Funding Agency",
        "Policy Maker",
        "IPR Professional",
    ];

    const handleBasicInfoChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileDetailsChange = (field, value) => {
        setFormData({
            ...formData,
            profileDetails: {
                ...formData.profileDetails,
                [field]: value
            }
        });
    };

    const renderProfileDetailsForm = () => {
        switch(formData.userType) {
            case 'Researcher':
                return (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Institution"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('institution', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Research Area"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('researchArea', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Current Projects"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('currentProjects', e.target.value)}
                        />
                    </div>
                );

            case 'Innovator':
            case 'Entrepreneur':
                return (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Startup Name"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('startUpName', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Industry Sector"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('industrySector', e.target.value)}
                        />
                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('developmentStage', e.target.value)}
                        >
                            <option value="">Select Development Stage</option>
                            <option value="Prototype">Prototype</option>
                            <option value="MVP">MVP</option>
                            <option value="Scaling">Scaling</option>
                        </select>
                        <div>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    onChange={(e) => handleProfileDetailsChange('fundingRequirement', e.target.checked)}
                                />
                                Funding Required
                            </label>
                        </div>
                        {formData.profileDetails.fundingRequirement && (
                            <input
                                type="number"
                                placeholder="Funding Amount"
                                className="w-full p-2 border rounded"
                                onChange={(e) => handleProfileDetailsChange('fundingAmount', e.target.value)}
                            />
                        )}
                    </div>
                );

            case 'Mentor':
                return (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Expertise Area"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('expertiseArea', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Years of Experience"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('experienceYears', e.target.value)}
                        />
                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('availability', e.target.value)}
                        >
                            <option value="">Select Availability</option>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Flexible">Flexible</option>
                        </select>
                    </div>
                );

            case 'Investor':
            case 'Funding Agency':
                return (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Focus Areas (comma separated)"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('focusAreas', e.target.value.split(','))}
                        />
                        <input
                            type="text"
                            placeholder="Investment Capacity Range"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('investmentCapacityRange', e.target.value)}
                        />
                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('fundingStagePreference', e.target.value)}
                        >
                            <option value="">Select Funding Stage Preference</option>
                            <option value="Seed">Seed</option>
                            <option value="Series A">Series A</option>
                            <option value="Series B">Series B</option>
                            <option value="Growth">Growth</option>
                        </select>
                        <textarea
                            placeholder="Portfolio Details"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('portfolio', e.target.value)}
                        />
                    </div>
                );

            case 'Policy Maker':
                return (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Department Name"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('departmentName', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Role Title"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('roleTitle', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Interest Area"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('interestArea', e.target.value)}
                        />
                    </div>
                );

            case 'IPR Professional':
                return (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Specialization"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('specialization', e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Years of Experience"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('experienceYears', e.target.value)}
                        />
                        <textarea
                            placeholder="Notable Cases"
                            className="w-full p-2 border rounded"
                            onChange={(e) => handleProfileDetailsChange('notableCases', e.target.value)}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    const validateStep1 = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.userType) {
            toast.error('Please fill all required fields');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!formData.profileDetails) {
            toast.error('Please fill in your profile details');
            return false;
        }

        switch(formData.userType) {
            case 'Researcher':
                if (!formData.profileDetails.institution || 
                    !formData.profileDetails.researchArea || 
                    !formData.profileDetails.currentProjects) {
                    toast.error('Please fill all research profile fields');
                    return false;
                }
                break;
          
        }

        if (!acceptedTerms && !remindLater) {
            toast.error('Please accept terms or choose to complete profile later');
            return false;
        }

        return true;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep2()) return;
        setLoading(true);

        try {
            const response = await apiContext.register(formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <p className="text-center text-sm text-gray-600 mb-2">
                        Step {step} of 2: {step === 1 ? 'Basic Information' : 'Profile Details'}
                    </p>

                    <div className="flex justify-center items-center space-x-3 mb-4">
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            step === 1 ? 'bg-indigo-600' : 'border-2 border-gray-300'
                        }`}></div>
                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            step === 2 ? 'bg-indigo-600' : 'border-2 border-gray-300'
                        }`}></div>
                    </div>
                    
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form className="mt-8 space-y-6">
                        <div className="rounded-md shadow-sm space-y-4">
                            <input
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                onChange={handleBasicInfoChange}
                            />
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                onChange={handleBasicInfoChange}
                            />
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                onChange={handleBasicInfoChange}
                            />
                            <select
                                name="userType"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                onChange={handleBasicInfoChange}
                            >
                                <option value="">Select User Type</option>
                                {userTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Next
                            </button>
                            
                            <div className="text-center">
                                <span className="text-sm text-gray-600">Already have an account? </span>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {renderProfileDetailsForm()}

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                    I accept the terms and conditions
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remindLater"
                                    checked={remindLater}
                                    onChange={(e) => setRemindLater(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remindLater" className="ml-2 block text-sm text-gray-900">
                                    Complete my profile later
                                </label>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading || (!acceptedTerms && !remindLater)}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                    (!acceptedTerms && !remindLater) ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;