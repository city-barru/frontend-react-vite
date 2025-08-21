import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type { CreateTripRequest, Trip } from "../../types";
import { showError, showCreateTripConfirmation, showUpdateTripConfirmation, showCancelChangesConfirmation } from "../../utils/sweetAlert";
import { TripDetailsStep, StartLocationStep, EndLocationStep, ReviewStep } from "./steps";

interface TripFormStepperProps {
  trip?: Trip;
  onSubmit: (data: CreateTripRequest) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const steps = [
  { id: 1, title: "Trip Details", component: TripDetailsStep },
  { id: 2, title: "Start Location", component: StartLocationStep },
  { id: 3, title: "End Location", component: EndLocationStep },
  { id: 4, title: "Review", component: ReviewStep },
];

const TripFormStepper: React.FC<TripFormStepperProps> = ({ trip, onSubmit, onCancel, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<CreateTripRequest>({
    defaultValues: trip
      ? {
          name: trip.name,
          description: trip.description,
          cover_image: trip.cover_image,
          price: trip.price,
          duration: trip.duration,
          start_latitude: trip.start_latitude,
          start_longitude: trip.start_longitude,
          end_latitude: trip.end_latitude,
          end_longitude: trip.end_longitude,
        }
      : {
          name: "",
          description: "",
          cover_image: "",
          price: 0,
          duration: 1,
          start_latitude: -6.2,
          start_longitude: 106.816666,
          end_latitude: -6.2,
          end_longitude: 106.816666,
        },
    mode: "onChange", // Enable real-time validation
  });

  const { trigger } = methods;

  const validateStep = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return await trigger(["name", "description", "price", "duration"]);
      case 2:
        return await trigger(["start_latitude", "start_longitude"]);
      case 3:
        return await trigger(["end_latitude", "end_longitude"]);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      showError("Please fill in all required fields correctly.");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (data: CreateTripRequest) => {
    try {
      setSubmitting(true);

      // Show confirmation dialog
      const result = trip ? await showUpdateTripConfirmation() : await showCreateTripConfirmation();

      if (result.isConfirmed) {
        // Transform data to ensure proper types
        const transformedData: CreateTripRequest = {
          ...data,
          price: Number(data.price) || 0,
          duration: Number(data.duration) || 1,
          start_latitude: Number(data.start_latitude),
          start_longitude: Number(data.start_longitude),
          end_latitude: Number(data.end_latitude),
          end_longitude: Number(data.end_longitude),
        };

        await onSubmit(transformedData);
      }
    } catch (error) {
      console.error("Error submitting trip:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    const result = await showCancelChangesConfirmation();

    if (result.isConfirmed) {
      onCancel();
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{trip ? "Edit Trip" : "Create New Trip"}</h1>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step.id ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}>
                    {step.id}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"}`}>{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-1 rounded-full ${currentStep > step.id ? "bg-blue-600" : "bg-gray-300"}`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <div className="p-6">
              <CurrentStepComponent
                onNext={currentStep < steps.length ? handleNext : undefined}
                onPrevious={currentStep > 1 ? handlePrevious : undefined}
                isLastStep={currentStep === steps.length}
                isFirstStep={currentStep === 1}
                isLoading={isLoading || submitting}
                isEditing={!!trip}
              />
            </div>

            {/* Cancel Button Only */}
            <div className="bg-gray-50 px-6 py-4 flex justify-start">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading || submitting}>
                Cancel
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default TripFormStepper;
