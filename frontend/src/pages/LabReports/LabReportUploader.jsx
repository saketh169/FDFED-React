import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Leaf, TestTube, Factory, Activity, Upload, Scale, TrendingUp, Calendar, Droplet, Eye } from 'lucide-react';
import axios from 'axios';
import { useAuthContext } from '../../hooks/useAuthContext';

// --- Icon components for the category buttons ---
const CategoryIcon = ({ icon, label, isActive, onClick }) => {
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      className={`
      flex flex-col items-center justify-center p-4 m-2 w-36 h-36 md:w-40 md:h-40 text-center rounded-xl transition-all duration-300 transform shadow-lg
      ${isActive
        ? 'bg-[#27AE60] text-white ring-4 ring-[#27AE60]/30 scale-[1.02] shadow-[#27AE60]/50'
        : 'bg-white text-gray-700 hover:bg-[#27AE60]/10 hover:shadow-xl'
      }
      `}
    >
      <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-white' : 'text-[#27AE60]'}`} />
      <span className="text-sm font-semibold mt-1">{label}</span>
    </button>
  );
};

// --- Reusable Form Input Component (Now uses React Hook Form register) ---
const FormInput = ({ label, type = 'text', required = false, unit = '', ...registerProps }) => {
  const isFile = type === 'file';

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>} {unit && <span className="text-gray-500">({unit})</span>}
      </label>
      {isFile ? (
        <div className="flex flex-col space-y-2">
          <input
            type="file"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#27AE60]/10 file:text-[#27AE60] hover:file:bg-[#27AE60]/20"
            required={required}
            {...registerProps}
          />
        </div>
      ) : (
        <input
          type={type}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] transition duration-150"
          required={required}
          {...registerProps}
        />
      )}
    </div>
  );
};// --- The Main Application Component ---
const LabReportUploader = () => {
  // Initialize the form using React Hook Form
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuthContext();
 
  // === NEW STATE: Array to track active forms in order of selection ===
  const [activeFormsOrder, setActiveFormsOrder] = useState([]);

  // === NEW STATE: Loading and error states ===
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = useMemo(() => [
    { id: 'Hormonal_Issues', label: 'Hormonal Issues', icon: TrendingUp, description: 'Enter specific metrics for endocrine and reproductive health.' },
    { id: 'Fitness_Metrics', label: 'Fitness & Body Metrics', icon: Scale, description: 'Key body composition and lifestyle data for weight goals.' },
    { id: 'General_Reports', label: 'General Checkup', icon: TestTube, description: 'Upload your primary health screening report and fill in key metrics.' },
    { id: 'Blood_Sugar_Focus', label: 'Blood & Sugar Focus', icon: Droplet, description: 'Detailed reports and values for glucose and lipids.' },
    { id: 'Thyroid', label: 'Thyroid', icon: Factory, description: 'Detailed thyroid panel results (TSH, Free T4, Antibodies) and related reports.' },
    { id: 'Cardiovascular', label: 'Heart & Cardiac', icon: Heart, description: 'Cardiovascular health, blood pressure, and ECG details.' },
  ], []);

  // === NEW LOGIC: Toggles a form and maintains the order array ===
  const toggleCategory = useCallback((categoryId) => {
    setActiveFormsOrder(prevOrder => {
      const index = prevOrder.indexOf(categoryId);
      if (index > -1) {
        // Form is active: Remove it
        const newOrder = [...prevOrder];
        newOrder.splice(index, 1);
        return newOrder;
      } else {
        // Form is inactive: Add it to the end and scroll to it
        const newOrder = [...prevOrder, categoryId];
        // Scroll to the form section after a short delay to allow rendering
        setTimeout(() => {
          const formSection = document.getElementById(`form-section-${categoryId}`);
          if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        return newOrder;
      }
    });
  }, []);


  // Submission handler function
  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      setSubmitError('Authentication required. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Get auth token from AuthContext
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Create FormData for multipart upload
      const formData = new FormData();

      // Add submitted categories
      formData.append('submittedCategories', JSON.stringify(activeFormsOrder));

      // Add category data objects
      const categoryDataMap = {
        Hormonal_Issues: {
          testosteroneTotal: data.testosteroneTotal,
          dheaS: data.dheaS,
          cortisol: data.cortisol,
          vitaminD: data.vitaminD
        },
        Fitness_Metrics: {
          heightCm: data.heightCm,
          currentWeight: data.currentWeight,
          bodyFatPercentage: data.bodyFatPercentage,
          activityLevel: data.activityLevel,
          additionalInfo: data.additionalInfo
        },
        General_Reports: {
          dateOfReport: data.dateOfReport,
          bmiValue: data.bmiValue,
          currentWeight: data.currentWeight,
          heightCm: data.heightCm
        },
        Blood_Sugar_Focus: {
          fastingGlucose: data.fastingGlucose,
          hba1c: data.hba1c,
          cholesterolTotal: data.cholesterolTotal,
          triglycerides: data.triglycerides
        },
        Thyroid: {
          tsh: data.tsh,
          freeT4: data.freeT4,
          reverseT3: data.reverseT3,
          thyroidAntibodies: data.thyroidAntibodies
        },
        Cardiovascular: {
          systolicBP: data.systolicBP,
          diastolicBP: data.diastolicBP,
          spO2: data.spO2,
          restingHeartRate: data.restingHeartRate
        }
      };

      // Add only data for active categories
      activeFormsOrder.forEach(categoryId => {
        if (categoryDataMap[categoryId]) {
          formData.append(categoryId.toLowerCase(), JSON.stringify(categoryDataMap[categoryId]));
        }
      });

      // Add files
      const fileFields = [
        'hormonalProfileReport', 'endocrineReport', 'generalHealthReport', 'bloodTestReport',
        'bloodSugarReport', 'diabetesReport', 'thyroidReport', 'cardiacHealthReport',
        'cardiovascularReport', 'ecgReport'
      ];

      fileFields.forEach(fieldName => {
        if (data[fieldName] && data[fieldName].length > 0) {
          // React Hook Form returns FileList, so we iterate through it
          Array.from(data[fieldName]).forEach(file => {
            formData.append('files', file);
          });
        }
      });

      // Send to API
      await axios.post('/api/lab-reports', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSubmitSuccess(true);
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);

      // Reset form after successful submission
      setActiveFormsOrder([]);

    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit lab report. Please try again.';
      setSubmitError(errorMessage);
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle simulated file viewing
  const handleViewFile = useCallback((filename) => {
  const message = `Simulating file view for: ${filename}. In a real application, a PDF/image viewer would open here.`;
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');

    if (messageBox && messageText) {
      messageText.textContent = message;
      // Temporarily change color for the view action
      messageBox.classList.remove('hidden', 'bg-green-500');
      messageBox.classList.add('bg-blue-500');

      setTimeout(() => {
        messageBox.classList.add('hidden');
        // Revert color back to the default submit color
        messageBox.classList.remove('bg-blue-500');
        messageBox.classList.add('bg-green-500');
      }, 5000);
    }
  }, []);


  // --- Centralized Form Rendering Function ---
  const renderFormContent = useCallback((categoryId) => {
    // Find the category metadata for title and description
    const categoryMeta = categories.find(c => c.id === categoryId);

    // Default structure for every form section
    const FormWrapper = ({ title, description, children }) => (
      <>
        <h2 className="text-2xl font-bold text-[#1A4A40] mb-2 flex items-center">
          <span className="mr-2">
            <categoryMeta.icon className='w-6 h-6' />
          </span>
          {title} Details
        </h2>
        <p className="text-gray-600 mb-6 border-b border-[#27AE60]/20 pb-4">{description}</p>
        {children}
      </>
    );

    switch (categoryId) {
     
      case 'Hormonal_Issues': 
        return (
          <FormWrapper {...categoryMeta}>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Hormonal Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormInput label="Total Testosterone" type="number" unit="ng/dL" {...register('testosteroneTotal')} />
                <FormInput label="DHEA-S" type="number" unit="$\mu$g/dL" {...register('dheaS')} />
                <FormInput label="Cortisol (AM)" type="number" unit="nmol/L" {...register('cortisol')} />
                <FormInput label="Vitamin D" type="number" unit="ng/mL" {...register('vitaminD')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <FormInput 
                  label="Upload Hormonal Profile Report" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('hormonalProfileReport')} 
                />
                <FormInput 
                  label="Upload General Endocrine Report" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('endocrineReport')} 
                />
              </div>
            </div>
          </FormWrapper>
        );      case 'Fitness_Metrics':
        return (
          <FormWrapper {...categoryMeta}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Height" type="number" unit="cm" {...register('heightCm')} />
              <FormInput label="Current Weight" type="number" unit="kg" {...register('currentWeight')} />
              <FormInput label="Body Fat Percentage" type="number" unit="%" {...register('bodyFatPercentage')} />
             
              {/* Activity Level - using register props directly on select */}
              <div className="flex flex-col space-y-1">
                <label htmlFor="activityLevel" className="text-sm font-medium text-gray-700">Activity Level</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] transition duration-150"
                  {...register('activityLevel')} 
                >
                  <option value="">Select Level</option>
                  <option value="sedentary">Sedentary (Little or no exercise)</option>
                  <option value="light">Lightly Active (1-3 days/week)</option>
                  <option value="moderate">Moderately Active (3-5 days/week)</option>
                  <option value="very">Very Active (6-7 days/week)</option>
                  <option value="extra">Extra Active (2x per day/training)</option>
                </select>
              </div>
             
              {/* Additional Info - using register props directly on textarea */}
              <div className="flex flex-col space-y-1 md:col-span-2">
                <label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">Additional Health Information (E.g., Allergies, Medications)</label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] transition duration-150"
                  {...register('additionalInfo')}
                />
              </div>
            </div>
          </FormWrapper>
        );

      case 'General_Reports':
        return (
          <FormWrapper {...categoryMeta}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormInput label="Date of Latest Report" type="date" {...register('dateOfReport')} />
                <FormInput label="BMI Value" type="number" unit="kg/m²" {...register('bmiValue')} />
                <FormInput label="Weight at Time of Report" type="number" unit="kg" {...register('currentWeight')} />
                <FormInput label="Height at Time of Report" type="number" unit="cm" {...register('heightCm')} />
              </div>
              <FormInput
                label="Upload General Health Report (PDF/Image)"
                type="file"
                onView={handleViewFile} 
                {...register('generalHealthReport')}
              />
            </div>
          </FormWrapper>
        );

      case 'Blood_Sugar_Focus':
        return (
          <FormWrapper {...categoryMeta}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormInput label="Fasting Glucose" type="number" unit="mg/dL" {...register('fastingGlucose')} />
                <FormInput label="HbA1c" type="number" unit="\%" {...register('hba1c')} />
                <FormInput label="Total Cholesterol" type="number" unit="mg/dL" {...register('cholesterolTotal')} />
                <FormInput label="Triglycerides" type="number" unit="mg/dL" {...register('triglycerides')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput 
                  label="Upload General Blood Test Report" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('bloodTestReport')} 
                />
                <FormInput 
                  label="Upload Blood Sugar Report (Fasting/PP)" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('bloodSugarReport')} 
                />
                <FormInput 
                  label="Upload Diabetes/HbA1c Report" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('diabetesReport')} 
                />
              </div>
            </div>
          </FormWrapper>
        );

      case 'Thyroid': 
        return (
          <FormWrapper {...categoryMeta}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormInput label="TSH" type="number" unit="mIU/L" {...register('tsh')} />
                <FormInput label="Free T4" type="number" unit="ng/dL" {...register('freeT4')} />
                <FormInput label="Reverse T3" type="number" unit="ng/dL" {...register('reverseT3')} />
                <FormInput label="Thyroid Antibodies (TPO/TgAb)" {...register('thyroidAntibodies')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <FormInput 
                  label="Upload Full Thyroid Panel Report" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('thyroidReport')} 
                />
                <FormInput 
                  label="Upload General Health Report (PDF/Image)" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('generalHealthReport')} 
                />
              </div>
            </div>
          </FormWrapper>
        );

      case 'Cardiovascular':
        return (
          <FormWrapper {...categoryMeta}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormInput label="Systolic Blood Pressure" type="number" unit="mmHg" {...register('systolicBP')} />
                <FormInput label="Diastolic Blood Pressure" type="number" unit="mmHg" {...register('diastolicBP')} />
                <FormInput label="SpO₂ (Oxygen Saturation)" type="number" unit="\%" {...register('spO2')} />
                <FormInput label="Resting Heart Rate" type="number" unit="bpm" {...register('restingHeartRate')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput 
                  label="Upload General Cardiac Health Report" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('cardiacHealthReport')} 
                />
                <FormInput 
                  label="Upload Cardiovascular Risk Assessment" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('cardiovascularReport')} 
                />
                <FormInput 
                  label="Upload ECG/ECHO Report" 
                  type="file" 
                  onView={handleViewFile} 
                  {...register('ecgReport')} 
                />
              </div>
            </div>
          </FormWrapper>
        );

      default:
        return <p className="text-gray-500">Form content missing for this category ID.</p>;
    }
  }, [register, handleViewFile, categories]); // Dependencies ensure form state updates correctly

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      {/* Error/Success Messages */}
      {submitError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-xl z-50 transition-opacity duration-300">
          <p>{submitError}</p>
        </div>
      )}
      {submitSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-xl z-50 transition-opacity duration-300">
          <p>Thank you! Your lab report has been submitted successfully.</p>
        </div>
      )}

      {/* Custom Message Box (Toggled to blue when "View" is clicked) */}
      <div id="messageBox" className="hidden fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-xl z-50 transition-opacity duration-300">
        <p id="messageText"></p>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10">
        <header className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="py-2 px-6 bg-[#27AE60] text-white font-bold rounded-full shadow-lg hover:bg-[#1E6F5C] transition-all duration-300 border-2 border-[#27AE60]/30"
            >
              Back
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-extrabold text-[#1A4A40]">
                Personalized Diet Plan Intake Form
              </h1>
              <p className="text-gray-500 mt-2">
                Upload your health reports and metrics for analysis by your Dietitian.
              </p>
            </div>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </header>        {/* --- Category Buttons (Two Rows of Three) --- */}
        <section className="grid grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <CategoryIcon
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              // === UPDATED: Check if category is in the order array ===
              isActive={activeFormsOrder.includes(cat.id)}
              // === UPDATED: Use new toggle function ===
              onClick={() => toggleCategory(cat.id)}
            />
          ))}
        </section>
        
        {/* --- Dynamic Form Section Container --- */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* === NEW DYNAMIC RENDERING === */}
          {activeFormsOrder.length > 0 ? (
            // Render forms in the order they were clicked
            activeFormsOrder.map(categoryId => (
              <div 
                key={categoryId} 
                id={`form-section-${categoryId}`}
                className="p-6 border border-[#27AE60]/20 rounded-xl bg-[#27AE60]/5 shadow-inner space-y-4"
              >
                {renderFormContent(categoryId)}
              </div>
            ))
          ) : (
            // Default message when no forms are active
            <div className="p-6 border border-gray-300 rounded-xl bg-gray-50 text-center text-gray-500 italic">
              Select one or more categories above to dynamically load the corresponding forms for submission.
            </div>
          )}
          {/* --- Submit Button (Always Visible) --- */}
          {activeFormsOrder.length > 0 && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#27AE60] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#1E6F5C] transition-all duration-300 transform hover:scale-[1.01] flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Submit All Active Sections
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
          Your lab reports will be securely stored and reviewed by your assigned dietitian.
        </footer>
      </div>
    </div>
  );
};

export default LabReportUploader;
