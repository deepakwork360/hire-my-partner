import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Map Photon GeoJSON Feature to Nominatim format for frontend compatibility
function mapPhotonToNominatim(feature: any) {
  const props = feature.properties || {};
  const coords = feature.geometry?.coordinates || [0, 0];
  
  // Build a clean, structured display name
  const displayParts = [
    props.name || props.street,
    props.locality,
    props.district,
    props.city,
    props.state,
    props.country
  ].filter(Boolean);
  
  return {
    place_id: props.osm_id || Math.floor(Math.random() * 10000000),
    lat: coords[1]?.toString() || "0",
    lon: coords[0]?.toString() || "0",
    display_name: displayParts.join(", "),
    address: {
      road: props.street || props.name,
      suburb: props.locality,
      city: props.city,
      state: props.state,
      postcode: props.postcode,
      country: props.country,
      country_code: props.countrycode?.toLowerCase()
    }
  };
}

async function fetchPhoton(q: string, countrycodes: string) {
  const cc = countrycodes ? countrycodes.toLowerCase() : "";
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5${
    cc ? `&countrycode=${cc}` : ""
  }`;
  
  try {
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "en"
      }
    });
    if (!res.ok) return [];
    
    const data = await res.json();
    const features = data.features || [];
    return features.map(mapPhotonToNominatim);
  } catch (err) {
    console.error("[Geocode Proxy] Photon API failed:", err);
    return [];
  }
}

async function fetchNominatim(q: string, countrycodes: string) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=5${
    countrycodes ? `&countrycodes=${countrycodes.toLowerCase()}` : ""
  }`;
  
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "HireMyPartner/1.0 (contact@hiremypartner.com)",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("[Geocode Proxy] Nominatim API failed:", err);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const countrycodes = searchParams.get("countrycodes") || "";

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    // -------------------------------------------------------------
    // PRIMARY RESOLVER: Photon API (Fast, fuzzy, no rate limits)
    // -------------------------------------------------------------
    let data = await fetchPhoton(q, countrycodes);
    if (data && data.length > 0) {
      return NextResponse.json(data);
    }

    // Fallback 1: Strip prefix numbers/unit labels
    let cleanQ = q
      .replace(/^\s*\d+[a-zA-Z]?-?\s*/, "")
      .replace(/^(flat|house|room|plot|shop|no|number|block)\s*\S*\s*/i, "")
      .trim();

    if (cleanQ && cleanQ !== q) {
      data = await fetchPhoton(cleanQ, countrycodes);
      if (data && data.length > 0) {
        return NextResponse.json(data);
      }
    }

    // Fallback 2: Try last 3 and 2 words
    const parts = q.split(/[\s,]+/);
    if (parts.length > 2) {
      const last3 = parts.slice(-3).join(" ");
      data = await fetchPhoton(last3, countrycodes);
      if (data && data.length > 0) {
        return NextResponse.json(data);
      }

      const last2 = parts.slice(-2).join(" ");
      data = await fetchPhoton(last2, countrycodes);
      if (data && data.length > 0) {
        return NextResponse.json(data);
      }
    }

    // -------------------------------------------------------------
    // BACKUP RESOLVER: Nominatim API (Fallback in case of Photon downtime)
    // -------------------------------------------------------------
    data = await fetchNominatim(q, countrycodes);
    if (data && data.length > 0) {
      return NextResponse.json(data);
    }

    if (cleanQ && cleanQ !== q) {
      data = await fetchNominatim(cleanQ, countrycodes);
      if (data && data.length > 0) {
        return NextResponse.json(data);
      }
    }

    if (parts.length > 2) {
      const last3 = parts.slice(-3).join(" ");
      data = await fetchNominatim(last3, countrycodes);
      if (data && data.length > 0) {
        return NextResponse.json(data);
      }

      const last2 = parts.slice(-2).join(" ");
      data = await fetchNominatim(last2, countrycodes);
      if (data && data.length > 0) {
        return NextResponse.json(data);
      }
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("[Geocode Proxy] Main GET handler error:", error);
    return NextResponse.json({ error: "Failed to fetch geocode data" }, { status: 500 });
  }
}
