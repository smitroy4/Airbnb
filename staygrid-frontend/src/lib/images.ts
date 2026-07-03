// Curated royalty-free Unsplash photo IDs (direct images.unsplash.com URLs
// are stable; source.unsplash.com has been deprecated and returns errors).
// All photos are free to use under the Unsplash license.

const HOTEL_PHOTOS = [
  "photo-1566073771259-6a8506099945", // luxury hotel exterior
  "photo-1445019980597-93fa8acb246c", // hotel lobby
  "photo-1520250497591-112f2f40a3f4", // beach resort
  "photo-1611892440504-42a792e24d32", // modern hotel
  "photo-1542314831-068cd1dbfeeb", // boutique hotel
  "photo-1455587734955-081b22074882", // luxury facade
  "photo-1571003123894-1f0594d2b5d9", // resort pool
  "photo-1596436889106-be35e843f974", // hotel building
  "photo-1564501049412-61c2a3083791", // suite view
  "photo-1512918728675-ed5a9ecdebfd", // resort landscape
];

const ROOM_PHOTOS = [
  "photo-1631049307264-da0ec9d70304", // modern bedroom
  "photo-1590490360182-c33d57733427", // suite
  "photo-1618773928121-c32242e63f39", // king room
  "photo-1587985064135-0366536eab42", // luxury bed
  "photo-1522708323590-d24dbb6b0267", // cozy room
  "photo-1560448204-e02f11c3d0e2", // white room
  "photo-1540541338287-41700207dee6", // window view
  "photo-1616486338812-3dadae4b4ace", // designer suite
];

const CITY_PHOTOS: Record<string, string> = {
  mumbai: "photo-1570168007204-dfb528c6958f",
  bengaluru: "photo-1596176530529-78163a4f7af2",
  bangalore: "photo-1596176530529-78163a4f7af2",
  delhi: "photo-1587474260584-136574528ed5",
  goa: "photo-1512343879784-a960bf40e7f2",
  jaipur: "photo-1477587458883-47145ed94245",
  chennai: "photo-1582510003544-4d00b7f74220",
  kolkata: "photo-1558431382-27e303142255",
  hyderabad: "photo-1600689728264-b02e40cc6866",
  pune: "photo-1567459045860-7ec71a5c3c8a",
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function unsplash(id: string, w = 800, h = 600): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

export function cityImage(city: string, w = 800, h = 600): string {
  const key = (city || "").toLowerCase().trim();
  const id = CITY_PHOTOS[key] ?? HOTEL_PHOTOS[hash(key || "city") % HOTEL_PHOTOS.length];
  return unsplash(id, w, h);
}

export function hotelImage(seed: string | number, w = 800, h = 600): string {
  const id = HOTEL_PHOTOS[hash(String(seed)) % HOTEL_PHOTOS.length];
  return unsplash(id, w, h);
}

export function roomImage(seed: string | number, w = 800, h = 600): string {
  const id = ROOM_PHOTOS[hash(String(seed)) % ROOM_PHOTOS.length];
  return unsplash(id, w, h);
}

export function hotelGallery(seed: string | number, count = 3, w = 800, h = 600): string[] {
  const start = hash(String(seed));
  return Array.from({ length: count }, (_, i) =>
    unsplash(HOTEL_PHOTOS[(start + i) % HOTEL_PHOTOS.length], w, h),
  );
}