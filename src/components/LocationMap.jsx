import React, { useMemo } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow, useLoadScript } from '@react-google-maps/api';

const defaultCenter = { lat: 7.8731, lng: 80.7718 };

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const makePinIcon = (color) => ({
    url:
        'data:image/svg+xml;charset=UTF-8,' +
        encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                <path fill="${color}" d="M18 2c-6.075 0-11 4.925-11 11 0 8.25 11 21 11 21s11-12.75 11-21c0-6.075-4.925-11-11-11zm0 15.25A4.25 4.25 0 1 1 18 9a4.25 4.25 0 0 1 0 8.5z"/>
            </svg>
        `),
    scaledSize: new window.google.maps.Size(36, 36),
    anchor: new window.google.maps.Point(18, 36),
});

export default function LocationMap({
    onLocationSelect,
    providers = [],
    selectedLocation,
    onProviderSelect,
    selectedProvider,
}) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const center = useMemo(() => {
        if (selectedLocation?.lat && selectedLocation?.lng) {
            return {
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
            };
        }
        return defaultCenter;
    }, [selectedLocation]);

    if (!isLoaded) {
        return (
            <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 bg-slate-50 flex items-center justify-center text-sm text-slate-500">
                Loading map...
            </div>
        );
    }

    return (
        <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={selectedLocation ? 12 : 7}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    zoomControl: true,
                }}
                onClick={(e) => {
                    const lat = e.latLng?.lat();
                    const lng = e.latLng?.lng();
                    if (typeof lat === 'number' && typeof lng === 'number') {
                        onLocationSelect?.({ lat, lng });
                    }
                }}
            >
                {selectedLocation?.lat && selectedLocation?.lng && (
                    <>
                        <Marker position={center} />
                        <Circle
                            center={center}
                            radius={10000}
                            options={{
                                fillColor: '#22c55e',
                                fillOpacity: 0.14,
                                strokeColor: '#16a34a',
                                strokeOpacity: 0.7,
                                strokeWeight: 1,
                            }}
                        />
                    </>
                )}

                {providers.map((provider, index) => {
                    const coords = provider?.location?.coordinates;
                    if (!Array.isArray(coords) || coords.length !== 2) return null;

                    const [lng, lat] = coords;
                    const providerId = provider._id || provider.id || provider.email || `provider-${index}`;
                    const isSelected = selectedProvider === providerId;
                    const providerName = [provider.businessName, provider.firstName, provider.lastName]
                        .filter(Boolean)
                        .join(' ')
                        .trim() || 'Nearby provider';

                    return (
                        <Marker
                            key={providerId}
                            position={{ lat, lng }}
                            icon={makePinIcon(isSelected ? '#2563eb' : '#16a34a')}
                            title={providerName}
                            onClick={() => onProviderSelect?.(providerId)}
                        >
                            {isSelected && (
                                <InfoWindow position={{ lat, lng }}>
                                    <div className="max-w-48 px-1 py-0.5">
                                        <div className="text-sm font-semibold text-slate-900 leading-tight">
                                            {provider.businessName || providerName}
                                        </div>
                                        {typeof provider.distanceKm === 'number' && (
                                            <div className="text-xs text-slate-500 mt-0.5">
                                                {provider.distanceKm} km away
                                            </div>
                                        )}
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    );
                })}
            </GoogleMap>
        </div>
    );
}
