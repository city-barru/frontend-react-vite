import React from "react";
import { useFormContext } from "react-hook-form";
import type { CreateTripRequest } from "../../../types";
import CoverImageUpload from "../../CoverImageUpload";

interface TripDetailsStepProps {
  onNext?: () => void;
  onPrevious?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
  isLoading?: boolean;
  isEditing?: boolean;
}

const TripDetailsStep: React.FC<TripDetailsStepProps> = ({ onNext, onPrevious, isFirstStep, isLoading }) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateTripRequest>();

  const coverImage = watch("cover_image");

  const handleCoverImageChange = (imageUrl: string) => {
    setValue("cover_image", imageUrl);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h2>
        <p className="text-sm text-gray-600 mb-6">Provide basic information about your trip.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trip Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Trip Name *
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "Trip name is required",
              minLength: {
                value: 3,
                message: "Trip name must be at least 3 characters long",
              },
              maxLength: {
                value: 100,
                message: "Trip name must not exceed 100 characters",
              },
            })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? "border-red-500" : ""}`}
            placeholder="Enter trip name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters long",
              },
              maxLength: {
                value: 1000,
                message: "Description must not exceed 1000 characters",
              },
            })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : ""
            }`}
            placeholder="Describe your trip..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price (IDR) *
          </label>
          <input
            type="number"
            id="price"
            min="0"
            step="1000"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Price must be greater than or equal to 0",
              },
              max: {
                value: 100000000,
                message: "Price must not exceed 100,000,000 IDR",
              },
            })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? "border-red-500" : ""}`}
            placeholder="0"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration (days) *
          </label>
          <input
            type="number"
            id="duration"
            min="1"
            max="365"
            {...register("duration", {
              required: "Duration is required",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Duration must be at least 1 day",
              },
              max: {
                value: 365,
                message: "Duration must not exceed 365 days",
              },
            })}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.duration ? "border-red-500" : ""
            }`}
            placeholder="1"
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
        </div>

        {/* Cover Image */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
          <CoverImageUpload
            currentCoverUrl={coverImage}
            onUploadComplete={(imageData) => handleCoverImageChange(imageData.url)}
            onUploadError={(error) => console.error("Cover upload error:", error)}
          />
          {errors.cover_image && <p className="mt-1 text-sm text-red-600">{errors.cover_image.message}</p>}
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

export default TripDetailsStep;
