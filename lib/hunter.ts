import { HunterResult, HunterContact } from '@/types';

const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
const HUNTER_BASE_URL = "https://api.hunter.io/v2";

// Extract domain from a website URL
export function extractDomain(website: string): string {
    try {
        const url = new URL(
            website.startsWith("http") ? website : `https://${website}`
        );
        return url.hostname.replace("www.", "");
    } catch {
        return website.replace(/^https?:\/\//, "").replace("www.", "").split("/")[0];
    }
}

// Search for contacts by domain
export async function findContactsByDomain(
    domain: string,
    company: string
): Promise<HunterResult | null> {
    try {
        const response = await fetch(
            `${HUNTER_BASE_URL}/domain-search?domain=${domain}&company=${encodeURIComponent(
                company
            )}&api_key=${HUNTER_API_KEY}&limit=5`
        );

        const data = await response.json();

        if (data.errors) {
            console.error("Hunter.io error:", data.errors);
            return null;
        }

        if (!data.data) return null;

        const contacts: HunterContact[] = (data.data.emails || []).map(
            (email: any) => ({
                first_name: email.first_name || "",
                last_name: email.last_name || "",
                title: email.position || "",
                email: email.value || "",
                confidence_score: email.confidence || 0,
                linkedin_url: email.linkedin || "",
            })
        );

        return {
            domain,
            company,
            contacts,
        };
    } catch (error) {
        console.error("Hunter.io fetch error:", error);
        return null;
    }
}

// Find a specific person by name and domain
export async function findEmailByName(
    firstName: string,
    lastName: string,
    domain: string
): Promise<HunterContact | null> {
    try {
        const response = await fetch(
            `${HUNTER_BASE_URL}/email-finder?domain=${domain}&first_name=${encodeURIComponent(
                firstName
            )}&last_name=${encodeURIComponent(lastName)}&api_key=${HUNTER_API_KEY}`
        );

        const data = await response.json();

        if (data.errors || !data.data) return null;

        return {
            first_name: firstName,
            last_name: lastName,
            title: data.data.position || "",
            email: data.data.email || "",
            confidence_score: data.data.confidence || 0,
            linkedin_url: data.data.linkedin || "",
        };
    } catch (error) {
        console.error("Hunter.io email finder error:", error);
        return null;
    }
}

// Verify an email address
export async function verifyEmail(
    email: string
): Promise<{ valid: boolean; score: number } | null> {
    try {
        const response = await fetch(
            `${HUNTER_BASE_URL}/email-verifier?email=${encodeURIComponent(
                email
            )}&api_key=${HUNTER_API_KEY}`
        );

        const data = await response.json();

        if (data.errors || !data.data) return null;

        return {
            valid: data.data.result === "deliverable",
            score: data.data.score || 0,
        };
    } catch (error) {
        console.error("Hunter-io verify error:", error);
        return null;
    }
}