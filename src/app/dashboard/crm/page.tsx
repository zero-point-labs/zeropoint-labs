"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CRMDashboardAppwrite } from "@/components/ui/crm-appwrite";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black p-6">
        <CRMDashboardAppwrite />
      </div>
    </ProtectedRoute>
  );
} 