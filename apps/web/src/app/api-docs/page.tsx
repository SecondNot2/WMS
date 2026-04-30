"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";

/**
 * Interactive API documentation powered by Scalar.
 * Spec is fetched from /api/openapi.json (auto-generated from Zod schemas).
 */
export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <ApiReferenceReact
        configuration={{
          url: "/api/openapi.json",
          theme: "default",
          layout: "modern",
          hideDownloadButton: false,
          hideTestRequestButton: false,
          metaData: {
            title: "WMS API Reference",
            description:
              "Interactive REST API documentation cho Warehouse Management System.",
          },
        }}
      />
    </div>
  );
}
