"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SavedLead } from "@/types";
import LeadsList from "@/components/leads/LeadsList"
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LeadsPage() {
    const router = useRouter();
    const [leads, setLeads] = useState<SavedLead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
              .from("saved_leads")
              .select("*")
              .order("saved_at", { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch {
            toast.error("Failed to fetch saved leads");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        try {
            const { error } = await supabase
              .from("saved_leads")
              .delete()
              .eq("id", id);

            if (error) throw error;

            setLeads((prev) => prev.filter((lead) => lead.id !== id));
            toast.success(`${name} removed from saved leads`);
        } catch {
            toast.error("Failed to delete lead, please try again");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
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
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">Saved Leads</h1>
                    <p className="text-gray-500">
                        {leads.length}{" "}
                        {leads.length === 1 ? "leads" : "leads"} saved
                    </p>
                </div>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-blue-600 hover:bg-blue-700 text-white self-start sm:self-auto"
                >
                    Find More Leads
                </Button>
            </div>

            {/* Leads List */}
            <LeadsList leads={leads} onDelete={handleDelete} />

        </div>
    );
}