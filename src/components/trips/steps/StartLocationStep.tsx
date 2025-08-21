import React from "react";
import { useFormContext } from "react-hook-form";
import type { CreateTripRequest } from "../../../types";
import LocationPicker from "../../LocationPicker";

interface StartLocationStepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  isLoading?: boolean;
  isEditing?: boolean;
}

const StartLocationStep: React.FC<StartLocationStepProps> = ({ onNext, onPrevious, isFirstStep, isLoading }) => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<CreateTripRequest>();

  const startLatitude = watch("start_latitude");
  const startLongitude = watch("start_longitude");

  const handleLocationChange = (lat: number, lng: number) => {
    setValue("start_latitude", lat, { shouldValidate: true });
    setValue("start_longitude", lng, { shouldValidate: true });
  };

  // Register hidden fields for validation
  React.useEffect(() => {
    register("start_latitude", {
      required: "Start latitude is required",
      valueAsNumber: true,
      min: { value: -90, message: "Latitude must be between -90 and 90" },
      max: { value: 90, message: "Latitude must be between -90 and 90" },
    });
    register("start_longitude", {
      required: "Start longitude is required",
      valueAsNumber: true,
      min: { value: -180, message: "Longitude must be between -180 and 180" },
      max: { value: 180, message: "Longitude must be between -180 and 180" },
    });
  }, [register]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Start Location</h2>
        <p className="text-sm text-gray-600 mb-6">Select where your trip will begin. Click on the map to set the starting point.</p>
      </div>

      <div className="space-y-4">
        {/* Location Coordinates Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Latitude</label>
            <input
              type="number"
              value={startLatitude}
              readOnly
              step="any"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600"
              placeholder="Click on map to set latitude"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Longitude</label>
            <input
              type="number"
              value={startLongitude}
              readOnly
              step="any"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600"
              placeholder="Click on map to set longitude"
            />
          </div>
        </div>

        {/* Map */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <LocationPicker initialLat={startLatitude} initialLng={startLongitude} onLocationChange={handleLocationChange} height="400px" />
        </div>

        {/* Validation Errors */}
        {(errors.start_latitude || errors.start_longitude) && (
          <div className="space-y-1">
            {errors.start_latitude && <p className="text-sm text-red-600">{errors.start_latitude.message}</p>}
            {errors.start_longitude && <p className="text-sm text-red-600">{errors.start_longitude.message}</p>}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How to set location</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Click anywhere on the map to set the starting location</li>
                  <li>The marker will move to the clicked position</li>
                  <li>You can zoom in/out for more precise positioning</li>
                  <li>The coordinates will be automatically updated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
        <div>
          {!isFirstStep && onPrevious && (
            <button
              type="button"
              onClick={onPrevious}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}>
              Previous
            </button>
          )}
        </div>
        <div>
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartLocationStep;
