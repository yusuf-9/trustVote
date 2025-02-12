import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError } from "axios";

class AxiosService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    });
  }

  // GET request method
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<{ data: T }>> {
    try {
      const response = await this.axiosInstance.get<{ data: T }>(url, config);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data.error || error?.message);
      }
      throw new Error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  // POST request method
  public async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<{ data: T }>> {
    try {
      const response = await this.axiosInstance.post<{ data: T }>(url, data, config);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data.error || error?.message);
      }
      throw new Error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  // PUT request method
  public async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<{ data: T }>> {
    try {
      const response = await this.axiosInstance.put<{ data: T }>(url, data, config);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data.error || error?.message);
      }
      throw new Error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  // DELETE request method
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<{ data: T }>> {
    try {
      const response = await this.axiosInstance.delete<{ data: T }>(url, config);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data.error || error?.message);
      }
      throw new Error(error instanceof Error ? error.message : "Something went wrong");
    }
  }
}

const axiosClientInstance = new AxiosService();

export default axiosClientInstance;
