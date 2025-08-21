import React from "react";
import { useFormContext } from "react-hook-form";
import type { CreateTripRequest } from "../../../types";

interface ReviewStepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  isLoading?: boolean;
  isEditing?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onPrevious, isLastStep, isFirstStep, isLoading, isEditing = false }) => {
  const { watch } = useFormContext<CreateTripRequest>();

  const formData = watch();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatCoordinate = (coord: number) => {
    return coord.toFixed(6);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Trip Details</h2>
        <p className="text-sm text-gray-600 mb-6">Please review all the information before creating/updating your trip.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Cover Image */}
        {formData.cover_image && (
          <div className="relative h-64 bg-gray-100 rounded-t-lg overflow-hidden">
            <img src={formData.cover_image} alt="Trip cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold">{formData.name}</h3>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4">Basic Information</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Trip Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.name || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formData.duration} {formData.duration === 1 ? "day" : "days"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Price</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatPrice(formData.price || 0)}</dd>
              </div>
            </dl>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{formData.description || "No description provided"}</p>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4">Locations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Location */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Start Location</h4>
                <dl className="space-y-1">
                  <div>
                    <dt className="text-xs text-blue-600">Latitude</dt>
                    <dd className="text-sm text-blue-900 font-mono">{formatCoordinate(formData.start_latitude || 0)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-blue-600">Longitude</dt>
                    <dd className="text-sm text-blue-900 font-mono">{formatCoordinate(formData.start_longitude || 0)}</dd>
                  </div>
                </dl>
              </div>

              {/* End Location */}
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">End Location</h4>
                <dl className="space-y-1">
                  <div>
                    <dt className="text-xs text-green-600">Latitude</dt>
                    <dd className="text-sm text-green-900 font-mono">{formatCoordinate(formData.end_latitude || 0)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-green-600">Longitude</dt>
                    <dd className="text-sm text-green-900 font-mono">{formatCoordinate(formData.end_longitude || 0)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Distance Calculation */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Route Information</h4>
            <p className="text-xs text-gray-600">The distance between start and end locations will be calculated after the trip is created.</p>
          </div>

          {/* Summary */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Ready to Submit</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Please review all the information above. Once you click the submit button, a confirmation dialog will appear before the trip is created/updated.</p>
                </div>
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
          {isLastStep && (
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}>
              {isLoading ? "Processing..." : isEditing ? "Update Trip" : "Create Trip"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
