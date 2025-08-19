import React from "react";
import { showDeleteConfirmation, showSuccess, showError } from "../../utils/sweetAlert";
import type { Trip } from "../../types";

interface TripCardProps {
  trip: Trip;
  onEdit: (trip: Trip) => void;
  onDelete: (id: number) => void;
  onView: (trip: Trip) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete, onView }) => {
  const handleDelete = async () => {
    const result = await showDeleteConfirmation(trip.name);

    if (result.isConfirmed) {
      try {
        await onDelete(trip.id);
        showSuccess("The trip has been deleted successfully.");
      } catch (error) {
        console.error("Error deleting trip:", error);
        showError("Failed to delete the trip. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {trip.cover_image && <img src={trip.cover_image} alt={trip.name} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{trip.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{trip.description}</p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-green-600">${trip.price}</span>
          <span className="text-sm text-gray-500">{trip.duration} days</span>
        </div>

        <div className="text-xs text-gray-500 mb-3">
          <p>
            From: ({trip.start_latitude.toFixed(4)}, {trip.start_longitude.toFixed(4)})
          </p>
          <p>
            To: ({trip.end_latitude.toFixed(4)}, {trip.end_longitude.toFixed(4)})
          </p>
        </div>

        <div className="text-xs text-gray-400 mb-4">Created by: {trip.user?.name || "Unknown"}</div>

        <div className="flex gap-2">
          <button onClick={() => onView(trip)} className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors">
            Details
          </button>
          <button onClick={() => onEdit(trip)} className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600 transition-colors">
            Edit
          </button>
          <button onClick={handleDelete} className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
