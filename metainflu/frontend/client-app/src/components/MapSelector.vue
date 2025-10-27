<template>
  <div class="w-full aspect-video max-h-[300px]">
    <l-map
      ref="map"
      v-model:zoom="zoom"
      :center="center"
      @moveend="handleMoveEnd"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
      <l-marker :lat-lng="markerLatLng"></l-marker>
    </l-map>
    <button @click="getUserLocation" class="mt-2 text-sm text-indigo-600 hover:text-indigo-800">Use My Location</button>
    <p class="text-xs text-gray-500 mt-1">Drag the map to set the pin's location.</p>
    <p class="text-xs text-gray-500 mt-2">Disclaimer: We use your location to pre-fill your address. This data is not shared and can be deleted anytime.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { Icon } from 'leaflet';

// Fix for default icon issue with Vite
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const props = defineProps({
  initialCenter: {
    type: Array,
    default: () => [51.505, -0.09] // Default to London
  }
});

const emit = defineEmits(['location-updated']);

const map = ref(null);
const zoom = ref(13);
const center = ref(props.initialCenter);
const markerLatLng = ref(props.initialCenter);

const handleMoveEnd = (e) => {
  const newCenter = map.value.leafletObject.getCenter();
  markerLatLng.value = [newCenter.lat, newCenter.lng];
  emit('location-updated', { latitude: newCenter.lat, longitude: newCenter.lng });
};

const getUserLocation = async () => {
  if (!('geolocation' in navigator)) {
    alert('Geolocation is not supported by your browser.');
    return;
  }

  try {
    const permissions = await navigator.permissions.query({ name: 'geolocation' });

    if (permissions.state === 'denied') {
      alert('Location access has been blocked. Please go to your browser settings to allow location access for this site.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCenter = [position.coords.latitude, position.coords.longitude];
        center.value = newCenter;
        markerLatLng.value = newCenter;
        if (map.value) {
          map.value.leafletObject.setView(newCenter, 16);
        }
        emit('location-updated', { latitude: newCenter[0], longitude: newCenter[1] });
      },
      (error) => {
        let message = 'An unknown error occurred.';
        console.error('Geolocation error object:', JSON.stringify(error, null, 2));
        if (error.code === 1) {
          message = 'You have denied location access. Please enable it in your browser settings.';
        } else if (error.code === 2) {
          message = "Your location could not be determined. Please ensure your device's location services (GPS) are enabled and try again.";
        } else if (error.code === 3) {
          message = 'The request to get your location timed out.';
        }
        alert(message);
      }
    );
  } catch (error) {
    console.error("Error checking geolocation permissions:", error);
    alert('Could not check location permissions. Please ensure your browser is up to date.');
  }
};

watch(() => props.initialCenter, (newVal) => {
  center.value = newVal;
  markerLatLng.value = newVal;
  if (map.value) {
    map.value.leafletObject.setView(newVal, 16);
  }
});

onMounted(() => {
  // If the initial center is the default, try to get user location
  if (props.initialCenter[0] === 51.505 && props.initialCenter[1] === -0.09) {
    // Do not automatically get location to respect user privacy
    // User must click the button
  }
});

</script>
