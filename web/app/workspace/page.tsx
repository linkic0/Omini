import type { Metadata } from "next";
import { WorkspaceRoute } from "@/components/workspace/workspace-route";

export const metadata: Metadata = {
  title: "Workspace | Idea-to-Deploy",
  description: "GTM Workspace demo with overview, materials and analytics tabs.",
};

export default function WorkspacePage() {
  return <WorkspaceRoute />;
}
