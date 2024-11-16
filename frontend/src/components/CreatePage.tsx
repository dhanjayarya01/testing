import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StartupForm from './forms/StartupForm';
import ResearchForm from './forms/ResearchForm';

const CreatePage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [type, setType] = useState('');

    const renderStep1 = () => (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="space-y-6 w-full px-4 sm:px-0">
                <h2 className="text-xl sm:text-2xl font-bold text-center">What would you like to create?</h2>
                <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 justify-center">
                    <button
                        onClick={() => {
                            setType('startup');
                            setStep(2);
                        }}
                        className={`w-full sm:w-64 p-4 sm:p-6 border rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all ${
                            type === 'startup' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                    >
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">Startup</h3>
                        <p className="text-sm sm:text-base text-gray-600">Create a new startup profile</p>
                    </button>
                    <button
                        onClick={() => {
                            setType('research');
                            setStep(2);
                        }}
                        className={`w-full sm:w-64 p-4 sm:p-6 border rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all ${
                            type === 'research' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                    >
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">Research</h3>
                        <p className="text-sm sm:text-base text-gray-600">Create a new research project</p>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderProgressBar = () => (
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                        step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                    }`}>
                        1
                    </div>
                    <div className={`h-1 w-8 sm:w-16 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base ${
                        step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                    }`}>
                        2
                    </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                    Step {step} of 2
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Combined Content Section */}
            <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto">
                <div className="flex-1 flex flex-col bg-white shadow-sm rounded-lg m-0 sm:m-6">
                    <div className="p-4 sm:p-6 md:p-8">
                        {renderProgressBar()}
                        {step === 1 ? renderStep1() : (
                            type === 'startup' ? <StartupForm /> : <ResearchForm />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;