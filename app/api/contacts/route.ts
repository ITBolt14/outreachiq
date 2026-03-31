import { NextRequest, NextResponse } from "next/server";
import { findContactsByDomain } from "@/lib/hunter";
import {extractDomain } from "@/lib/hunter";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const website = searchParams.get("website") || "";
    const company = searchParams.get("company") || "";
    const leadId = searchParams.get("lead_id") || "";

    if (!website) {
        return NextResponse.json(
            { error: "Website is required to find contacts" },
            { status: 400 }
        );
    }

    try {
        const domain = extractDomain(website);

        if (!domain) {
            return NextResponse.json(
                { error: "Could not extract domain from website" },
                { status: 400 }
            );
        }

        // Search Hunter.io for contacts
        const result = await findContactsByDomain(domain, company);

        if (!result || result.contacts.length === 0) {
            return NextResponse.json({
                contacts: [],
                domain,
                message: "No contacts found for this domain",
            });
        }

        // If we have a lead_id save contacts to Supabase
        if (leadId && result.contacts.length > 0) {
            const contactsToInsert = result.contacts.map((contact) => ({
                lead_id: leadId,
                first_name: contact.first_name,
                last_name: contact.last_name,
                title: contact.title,
                email: contact.email,
                confidence_score: contact.confidence_score,
                source: "hunter.io",
            }));

            const { error } = await supabase
              .from("contacts")
              .upsert(contactsToInsert, {
                onConflict: "lead_id, email",
              });

            if (error) {
                console.error("Supabase insert error:", error);
            }
        }

        return NextResponse.json({
            contacts: result.contacts,
            domain,
            total: result.contacts.length,
        });
    } catch (error) {
        console.error("Contacts API error:", error);
        return NextResponse.json(
            { error: "Something went wrong, please try again" },
            { status: 500 }
        );
    }
}