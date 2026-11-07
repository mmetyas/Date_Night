
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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


function RestaurantMap({ restaurants }) {
  const mapCenter = [30.025, 31.0];

  function getDirectionsUrl(restaurant) {
    const destination = `${restaurant.name}, ${restaurant.address}`;

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
  }

  return (
    <section className="restaurant-map-section">
      <div className="restaurant-map-heading">
        <p className="eyebrow">EXPLORE THE AREA</p>
        <h2>Find your <em>place.</em></h2>
        <p>
          Explore our selected restaurants across Sheikh Zayed
          and 6th of October.
        </p>
      </div>

      <div className="restaurant-map-container">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="restaurant-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={[
                restaurant.latitude,
                restaurant.longitude,
              ]}
              icon={restaurantMarkerIcon}
            >
              <Popup>
                <div className="restaurant-map-popup">
                  <strong>{restaurant.name}</strong>

                  <p>{restaurant.address}</p>

                  {restaurant.coordinatesAreApproximate && (
                    <small>
                      Map pin shows an approximate area.
                    </small>
                  )}

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
        Restaurant pins are approximate; use Get Directions
        to find the exact business listing.
      </p>
    </section>
  );
}

export default RestaurantMap;
