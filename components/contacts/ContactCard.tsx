"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HunterContact } from "@/types";
import {
    User,
    Mail,
    Briefcase,
    Copy,
    CheckCheck,
    Globe,
    ShieldCheck,
    ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContactCardProps {
    contact: HunterContact;
}

export default function ContactCard({ contact }: ContactCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(contact.email);
            setCopied(true);
            toast.success("Email copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy email");
        }
    };

    const getConfidenceColor = (score: number) => {
        if (score >= 70) return "border-green-200 text-green-700 bg-green-50";
        if (score >= 40) return "border-yellow-200 text-yellow-700 bg-yellow-50";
        return "border-red-200 text-red-700 bg-red-50";
    };

    const getConfidenceLabel = (score: number) => {
        if (score >= 70) return "High Confidence";
        if (score >= 40) return "Medium Confidence";
        return "Low confidence";
    };

    return (
        <Card className="border-gray-100 hover:shadow-md transition-shadow duration-200">
            <CardContent className="pt-6 flex flex-col gap-3">

                {/* Name & Title */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600 shrink-0" />
                            <span className="font-semibold text-gray-900">
                                {contact.first_name} {contact.last_name}
                            </span>
                        </div>
                        {contact.title && (
                            <div className="flex items-center gap-2 ml-6">
                                <Briefcase className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                <span className="text-sm text-gray-500">{contact.title}</span>
                            </div>
                        )}
                    </div>

                    {/* Confidence Score */}
                    {contact.confidence_score > 0 && (
                        <Badge
                          variant="outline"
                          className={`text=xs shrink-0 ${getConfidenceColor(
                            contact.confidence_score
                          )}`}
                        >
                            {contact.confidence_score >= 70 ? (
                                <ShieldCheck className="h-3 w-3 mr-1" />
                            ) : (
                                <ShieldAlert className="h-3 w-3 mr-1" />
                            )}
                            {contact.confidence_score}% - {getConfidenceLabel(contact.confidence_score)}
                        </Badge>
                    )}
                </div>

                {/* Email */}
                {contact.email && (
                    <div className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                            <span className="text-sm text-gray-700 truncate">
                                {contact.email}
                            </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyEmail}
                          className="shrink-0 h-7 w-7 p-0 hover:bg-gray-200"
                        >
                            {copied ? (
                                <CheckCheck className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                                <Copy className="h-3.5 w-3.5 text-gray-500" />
                            )}
                        </Button>
                    </div>
                )}

                {/* LinkedIn */}
                {contact.linkedin_url && (
                  <a
                    href={contact.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Globe className="h-4 w-4 shrink-0" />
                    View LinkedIn Profile
                  </a>
                )}

            </CardContent>
        </Card>
    );
}