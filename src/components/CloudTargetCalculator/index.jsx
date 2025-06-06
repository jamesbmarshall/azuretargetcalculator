// Updated index.jsx with clean URL sharing functionality

import React, { useState, useEffect } from 'react';
import Header from './Header';
import StepNavigation from './Form/StepNavigation';
import CurrentBusinessStep from './Form/CurrentBusinessStep';
import TargetsStep from './Form/TargetsStep';
import SettingsStep from './Form/SettingsStep';
import SummaryCards from './Results/SummaryCards';
import BreakdownTable from './Results/BreakdownTable';
import ProactiveBreakdown from './Results/ProactiveBreakdown';
import RevenueWaterfall from './Results/RevenueWaterfall';
import MarketingFunnel from './Results/MarketingFunnel';
import useFormData from './hooks/useFormData';
import useCalculator from './hooks/useCalculator';
import { validateStep } from './Form/validators';
import { Eye, EyeOff, Share2, ChevronDown, ChevronUp } from 'lucide-react';

// Utility functions for URL encoding/decoding
const encodeFormDataToURL = (formData) => {
  try {
    const jsonString = JSON.stringify(formData);
    return btoa(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('Error encoding form data:', error);
    return null;
  }
};

const decodeFormDataFromURL = (encodedData) => {
  try {
    const jsonString = decodeURIComponent(atob(encodedData));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding form data:', error);
    return null;
  }
};

const updateURLWithFormData = (formData) => {
  const encoded = encodeFormDataToURL(formData);
  if (encoded) {
    const url = new URL(window.location);
    url.searchParams.set('data', encoded);
    window.history.replaceState({}, '', url.toString());
  }
};

const getFormDataFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get('data');
  if (encodedData) {
    return decodeFormDataFromURL(encodedData);
  }
  return null;
};

