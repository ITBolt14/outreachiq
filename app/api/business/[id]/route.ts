import { NextRequest, NextResponse } from"next/server";
import { getBusinessDetails } from "@/lib/google-places";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: "Business ID is required" },
            { status: 400 }
        );
    }

    try {
        const business = await getBusinessDetails(id);

        if (!business) {
            return NextResponse.json(
                { error: "Business not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ business });
    } catch {
        return NextResponse.json(
            { error: "Something went wrong, please try again" },
            { status: 500 }
        );
    }
}