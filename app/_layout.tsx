// app/_layout.tsx

// _layout.tsx

import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View, Text } from "react-native"; // Certifique-se de que Text está importado
import { ThemeProvider } from '../utils/context/themedContext'; // <-- IMPORTAR ThemeProvider AQUI

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(public)/welcome");
    } else if (isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/home");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#38a69d" />
        <Text style={{ marginTop: 10, color: '#555' }}>Carregando aplicativo...</Text>
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProvider> {/* <-- ENVOLVER AQUI InitialLayout com ThemeProvider */}
        <InitialLayout />
      </ThemeProvider>
    </ClerkProvider>
  );
}



