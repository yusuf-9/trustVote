import { QUERIES } from "@/client/common/constants/queries";
import axiosClientInstance from "@/client/common/services/axios/client-instance";
import { useQuery } from "@tanstack/react-query";
import { UserInfo } from "@/client/modules/auth/types";

export default function useUserInfo() {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERIES.USER_INFO],
    queryFn: async () => {
      const response = await axiosClientInstance.get<UserInfo>("/auth/user-info", { withCredentials: true });
      return response.data.data;
    },
  });

  return {
    userInfo: data,
    isLoading,
    error,
  };
}
