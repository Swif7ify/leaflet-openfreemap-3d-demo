"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
	ssr: false,
	loading: () => (
		<div className="w-full h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
			<div className="text-gray-500 dark:text-gray-400">Loading map...</div>
		</div>
	),
});

export default function Home() {
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [locationEnabled, setLocationEnabled] = useState(false);
	const [watchId, setWatchId] = useState<number | null>(null);

	const handleLocationToggle = (enabled: boolean) => {
		setLocationEnabled(enabled);

		if (enabled) {
			if (!navigator.geolocation) {
				alert("Geolocation is not supported by this browser.");
				setLocationEnabled(false);
				return;
			}

			const options = {
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 0,
			};

			const id = navigator.geolocation.watchPosition(
				(position) => {
					setUserLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				(error) => {
					console.error("Location error:", error);
					alert("Unable to get your location. Please check your location settings.");
					setLocationEnabled(false);
				},
				options
			);

			setWatchId(id);
		} else {
			if (watchId) {
				navigator.geolocation.clearWatch(watchId);
				setWatchId(null);
			}
			setUserLocation(null);
		}
	};

	return (
		<div className="h-screen w-full relative">
			<MapComponent
				key={locationEnabled ? "location-enabled" : "location-disabled"}
				userLocation={userLocation}
				onLocationToggle={handleLocationToggle}
				locationEnabled={locationEnabled}
			/>
		</div>
	);
}
