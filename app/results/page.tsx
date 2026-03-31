"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PlaceResult } from "@/lib/google-places";
import BusinessGrid from "@/components/business/BusinessGrid";
import MapView from "@/components/map/MapView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, Map, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [center, setCenter] = useState({ lat: -26.2041, lng: 28.0473 });

  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const radius = searchParams.get("radius") || "5000";
  const category = searchParams.get("category") || "all";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?${searchParams.toString()}`
        );
        const data = await response.json();

        if (data.error) {
          toast.error(data.error);
          return;
        }

        setBusinesses(data.businesses || []);

        if (data.location) {
          setCenter(data.location);
        }
      } catch {
        toast.error("Failed to fetch results, please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const handleSave = async (business: PlaceResult) => {
    try {
      const { error } = await supabase.from("saved_leads").upsert({
        place_id: business.place_id,
        business_name: business.business_name,
        address: business.address,
        phone: business.phone,
        website: business.website,
        rating: business.rating,
        category: business.category,
        latitude: business.latitude,
        longitude: business.longitude,
      });

      if (error) throw error;

      setSavedIds((prev) => [...prev, business.place_id]);
      toast.success(`${business.business_name} saved to leads`);
    } catch {
      toast.error("Failed to save lead, please try again");
    }
  };

  const handleViewDetails = (business: PlaceResult) => {
    router.push(`/leads/${business.place_id}`);
  };

  const formatRadius = (r: string) => {
    const num = Number(r);
    return num >= 1000 ? `${num / 1000} km` : `${num} m`;
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-500 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              New Search
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {loading
              ? "Searching..."
              : `${businesses.length} businesses found`}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {keyword && (
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700"
              >
                {keyword}
              </Badge>
            )}
            {location && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-600"
              >
                {location}
              </Badge>
            )}
            {category !== "all" && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-600"
              >
                {category}
              </Badge>
            )}
            <Badge variant="outline" className="text-gray-500">
              {formatRadius(radius)} radius
            </Badge>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("grid")}
            className={
              view === "grid"
                ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                : "text-gray-500 hover:text-gray-700"
            }
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("map")}
            className={
              view === "map"
                ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                : "text-gray-500 hover:text-gray-700"
            }
          >
            <Map className="h-4 w-4 mr-2" />
            Map
          </Button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-6 border rounded-xl bg-white"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-full mt-2" />
            </div>
          ))}
        </div>
      ) : view === "grid" ? (
        <BusinessGrid
          businesses={businesses}
          onViewDetails={handleViewDetails}
          onSave={handleSave}
          savedIds={savedIds}
        />
      ) : (
        <div className="h-[600px] w-full">
          <MapView
            businesses={businesses}
            center={center}
            onMarkerClick={handleViewDetails}
          />
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Loading results...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}