export default function CloudTargetCalculator() {
  const [currentStep, setStep] = useState(0);
  const [formCollapsed, setFormCollapsed] = useState(false);
  const [showDetailedColumns, setShowDetailedColumns] = useState(false);

  const [formData, updateFormData, resetFormData] = useFormData();
  const [errors, setErrors] = useState({});
  const [isLoadingFromURL, setIsLoadingFromURL] = useState(true);
  const [hasSharedData, setHasSharedData] = useState(false);
  const [urlFormData, setUrlFormData] = useState(null);
  const [notificationDismissed, setNotificationDismissed] = useState(false);

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Create calculators at the top level (following Rules of Hooks)
  const formCalculator = useCalculator(formData);
  const sharedCalculator = useCalculator(urlFormData || formData);

  const nextStep = () => {
    const errs = validateStep(currentStep, formData);
    setErrors(errs);
    if (!Object.keys(errs).length) setStep((s) => Math.min(s + 1, 2));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Enhanced setStep function that shows form when navigating to a step
  const handleSetStep = (stepIndex) => {
    setStep(stepIndex);
    // If form is collapsed and user clicks on a step, show the form
    if (formCollapsed) {
      setFormCollapsed(false);
      // If we have shared data, populate the form when user wants to edit
      if (hasSharedData && urlFormData) {
        console.log('Populating form with shared data for editing:', urlFormData);
        Object.entries(urlFormData).forEach(([field, value]) => {
          updateFormData(field, value);
        });
      }
    }
  };

  // Function to calculate using shared data
  const calculateWithSharedData = async (sharedData = urlFormData) => {
    if (!sharedData || !sharedData.targetRevenue) {
      console.error('Invalid shared data for calculation - missing targetRevenue:', sharedData);
      return;
    }

    console.log('Calculating with shared data:', sharedData);
    setIsCalculating(true);
    
    try {
      const res = await sharedCalculator();
      console.log('Shared calculation successful:', res);
      setResults(res);
    } catch (error) {
      console.error('Error calculating with shared data:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Load form data from URL on component mount
  useEffect(() => {
    const urlData = getFormDataFromURL();
    if (urlData) {
      console.log('Loading shared calculation data:', urlData);
      setHasSharedData(true);
      setUrlFormData(urlData);
      
      // For shared URLs, start with form collapsed
      setFormCollapsed(true);
    }
    setIsLoadingFromURL(false);
  }, []);

  // Auto-calculate effect for URL data
  useEffect(() => {
    if (hasSharedData && urlFormData && urlFormData.targetRevenue && !results && !isCalculating) {
      console.log('Auto-triggering calculation with urlFormData:', urlFormData);
      calculateWithSharedData();
    }
  }, [urlFormData, hasSharedData, results, isCalculating]);

  const handleCalculate = async () => {
    // For shared data, use the shared calculator
    if (hasSharedData && urlFormData) {
      await calculateWithSharedData();
      return;
    }

    // For normal form data, validate steps first
    const stepErrors = [0, 1, 2]
      .map((i) => validateStep(i, formData))
      .reduce((acc, cur) => ({ ...acc, ...cur }), {});
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) return;

    setIsCalculating(true);
    try {
      const res = await formCalculator();
      setResults(res);
      setFormCollapsed(true);
      
      // Update URL with complete form data after successful calculation
      updateURLWithFormData(formData);
    } finally {
      setIsCalculating(false);
    }
  };

  // Update URL whenever form data changes (debounced)
  useEffect(() => {
    if (!isLoadingFromURL && !hasSharedData && formData && Object.keys(formData).length > 0) {
      const timeoutId = setTimeout(() => {
        updateURLWithFormData(formData);
      }, 500); // Debounce URL updates

      return () => clearTimeout(timeoutId);
    }
  }, [formData, isLoadingFromURL, hasSharedData]);

  const copyToClipboard = (customURL = null) => {
    const urlToCopy = customURL || window.location.href;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      alert('Share link copied to clipboard!');
    });
  };

  const handleShare = async () => {
    // Ensure URL is updated with latest form data before sharing
    updateURLWithFormData(hasSharedData ? urlFormData : formData);
    
    const shareData = {
      title: 'Cloud Target Calculator Results',
      text: 'Check out these results from the Cloud Target Calculator!',
      url: window.location.href,
    };
    
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        if (e.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  // Clear URL parameters (useful for "New Calculation" button)
  const clearURLData = () => {
    const url = new URL(window.location);
    url.searchParams.delete('data');
    window.history.replaceState({}, '', url.toString());
    setHasSharedData(false);
    setNotificationDismissed(false);
    setResults(null);
    setFormCollapsed(false);
    // Optionally reload the page to reset form to defaults
    window.location.reload();
  };

  // Loading state while checking URL
  if (isLoadingFromURL) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared calculation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Keep the main header with icon and gradient */}
        <div className="mb-8">
          <Header />
          
          {/* Show URL sharing status */}
          {hasSharedData && !notificationDismissed && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-green-800 font-medium text-sm">
                      📊 Shared calculation data loaded
                    </p>
                    <p className="text-green-700 text-xs mt-1">
                      {results 
                        ? "Results calculated automatically. Use the form below to make adjustments." 
                        : isCalculating 
                          ? "Calculating results..." 
                          : "Auto-calculation ready. Click below if results don't appear."
                      }
                    </p>
                    {urlFormData && (
                      <details className="mt-2">
                        <summary className="text-xs text-green-600 cursor-pointer">Debug: View loaded data</summary>
                        <pre className="text-xs bg-green-100 p-2 rounded mt-1 overflow-auto max-h-20">
                          {JSON.stringify(urlFormData, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!results && !isCalculating && (
                    <button 
                      onClick={() => {
                        console.log('Calculate Results clicked, hasSharedData:', hasSharedData);
                        console.log('urlFormData:', urlFormData);
                        console.log('formData:', formData);
                        handleCalculate();
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Calculate Results
                    </button>
                  )}
                  <button 
                    onClick={clearURLData}
                    className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                  >
                    New Calculation
                  </button>
                  <button 
                    onClick={() => setNotificationDismissed(true)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                    title="Dismiss notification"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form wizard */}
        <div className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden">
          <StepNavigation currentStep={currentStep} setStep={handleSetStep} />

          <div className={`transition-all duration-500 ease-in-out ${formCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-full'}`}>
            <div className="min-h-[600px]">
              {currentStep === 0 && (
                <CurrentBusinessStep 
                  data={formData} 
                  update={updateFormData} 
                  errors={errors} 
                  nextStep={nextStep} 
                />
              )}
              {currentStep === 1 && (
                <TargetsStep
                  data={formData}
                  update={updateFormData}
                  errors={errors}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {currentStep === 2 && (
                <SettingsStep
                  data={formData}
                  update={updateFormData}
                  errors={errors}
                  isCalculating={isCalculating}
                  prevStep={prevStep}
                  onCalculate={handleCalculate}
                />
              )}
            </div>
          </div>

          {/* Form toggle - enhanced design */}
          {results && (
            <button
              onClick={() => {
                const newCollapsedState = !formCollapsed;
                setFormCollapsed(newCollapsedState);
                // If expanding form and we have shared data, populate it
                if (!newCollapsedState && hasSharedData && urlFormData) {
                  console.log('Populating form with shared data:', urlFormData);
                  Object.entries(urlFormData).forEach(([field, value]) => {
                    updateFormData(field, value);
                  });
                }
              }}
              className="w-full bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 text-blue-700 text-center py-4 font-semibold cursor-pointer transition-all duration-300 border-t border-gray-200 flex items-center justify-center space-x-3 group focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            >
              {formCollapsed ? (
                <>
                  <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
                  <span>Show Form to Edit Inputs</span>
                  <span className="text-xs text-blue-500 ml-2">(or click any step above)</span>
                </>
              ) : (
                <>
                  <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  <span>Hide Form</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="mt-12 space-y-12">
            <div className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden">
              {/* Results Header */}
              <div className="px-8 md:px-12 py-8 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {hasSharedData ? 'Shared Revenue Plan' : 'Your Personalized Revenue Plan'}
                    </h2>
                    <p className="text-gray-600">
                      {hasSharedData 
                        ? 'Results from a shared calculation - edit the form above to make adjustments' 
                        : 'Based on your inputs, here\'s your strategic roadmap to success'
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowDetailedColumns((s) => !s)}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-gray-500/30"
                    >
                      {showDetailedColumns ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span className="hidden sm:inline font-medium">
                        {showDetailedColumns ? 'Hide Details' : 'Show Details'}
                      </span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline font-medium">Share Results</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Content */}
              <div className="p-8 md:p-12 space-y-16">
                <SummaryCards results={results} currency={(hasSharedData ? urlFormData : formData)?.currency} />
                <BreakdownTable 
                  rows={results.monthlyData} 
                  showDetails={showDetailedColumns} 
                  currency={(hasSharedData ? urlFormData : formData)?.currency} 
                />
                <ProactiveBreakdown 
                  data={results.proactiveMonthly} 
                  currency={(hasSharedData ? urlFormData : formData)?.currency} 
                />
                <RevenueWaterfall 
                  data={results} 
                  currency={(hasSharedData ? urlFormData : formData)?.currency} 
                />
              </div>
            </div>

            <MarketingFunnel data={results.marketing} currency={(hasSharedData ? urlFormData : formData)?.currency} />
          </div>
        )}

        {/* Loading state for shared calculations */}
        {hasSharedData && isCalculating && !results && (
          <div className="mt-12">
            <div className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Calculating Shared Results
                </h3>
                <p className="text-gray-600">
                  Processing the shared calculation data...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center py-12 text-gray-600 border-t border-gray-200">
          <div className="flex justify-center space-x-8 mb-6">
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
            >
              Privacy
            </a>
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
            >
              Support
            </a>
          </div>
          <p className="text-sm">
            © 2025 Cloud Target Calculator. Built with precision and care.
          </p>
        </footer>
      </div>
    </div>
  );
}