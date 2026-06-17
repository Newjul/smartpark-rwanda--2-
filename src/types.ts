export interface ParkingSlot {
  id: string;
  name: string;
  availableSlots: number;
  totalSlots: number;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  googleMapsUrl: string;
  image: string;
  operatingHours: string;
  pricing: string;
}
