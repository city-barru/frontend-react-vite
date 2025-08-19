import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { tripsService } from "../../api/services/tripsService";
import TripCard from "../../components/trips/TripCard";
import TripDetailModal from "../../components/trips/TripDetailModal";
import type { Trip } from "../../types";

const TripsHome = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "duration" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const tripsData = await tripsService.getAll();
      setTrips(tripsData);
    } catch (err) {
      setError("Failed to load trips. Please try again.");
      console.error("Error loading trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id: number) => {
    try {
      await tripsService.delete(id);
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError("Failed to delete trip. Please try again.");
    }
  };

  const handleEditTrip = (trip: Trip) => {
    navigate(`/trips/${trip.id}/edit`);
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setDetailModalOpen(true);
  };

  const handleCreateNew = () => {
    navigate("/trips/new");
  };

  // Filter and sort trips
  const filteredTrips = trips
    .filter((trip) => {
      const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) || trip.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMinPrice = !minPrice || trip.price >= parseFloat(minPrice);
      const matchesMaxPrice = !maxPrice || trip.price <= parseFloat(maxPrice);

      return matchesSearch && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      if (sortBy === "created_at") {
        aValue = new Date(a[sortBy]);
        bValue = new Date(b[sortBy]);
      } else {
        aValue = a[sortBy];
        bValue = b[sortBy];
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Trips Management</h1>
        <button onClick={handleCreateNew} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
          Create New Trip
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search trips..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="1000"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field as typeof sortBy);
                setSortOrder(order as typeof sortOrder);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
              <option value="duration-asc">Duration (Short-Long)</option>
              <option value="duration-desc">Duration (Long-Short)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredTrips.length} of {trips.length} trips
          </p>
          <button onClick={clearFilters} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trips...</p>
        </div>
      ) : (
        <>
          {/* Trips Grid */}
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} onEdit={handleEditTrip} onDelete={handleDeleteTrip} onView={handleViewTrip} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">{trips.length === 0 ? "No trips found." : "No trips match your filters."}</p>
              {trips.length === 0 && (
                <button onClick={handleCreateNew} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                  Create Your First Trip
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedTrip(null);
          }}
          onEdit={handleEditTrip}
          onDelete={handleDeleteTrip}
        />
      )}
    </div>
  );
};

export default TripsHome;
