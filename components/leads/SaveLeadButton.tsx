"use  client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookMarked } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Business } from "@/types";
import { toast } from "sonner";

interface SaveLeadButtonProps  {
    business: Business;
    isSaved?: boolean;
    onSave?: () => void;
}

export default function SaveLeadButton({
    business,
    isSaved = false,
    onSave,
}: SaveLeadButtonProps) {
    const [saved, setSaved] = useState(isSaved);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (saved) {
            toast.info("This lead is already saved");
            return;
        }

        setLoading(true);

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

            setSaved(true);
            toast.success(`${business.business_name} saved to leads`);
            if (onSave) onSave();
        } catch {
            toast.error("Failed to save lead,please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={loading || saved}
          className={
            saved
              ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-50"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }
        >
            <BookMarked className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : saved ? "Saved" : "Save Lead"}
        </Button>
    );
}