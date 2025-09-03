import { apiRoutes } from "@/routes";
import { api } from "./index";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: { id: string; email: string };
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post(apiRoutes.LOGIN, data);
  return response.data;
};
