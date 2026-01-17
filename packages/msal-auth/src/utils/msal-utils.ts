import {msalInstance} from '@/msal/msalConfig.tsx'

export const getBearerToken = async (scopes: string[]): Promise<string> => {
  const currentAccount = msalInstance.getActiveAccount() ?? msalInstance.getAllAccounts()[0];

  if (!currentAccount) {
    console.error('No active MSAL account found')
    return ''
  }

  const tokenResponse = await msalInstance.acquireTokenSilent({
    account: currentAccount,
    scopes,
  });

  return tokenResponse.accessToken;
}

/// Usage:
// const token = await getBearerToken(['https://graph.microsoft.com/.default'])
//
// apiClient.interceptors.request.use(async (config) => {
//   const token = await getBearerToken(['api://your-api-id/CPQ.Read']);
//   config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });