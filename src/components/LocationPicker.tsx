import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

interface LocationMarkerProps {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, onPositionChange }) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(position);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([lat, lng]);
      onPositionChange(lat, lng);
    },
  });

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  return <Marker position={markerPosition} />;
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLat = -6.2, // Default to Indonesia coordinates
  initialLng = 106.816666,
  onLocationChange,
  height = "400px",
  className = "",
}) => {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<L.Map>(null);

  const handleLocationChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationChange(lat, lng);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition: [number, number] = [latitude, longitude];
        setPosition(newPosition);
        onLocationChange(latitude, longitude);

        // Pan map to current location
        if (mapRef.current) {
          mapRef.current.setView(newPosition, 15);
        }

        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  return (
    <div className={`location-picker ${className}`}>
      <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "14px", color: "#666" }}>Click on the map to select a location</div>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoadingLocation ? "not-allowed" : "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            opacity: isLoadingLocation ? 0.6 : 1,
          }}>
          {isLoadingLocation ? (
            <>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              Getting Location...
            </>
          ) : (
            <>📍 Use Current Location</>
          )}
        </button>
      </div>

      {locationError && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "4px",
            fontSize: "14px",
            marginBottom: "12px",
          }}>
          {locationError}
        </div>
      )}

      <div
        style={{
          marginBottom: "12px",
          padding: "8px 12px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
          fontSize: "14px",
        }}>
        <strong>Selected Location:</strong>
        <br />
        Latitude: {position[0].toFixed(6)}
        <br />
        Longitude: {position[1].toFixed(6)}
      </div>

      <div
        style={{
          height,
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
        }}>
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} ref={mapRef}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker position={position} onPositionChange={handleLocationChange} />
        </MapContainer>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LocationPicker;
