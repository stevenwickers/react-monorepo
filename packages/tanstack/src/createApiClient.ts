import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'


export const createApiClient = (baseURL: string, accessToken: string): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 30000,
  })

  apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    //console.log('📡 Interceptor triggered for request:', config.url)

    // Attach the token to the Authorization header
    config.headers.Authorization = `Bearer ${accessToken}`

    return config
  }, (error) => {
    return Promise.reject(error)
  })

  return apiClient
}
