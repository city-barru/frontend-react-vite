import { useState } from "react";
import { useNavigate } from "react-router";
import { showSuccess, showError } from "../../utils/sweetAlert";
import { tripsService } from "../../api/services/tripsService";
import TripFormStepper from "../../components/trips/TripFormStepper.tsx";
import type { CreateTripRequest } from "../../types";

const CreateTrip = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (tripData: CreateTripRequest) => {
    try {
      setIsSubmitting(true);

      await tripsService.create(tripData);

      showSuccess("Trip created successfully!");

      // Navigate after a short delay to let the user see the success message
      setTimeout(() => {
        navigate("/trips");
      }, 1500);
    } catch (err) {
      console.error("Error creating trip:", err);
      showError("Failed to create trip. Please try again.");
      throw err; // Re-throw to let the form handle the error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/trips");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TripFormStepper onSubmit={handleSubmit} onCancel={handleCancel} isLoading={isSubmitting} />
    </div>
  );
};

export default CreateTrip;
