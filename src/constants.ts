import { ParkingSlot } from './types';

export const PARKING_SLOTS: ParkingSlot[] = [
  {
    id: '1',
    name: 'Kigali Heights',
    availableSlots: 15,
    totalSlots: 50,
    location: { lat: -1.9546, lng: 30.0912 },
    address: 'KG 7 Ave, Kigali',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-1.9546,30.0912',
    image: 'https://picsum.photos/seed/kigaliheights/800/600',
    operatingHours: '24/7',
    pricing: '500 RWF / Hour'
  },
  {
    id: '2',
    name: 'M. Peace Plaza',
    availableSlots: 8,
    totalSlots: 40,
    location: { lat: -1.9441, lng: 30.0619 },
    address: 'KN 4 Ave, Kigali',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-1.9441,30.0619',
    image: 'https://picsum.photos/seed/mpeace/800/600',
    operatingHours: '06:00 AM - 11:00 PM',
    pricing: '400 RWF / Hour'
  },
  {
    id: '3',
    name: 'Kigali City Tower',
    availableSlots: 22,
    totalSlots: 60,
    location: { lat: -1.9439, lng: 30.0605 },
    address: 'KN 2 St, Kigali',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-1.9439,30.0605',
    image: 'https://picsum.photos/seed/kct/800/600',
    operatingHours: '24/7',
    pricing: '600 RWF / Hour'
  },
  {
    id: '4',
    name: 'Chic Building',
    availableSlots: 12,
    totalSlots: 45,
    location: { lat: -1.9452, lng: 30.0595 },
    address: 'KN 2 Ave, Kigali',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-1.9452,30.0595',
    image: 'https://picsum.photos/seed/chic/800/600',
    operatingHours: '07:00 AM - 10:00 PM',
    pricing: '300 RWF / Hour'
  },
  {
    id: '5',
    name: 'Kigali Convention Centre',
    availableSlots: 45,
    totalSlots: 200,
    location: { lat: -1.9517, lng: 30.0935 },
    address: 'KG 2 Rd, Kigali',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-1.9517,30.0935',
    image: 'https://picsum.photos/seed/kcc/800/600',
    operatingHours: '24/7',
    pricing: '1000 RWF / Hour'
  }
];
