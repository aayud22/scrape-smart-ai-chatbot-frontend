import Image from "next/image";
import React, { useState, useEffect } from "react";

interface SocialPreviewProps {
    url: string;
}

interface SocialPreviewData {
    image?: { url?: string };
    logo?: { url?: string };
    title?: string;
    description?: string;
    publisher?: string;
    url?: string;
}

interface MicrolinkResponse {
    status: "success" | "error";
    data?: SocialPreviewData;
}

export default function SocialPreview({ url }: SocialPreviewProps) {
    const [previewData, setPreviewData] = useState<SocialPreviewData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const fetchPreview = async () => {
            if (!url) return;
            setIsLoading(true);
            setError(false);
            try {
                // Fetching real meta tags (OG Image, Title, Description) using Microlink
                const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`, {
                    signal: controller.signal,
                });
                const json = (await res.json()) as MicrolinkResponse;

                if (json.status === "success" && json.data) {
                    setPreviewData(json.data);
                } else {
                    setError(true);
                }
            } catch {
                if (controller.signal.aborted) {
                    return;
                }
                setError(true);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchPreview();

        return () => controller.abort();
    }, [url]);

    if (isLoading) {
        return (
            <div className="animate-pulse flex flex-col gap-0 w-full max-w-lg mx-auto mt-6 rounded-xl overflow-hidden border border-border">
                <div className="h-48 bg-muted w-full" />
                <div className="p-4 bg-card space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                </div>
            </div>
        );
    }

    if (error || !previewData) {
        return (
            <div className="text-center p-6 bg-card border border-border rounded-xl mt-6 text-muted-foreground text-sm">
                Could not generate social preview for this URL.
            </div>
        );
    }

    // Fallback to screenshot if specific OG image is missing
    const rawImageUrl = previewData.image?.url || previewData.logo?.url || `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

    // 👇 Wrap it in a reliable CORS proxy so the PDF engine can download it
    const imageUrl = rawImageUrl ? `https://wsrv.nl/?url=${encodeURIComponent(rawImageUrl)}` : '';

    return (
        <div className="mt-8 pt-8 border-t border-border animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                <div>
                    <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        Social Media Preview
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        How this link appears when shared on social platforms and messaging apps.
                    </p>
                </div>
            </div>

            <div className="flex justify-center bg-accent/40 p-6 rounded-2xl border border-border">
                {/* Twitter / LinkedIn Style Card */}
                <div className="w-full max-w-lg bg-card rounded-xl overflow-hidden border border-border transition-colors cursor-pointer group">
                    {/* Card Image */}
                    <div className="relative h-52 sm:h-64 overflow-hidden bg-accent/30 border-b border-border">
                        <Image
                            width={100}
                            height={100}
                            src={imageUrl}
                            alt="Social Preview"
                            crossOrigin="anonymous"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                // Hide image block if it totally fails
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                            {previewData.publisher || new URL(url).hostname.replace('www.', '')}
                        </p>
                        <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug mb-2 line-clamp-1">
                            {previewData.title || "Website Title Missing"}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {previewData.description || "No meta description provided."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
