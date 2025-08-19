import React from "react";
import { showDeleteConfirmation, showSuccess, showError } from "../../utils/sweetAlert";
import type { Trip } from "../../types";

interface TripDetailModalProps {
  trip: Trip;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (trip: Trip) => void;
  onDelete: (id: number) => void;
}

const TripDetailModal: React.FC<TripDetailModalProps> = ({ trip, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen) return null;

  const handleDelete = async () => {
    const result = await showDeleteConfirmation(trip.name);

    if (result.isConfirmed) {
      try {
        await onDelete(trip.id);
        onClose();
        showSuccess("The trip has been deleted successfully.");
      } catch (error) {
        console.error("Error deleting trip:", error);
        showError("Failed to delete the trip. Please try again.");
      }
    }
  };

  const handleEdit = () => {
    onEdit(trip);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{trip.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
            ×
          </button>
        </div>

        <div className="p-6">
          {trip.cover_image && <img src={trip.cover_image} alt={trip.name} className="w-full h-64 object-cover rounded-lg mb-6" />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Trip Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Price:</span>
                  <span className="ml-2 text-lg font-bold text-green-600">${trip.price}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Duration:</span>
                  <span className="ml-2 text-gray-800">{trip.duration} days</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Created by:</span>
                  <span className="ml-2 text-gray-800">{trip.user?.name || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-800">{new Date(trip.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                  <span className="ml-2 text-gray-800">{new Date(trip.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Location Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Start Location:</span>
                  <div className="text-sm text-gray-800 ml-2">
                    Lat: {trip.start_latitude.toFixed(6)}
                    <br />
                    Lng: {trip.start_longitude.toFixed(6)}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">End Location:</span>
                  <div className="text-sm text-gray-800 ml-2">
                    Lat: {trip.end_latitude.toFixed(6)}
                    <br />
                    Lng: {trip.end_longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {trip.description && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{trip.description}</p>
            </div>
          )}

          {trip.images && trip.images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Images ({trip.images.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex gap-3">
            <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
              Edit Trip
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
              Delete Trip
            </button>
            <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors ml-auto">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailModal;
