import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { showDeleteConfirmation, showSuccess, showError } from "../../utils/sweetAlert";
import { tripsService } from "../../api/services/tripsService";
import type { Trip } from "../../types";

const TripDetail = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
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

  const handleDelete = async () => {
    if (!trip) return;

    const result = await showDeleteConfirmation(trip.name);

    if (result.isConfirmed) {
      try {
        await tripsService.delete(trip.id);
        showSuccess("The trip has been deleted successfully.");
        navigate("/trips");
      } catch (err) {
        console.error("Error deleting trip:", err);
        showError("Failed to delete the trip. Please try again.");
      }
    }
  };

  const handleEdit = () => {
    if (trip) {
      navigate(`/trips/${trip.id}/edit`);
    }
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

  if (error) {
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{trip.name}</h1>
          <p className="text-gray-600">
            Created by {trip.user?.name || "Unknown"} on {new Date(trip.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/trips")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
            Back to Trips
          </button>
          <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
            Edit Trip
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
            Delete Trip
          </button>
        </div>
      </div>

      {/* Cover Image */}
      {trip.cover_image && (
        <div className="mb-8">
          <img src={trip.cover_image} alt={trip.name} className="w-full h-96 object-cover rounded-lg shadow-lg" />
        </div>
      )}

      {/* Trip Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">{trip.description || "No description provided."}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Price and Duration */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Trip Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <span className="text-2xl font-bold text-green-600">${trip.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="text-lg font-semibold text-gray-800">{trip.duration} days</span>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Locations</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">Start Location</h4>
                <p className="text-sm text-gray-600">
                  Latitude: {trip.start_latitude.toFixed(6)}
                  <br />
                  Longitude: {trip.start_longitude.toFixed(6)}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-1">End Location</h4>
                <p className="text-sm text-gray-600">
                  Latitude: {trip.end_latitude.toFixed(6)}
                  <br />
                  Longitude: {trip.end_longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Metadata</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Trip ID:</span>
                <span className="ml-2 text-gray-800">#{trip.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2 text-gray-800">{new Date(trip.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <span className="ml-2 text-gray-800">{new Date(trip.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Images */}
      {trip.images && trip.images.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Images ({trip.images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trip.images.map((image) => (
              <div key={image.id} className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm text-gray-600">Image ID: {image.id}</p>
                <p className="text-xs text-gray-500">Added: {new Date(image.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetail;
