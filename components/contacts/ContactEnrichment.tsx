"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HunterContact } from "@/types";
import ContactCard from "./ContactCard";
import {
    Users,
    Loader2,
    AlertCircle,
    SearchX,
} from "lucide-react";
import { toast } from "sonner";

interface ContactEnrichmentProps {
    website: string;
    company: string;
    leadId?: string;
}

export default function ContactEnrichment({
    website,
    company,
    leadId,
}: ContactEnrichmentProps) {
    const [contacts, setContacts] = useState<HunterContact[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    const handleFindContacts = async () => {
        if (!website) {
            toast.error("No website found for this business");
            return;
        }

        setLoading(true);
        setError("");
        setSearched(false);

        try {
            const params = new URLSearchParams({
                website,
                company,
                ...(leadId && { lead_id: leadId }),
            });

            const response = await fetch(`/api/contacts?${params.toString()}`);
            const data = await response.json();

            if (data.error) {
                setError(data.error);
                toast.error(data.error);
                return;
            }

            setContacts(data.contacts || []);
            setSearched(true);

            if (data.contacts.length === 0) {
                toast.info("No contacts found for this business");
            } else {
                toast.success(
                    `Found ${data.contacts.length} ${
                        data.contacts.length === 1 ? "contact" : "contacts"
                    }`
                );
            }
        } catch {
            setError("Failed to find contacts, please try again");
            toast.error("Failed to find contacts, please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="felx flex-col gap-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <h3 className="font-semibold text-gray-900">Contact Enrichment</h3>
                    <p className="text-sm text-gray-500">
                        Find decision makers and their email address
                    </p>
                </div>
                <Button
                  onClick={handleFindContacts}
                  disabled={loading || !website}
                  className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                >
                    {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Searching...
                        </>
                    ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          {searched ? "Search Again" : "Find Contacts"}
                        </>
                    )}
                </Button>
            </div>

            {/* No Website Warning */}
            {!website && (
                <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0" />
                    <p className="text-sm text-yellow-700">
                        No website found for this business. A website is required to
                        find contacts.
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* No Contacts Found */}
            {searched && contacts.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <SearchX className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                        No contacts found for this domain. Try searching manually on
                        LinkedIn or the company website.
                    </p>
                </div>
            )}

            {/* Contacts list */}
            {contacts.length > 0 &&  (
                <div className="flexflex-col gap-3">
                    <p className="text-sm text-gray-500">
                        {contacts.length} {contacts.length === 1 ? "contact" : "contacts"} found
                    </p>
                    {contacts.map((contact, index) => (
                        <ContactCard key={index} contact={contact} />
                    ))}
                </div>
            )}

        </div>
    );
}