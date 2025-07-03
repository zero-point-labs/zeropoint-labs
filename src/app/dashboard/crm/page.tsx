"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CRMDashboardAppwrite } from "@/components/ui/crm-appwrite";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <div className="p-4 sm:p-6 lg:p-8">
        <CRMDashboardAppwrite />
      </div>
    </ProtectedRoute>
  );
} 