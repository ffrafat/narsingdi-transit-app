// useGoogleLogin.js
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { makeRedirectUri } from 'expo-auth-session';

export function useGoogleLogin() {
  const redirectUri = makeRedirectUri({
  native: `1033915031162-f43tahd1c9bh6tr1qs65vf8brf6cmcq1:/oauthredirect`, // replace with your actual Android client ID
});
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '1082640503853-7d5d05g6tqlpe1eu6eb1g7hru4.apps.googleusercontent.com',
    androidClientId: '1033915031162-f43tahd1c9bh6tr1qs65vf8brf6cmcq1.apps.googleusercontent.com',
    webClientId: '1033915031162-6lidtmi1gktog0skl94julg8ek84kuor.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return { promptAsync, request };
}
