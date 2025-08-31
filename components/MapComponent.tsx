"use client";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Map, Box, MapPin } from "lucide-react";
import L from "leaflet";
import "@maplibre/maplibre-gl-leaflet";
import "leaflet/dist/leaflet.css";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapComponentProps {
	userLocation: { lat: number; lng: number } | null;
	onLocationToggle: (enabled: boolean) => void;
	locationEnabled: boolean;
}

type MapStyle = "positron" | "bright" | "liberty" | "3d";

const mapStyles = {
	positron: {
		name: "Positron",
		url: "https://tiles.openfreemap.org/styles/positron",
		icon: <Moon size={18} />,
	},
	bright: {
		name: "Bright",
		url: "https://tiles.openfreemap.org/styles/bright",
		icon: <Sun size={18} />,
	},
	liberty: {
		name: "Liberty",
		url: "https://tiles.openfreemap.org/styles/liberty",
		icon: <Map size={18} />,
	},
	"3d": {
		name: "3D",
		url: "https://tiles.openfreemap.org/styles/liberty",
		icon: <Box size={18} />,
	},
};

export default function MapComponent({ userLocation, onLocationToggle, locationEnabled }: MapComponentProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<L.Map | null>(null);
	const userMarkerRef = useRef<L.Marker | null>(null);
	const radiusCircleRef = useRef<L.Circle | null>(null);
	const mapLayerRef = useRef<any>(null);

	const maplibreMapRef = useRef<maplibregl.Map | null>(null);
	const [is3DMode, setIs3DMode] = useState(false);
	const [currentStyle, setCurrentStyle] = useState<MapStyle>("liberty");

	useEffect(() => {
		if (mapRef.current && !mapInstanceRef.current && !is3DMode) {
			const map = L.map(mapRef.current, {
				center: [14.8833, 120.2833],
				zoom: 13,
				zoomControl: false,
				attributionControl: false,
			});

			const initialLayer = L.maplibreGL({
				style: mapStyles[currentStyle].url,
			}).addTo(map);

			mapInstanceRef.current = map;
			mapLayerRef.current = initialLayer;
		}
	}, [currentStyle, is3DMode]);

	useEffect(() => {
		if (locationEnabled && mapInstanceRef.current) {
			setTimeout(() => {
				mapInstanceRef.current?.invalidateSize();
			}, 100);
		}
		if (locationEnabled && maplibreMapRef.current) {
			setTimeout(() => {
				maplibreMapRef.current?.resize();
			}, 100);
		}
	}, [locationEnabled]);

	useEffect(() => {
		if (userLocation) {
			if (is3DMode && maplibreMapRef.current) {
				const existingMarkers = document.querySelectorAll(".maplibregl-marker");
				existingMarkers.forEach((marker) => marker.remove());

				new maplibregl.Marker({
					color: "#3b82f6",
				})
					.setLngLat([userLocation.lng, userLocation.lat])
					.addTo(maplibreMapRef.current);

				maplibreMapRef.current.flyTo({
					center: [userLocation.lng, userLocation.lat],
					zoom: 15,
					pitch: 60,
				});
			} else if (mapInstanceRef.current) {
				if (userMarkerRef.current) {
					mapInstanceRef.current.removeLayer(userMarkerRef.current);
				}
				if (radiusCircleRef.current) {
					mapInstanceRef.current.removeLayer(radiusCircleRef.current);
				}

				const userMarker = L.marker([userLocation.lat, userLocation.lng], {
					icon: L.divIcon({
						className: "custom-marker user-marker",
						html: `
							<div class="marker-pin user-pin">
								<div class="marker-icon">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<circle cx="12" cy="12" r="10"/>
										<circle cx="12" cy="12" r="3"/>
									</svg>
								</div>
							</div>
						`,
						iconSize: [30, 30],
						iconAnchor: [15, 15],
					}),
				});

				const radiusCircle = L.circle([userLocation.lat, userLocation.lng], {
					radius: 500,
					color: "#3b82f6",
					fillColor: "#3b82f6",
					fillOpacity: 0.1,
					weight: 2,
					opacity: 0.6,
				});

				userMarker.addTo(mapInstanceRef.current);
				radiusCircle.addTo(mapInstanceRef.current);

				userMarkerRef.current = userMarker;
				radiusCircleRef.current = radiusCircle;

				mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15);
			}
		}
	}, [userLocation, is3DMode]);

	useEffect(() => {
		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
				userMarkerRef.current = null;
				radiusCircleRef.current = null;
			}
		};
	}, []);

	const changeMapStyle = (style: MapStyle) => {
		if (style !== currentStyle) {
			if (style === "3d") {
				if (mapInstanceRef.current) {
					mapInstanceRef.current.remove();
					mapInstanceRef.current = null;
					mapLayerRef.current = null;
				}

				if (mapRef.current) {
					mapRef.current.innerHTML = "";

					const map3d = new maplibregl.Map({
						container: mapRef.current,
						style: mapStyles[style].url,
						center: [120.2833, 14.8833],
						zoom: 13,
						pitch: 60,
						bearing: 0,
					});

					if (userLocation) {
						map3d.on("load", () => {
							new maplibregl.Marker({
								color: "#3b82f6",
							})
								.setLngLat([userLocation.lng, userLocation.lat])
								.addTo(map3d);

							map3d.addSource("radius", {
								type: "geojson",
								data: {
									type: "Feature",
									properties: {},
									geometry: {
										type: "Point",
										coordinates: [userLocation.lng, userLocation.lat],
									},
								},
							});

							map3d.addLayer({
								id: "radius-circle",
								type: "circle",
								source: "radius",
								paint: {
									"circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 0, 20, 50],
									"circle-color": "#3b82f6",
									"circle-opacity": 0.1,
									"circle-stroke-color": "#3b82f6",
									"circle-stroke-width": 2,
									"circle-stroke-opacity": 0.6,
								},
							});

							map3d.flyTo({
								center: [userLocation.lng, userLocation.lat],
								zoom: 15,
								pitch: 60,
							});
						});
					}

					maplibreMapRef.current = map3d;
					setIs3DMode(true);
				}
			} else {
				if (maplibreMapRef.current) {
					maplibreMapRef.current.remove();
					maplibreMapRef.current = null;
				}

				if (mapInstanceRef.current) {
					mapInstanceRef.current.remove();
					mapInstanceRef.current = null;
					mapLayerRef.current = null;
				}

				if (mapRef.current) {
					mapRef.current.innerHTML = "";

					const map = L.map(mapRef.current, {
						center: [14.8833, 120.2833],
						zoom: 13,
						zoomControl: true,
						attributionControl: false,
					});

					const newLayer = L.maplibreGL({
						style: mapStyles[style].url,
					}).addTo(map);

					mapInstanceRef.current = map;
					mapLayerRef.current = newLayer;
					setIs3DMode(false);

					if (userLocation) {
						const userMarker = L.marker([userLocation.lat, userLocation.lng], {
							icon: L.divIcon({
								className: "custom-marker user-marker",
								html: `
                                <div class="marker-pin user-pin">
                                    <div class="marker-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <circle cx="12" cy="12" r="10"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    </div>
                                </div>
                            `,
								iconSize: [30, 30],
								iconAnchor: [15, 15],
							}),
						});

						const radiusCircle = L.circle([userLocation.lat, userLocation.lng], {
							radius: 500,
							color: "#3b82f6",
							fillColor: "#3b82f6",
							fillOpacity: 0.1,
							weight: 2,
							opacity: 0.6,
						});

						userMarker.addTo(map);
						radiusCircle.addTo(map);

						userMarkerRef.current = userMarker;
						radiusCircleRef.current = radiusCircle;

						map.setView([userLocation.lat, userLocation.lng], 15);
					}
				}
			}

			setCurrentStyle(style);
		}
	};

	useEffect(() => {
		return () => {
			if (mapInstanceRef.current) {
				mapInstanceRef.current.remove();
				mapInstanceRef.current = null;
			}
			if (maplibreMapRef.current) {
				maplibreMapRef.current.remove();
				maplibreMapRef.current = null;
			}
			userMarkerRef.current = null;
			radiusCircleRef.current = null;
			mapLayerRef.current = null;
		};
	}, []);

	return (
		<div className="relative w-full h-screen bg-black">
			{/* Map Style Controls */}
			<div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
				{Object.entries(mapStyles).map(([key, style]) => (
					<button
						key={key}
						onClick={() => changeMapStyle(key as MapStyle)}
						className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border transition-all duration-200 min-w-[120px] ${
							currentStyle === key
								? "bg-orange-500 text-white border-orange-600"
								: "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
						}`}
						title={`Switch to ${style.name} view`}
					>
						{style.icon}
						<span className="text-sm font-medium">{style.name}</span>
					</button>
				))}
			</div>

			{/* Location Toggle */}
			<div className="absolute top-4 right-4 z-[1000]">
				<button
					onClick={() => onLocationToggle(!locationEnabled)}
					className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg border transition-all duration-200 ${
						locationEnabled
							? "bg-green-500 text-white border-green-600"
							: "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
					}`}
					title={locationEnabled ? "Disable Location" : "Enable Location"}
				>
					<MapPin size={20} />
					<span className="text-sm font-medium">{locationEnabled ? "Location On" : "Enable Location"}</span>
				</button>
			</div>

			{/* Map Container */}
			<div ref={mapRef} className="w-full h-screen" />

			<style jsx global>{`
				.custom-marker {
					background: transparent;
				}

				.marker-pin {
					width: 30px;
					height: 30px;
					position: relative;
					cursor: pointer;
				}

				.user-pin {
					color: #3b82f6;
				}

				.marker-icon {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 20px;
					height: 20px;
					background: white;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
					border: 2px solid #3b82f6;
					animation: pulse 2s infinite;
				}

				@keyframes pulse {
					0% {
						box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
					}
					70% {
						box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
					}
					100% {
						box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
					}
				}

				.leaflet-control-attribution {
					display: none !important;
				}

				/* Remove default Leaflet controls */
				.leaflet-control-container {
					display: none;
				}

				/* MapLibre GL controls styling */
				.maplibregl-ctrl-group button {
					background: rgba(255, 255, 255, 0.9);
					border: none;
					border-radius: 6px;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				}
			`}</style>
		</div>
	);
}
