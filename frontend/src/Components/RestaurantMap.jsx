
import { useEffect, useRef } from 'react';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';

import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import 'leaflet/dist/leaflet.css';
import './RestaurantMap.css';

const restaurantMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapController({
  restaurants,
  selectedRestaurant,
  markerRefs,
}) {
  const map = useMap();

  // Fit all restaurants when the map first loads.
  useEffect(() => {
    if (!restaurants.length) return;

    const bounds = L.latLngBounds(
      restaurants.map((restaurant) => [
        restaurant.latitude,
        restaurant.longitude,
      ])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 13,
    });
  }, [map, restaurants]);

  // Move to the selected restaurant and open its popup.
  useEffect(() => {
    if (!selectedRestaurant) return;

    const position = [
      selectedRestaurant.latitude,
      selectedRestaurant.longitude,
    ];

    map.flyTo(position, 15, {
      duration: 1,
    });

    markerRefs.current[selectedRestaurant.id]?.openPopup();
  }, [map, selectedRestaurant, markerRefs]);

  return null;
}

function RestaurantMap({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
}) {
  const markerRefs = useRef({});

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId
  );

  function getDirectionsUrl(restaurant) {
    const destination = `${restaurant.name}, ${restaurant.address}`;

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
  }

  return (
    <section className="restaurant-map-section">
      <div className="restaurant-map-heading">
        <p className="eyebrow">EXPLORE THE AREA</p>
        <h2>
          Find your <em>place.</em>
        </h2>
        <p>
          Explore our selected restaurants across Sheikh Zayed
          and 6th of October.
        </p>
      </div>

      <div className="restaurant-map-container">
        <MapContainer
          center={[30.025, 31.0]}
          zoom={13}
          scrollWheelZoom={false}
          className="restaurant-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            markerRefs={markerRefs}
          />

          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={[
                restaurant.latitude,
                restaurant.longitude,
              ]}
              icon={restaurantMarkerIcon}
              ref={(marker) => {
                markerRefs.current[restaurant.id] = marker;
              }}
              eventHandlers={{
                click: () => onSelectRestaurant(restaurant.id),
              }}
            >
              <Popup>
                <div className="restaurant-map-popup">
                  <strong>{restaurant.name}</strong>

                  <p>{restaurant.address}</p>

                  <small>
                    Approximate map location
                  </small>

                  <a
                    href={getDirectionsUrl(restaurant)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions ↗
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <p className="restaurant-map-note">
        Map data © OpenStreetMap contributors.
        Restaurant pins are approximate.
      </p>
    </section>
  );
}

export default RestaurantMap;
