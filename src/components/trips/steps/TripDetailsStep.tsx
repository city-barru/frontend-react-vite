import React, { useState, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { CreateTripRequest } from "../../../types";
import type { Preference } from "../../../types/preference.types";
import CoverImageUpload from "../../CoverImageUpload";
import api from "../../../api/config";

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

  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loadingPreferences, setLoadingPreferences] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<Preference[]>([]);

  const coverImage = watch("cover_image");

  const watchedPreferences = useMemo(() => watch("preferences") ?? [], [watch]);

  // Fetch preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      setLoadingPreferences(true);
      try {
        const response = await api.get("/preferences");
        if (response.status === 200 && response.data.length != 0) {
          const data = response.data;
          setPreferences(data.data || []);
        } else {
          // Fallback with mock data
          setPreferences([
            { ID: 1, name: "adventure" },
            { ID: 2, name: "culture" },
            { ID: 3, name: "food" },
            { ID: 4, name: "nature" },
            { ID: 5, name: "nightlife" },
            { ID: 6, name: "shopping" },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch preferences:", error);
        // Use fallback data
        setPreferences([
          { ID: 1, name: "adventure" },
          { ID: 2, name: "culture" },
          { ID: 3, name: "food" },
          { ID: 4, name: "nature" },
          { ID: 5, name: "nightlife" },
          { ID: 6, name: "shopping" },
        ]);
      } finally {
        setLoadingPreferences(false);
      }
    };

    fetchPreferences();
  }, []);

  // Initialize selected preferences from form data
  useEffect(() => {
    if (watchedPreferences.length > 0) {
      setSelectedPreferences(watchedPreferences);
    }
  }, [watchedPreferences]);

  const handleCoverImageChange = (imageUrl: string) => {
    setValue("cover_image", imageUrl);
  };

  const handlePreferenceToggle = (preference: Preference) => {
    const updatedPreferences = selectedPreferences.some((p) => p.ID === preference.ID)
      ? selectedPreferences.filter((pref) => pref.ID !== preference.ID)
      : [...selectedPreferences, preference];

    setSelectedPreferences(updatedPreferences);
    setValue("preferences", updatedPreferences);
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
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? "border-red-500" : ""
            }`}
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
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.price ? "border-red-500" : ""
            }`}
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

        {/* Preferences */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Trip Tags/Preferences</label>
          {loadingPreferences ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600 text-sm">Loading preferences...</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                {preferences.map((preference) => (
                  <div
                    key={preference.ID}
                    onClick={() => handlePreferenceToggle(preference)}
                    className={`relative rounded-lg border-2 p-3 cursor-pointer transition-all duration-200 hover:border-blue-400 ${
                      selectedPreferences.some((p) => p.ID === preference.ID)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}>
                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={selectedPreferences.some((p) => p.ID === preference.ID)}
                          onChange={() => handlePreferenceToggle(preference)}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <label className="text-sm font-medium text-gray-900 capitalize cursor-pointer">{preference.name}</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPreferences.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">{selectedPreferences.length}</span> tag
                    {selectedPreferences.length !== 1 ? "s" : ""} selected
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedPreferences.map((pref) => (
                      <span
                        key={pref.ID}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {pref.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Select tags that describe your trip to help visitors find it more easily.
              </p>
            </div>
          )}
          {errors.preferences && <p className="mt-1 text-sm text-red-600">{errors.preferences.message}</p>}
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
