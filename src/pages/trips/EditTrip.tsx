import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { showSuccess, showError } from "../../utils/sweetAlert";
import { tripsService } from "../../api/services/tripsService";
import TripFormStepper from "../../components/trips/TripFormStepper.tsx";
import type { Trip, CreateTripRequest, UpdateTripRequest } from "../../types";

const EditTrip = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const loadTrip = async () => {
      if (!id) {
        setError("Trip ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const tripData = await tripsService.getById(parseInt(id));
        setTrip(tripData);
      } catch (err) {
        console.error("Error loading trip:", err);
        setError("Failed to load trip. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const handleSubmit = async (tripData: CreateTripRequest) => {
    if (!trip) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Convert CreateTripRequest to UpdateTripRequest for the API call
      const updateData: UpdateTripRequest = {
        name: tripData.name,
        description: tripData.description,
        cover_image: tripData.cover_image,
        price: tripData.price,
        duration: tripData.duration,
        start_latitude: tripData.start_latitude,
        start_longitude: tripData.start_longitude,
        end_latitude: tripData.end_latitude,
        end_longitude: tripData.end_longitude,
      };

      await tripsService.update(trip.id, updateData);

      showSuccess("Trip updated successfully!");

      // Navigate after a short delay to let the user see the success message
      setTimeout(() => {
        navigate("/trips");
      }, 1500);
    } catch (err) {
      console.error("Error updating trip:", err);
      setError("Failed to update trip. Please try again.");
      showError("Failed to update trip. Please try again.");
      throw err; // Re-throw to let the form handle the error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/trips");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip...</p>
        </div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
        <button onClick={() => navigate("/trips")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Back to Trips
        </button>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Trip not found.</p>
          <button onClick={() => navigate("/trips")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {error && (
        <div className="max-w-4xl mx-auto mb-6 px-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        </div>
      )}

      <TripFormStepper trip={trip} onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isSubmitting} />
    </div>
  );
};

export default EditTrip;
