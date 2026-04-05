import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type DashboardProject } from "@/lib/admin-dashboard";

type ProjectListResponse = {
  projects?: DashboardProject[];
};

export const UseGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<DashboardProject[]> => {
      const response = await axios.get<ProjectListResponse>("/api/projectlist");
      return response.data?.projects ?? [];
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });
};
