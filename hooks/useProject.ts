import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const UseGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get("/api/projectlist");
      return response.data;
      if (!response.data) {
        return [];
      }
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
  });
};
