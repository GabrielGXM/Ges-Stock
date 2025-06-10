import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, SafeAreaView, Platform, ScrollView, StatusBar } from 'react-native';
import { useUser, useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../../utils/context/themedContext'; // <-- IMPORTAR useTheme AQUI


export default function CustomProfile() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);

  const { theme } = useTheme(); // <-- CHAMAR O HOOK useTheme AQUI!

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setCompanyName((user.unsafeMetadata?.companyName as string) || '');
    }
  }, [isLoaded, user]);

  const handleSaveProfile = async () => {
    if (!isLoaded || !user || loadingSave) return;
    setLoadingSave(true);
    try {
      await user.update({
        firstName: firstName,
        lastName: lastName,
        unsafeMetadata: {
          companyName: companyName,
        },
      });
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (e: any) {
      Alert.alert("Erro", e.errors?.[0]?.message || "Não foi possível atualizar o perfil.");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Confirmar Saída",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: async () => {
            await signOut();
            router.replace('/(public)/welcome');
          }
        }
      ],
      { cancelable: false }
    );
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> {/* Cor de fundo do loading */}
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}> {/* Cor de fundo do loading */}
          <ActivityIndicator size="large" color={theme.text} /> {/* Cor do indicador */}
          <Text style={[styles.loadingText, { color: theme.text }]}>Carregando perfil...</Text> {/* Cor do texto */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> {/* Cor de fundo principal */}
      <View style={styles.container}>
        {/* Header Customizado */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : Constants.statusBarHeight + 10, backgroundColor: theme.cardBackground, borderBottomColor: theme.cardBorder }]}> {/* Cores do tema */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.text} /> {/* Cor do ícone */}
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Meu Perfil</Text> {/* Cor do título */}
          <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={28} color={theme.text} /> {/* Cor do ícone */}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Informações Básicas</Text> {/* Cores do tema */}
          <Text style={[styles.infoText, { color: theme.text }]}>Email: {user.emailAddresses[0]?.emailAddress}</Text> {/* Cores do tema */}

          <Text style={[styles.label, { color: theme.text }]}>Nome</Text> {/* Cores do tema */}
          <TextInput
            placeholder="Nome"
            value={firstName}
            onChangeText={setFirstName}
            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder, color: theme.inputText }]} // Cores do input
            placeholderTextColor={theme.text === '#FFFFFF' ? '#aaa' : '#999'} // Cor do placeholder
          />
          <Text style={[styles.label, { color: theme.text }]}>Sobrenome</Text>
          <TextInput
            placeholder="Sobrenome"
            value={lastName}
            onChangeText={setLastName}
            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder, color: theme.inputText }]}
            placeholderTextColor={theme.text === '#FFFFFF' ? '#aaa' : '#999'}
          />
          <Text style={[styles.label, { color: theme.text }]}>Nome da Empresa</Text>
          <TextInput
            placeholder="Nome da Empresa"
            value={companyName}
            onChangeText={setCompanyName}
            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder, color: theme.inputText }]}
            placeholderTextColor={theme.text === '#FFFFFF' ? '#aaa' : '#999'}
          />

          <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonPrimaryBg }]} onPress={handleSaveProfile} disabled={loadingSave}> {/* Cor do botão */}
            {loadingSave ? <ActivityIndicator color={theme.buttonPrimaryText} /> : <Text style={[styles.buttonText, { color: theme.buttonPrimaryText }]}>Salvar Alterações</Text>}
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Opções de Segurança</Text>
          <TouchableOpacity style={[styles.securityOptionButton, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]} onPress={() => { /* Navegar para Mudar Senha */ }}> {/* Cores do item */}
            <Text style={[styles.securityOptionText, { color: theme.text }]}>Mudar Senha</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.securityOptionButton, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]} onPress={() => { /* Navegar para Gerenciar Emails */ }}>
            <Text style={[styles.securityOptionText, { color: theme.text }]}>Gerenciar Endereços de Email</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.text} />
          </TouchableOpacity>
          {/* ... outras opções */}

          <TouchableOpacity onPress={handleSignOut} style={[styles.redButton, { backgroundColor: theme.red }]}> {/* Cor do botão (vermelho do tema) */}
            <Text style={styles.redButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor handled by theme
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor handled by theme
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    // color handled by theme
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    // backgroundColor handled by theme
    borderBottomWidth: 1,
    // borderBottomColor handled by theme
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    // color handled by theme
  },
  backButton: {
    padding: 5,
  },
  logoutButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    // color handled by theme
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    // color handled by theme
  },
  label: {
    fontSize: 14,
    // color handled by theme
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    // borderColor handled by theme
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    // backgroundColor handled by theme
    // color handled by theme
  },
  button: {
    // backgroundColor handled by theme
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000', // Sombra geralmente preta/cinza escuro
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    // color handled by theme
    fontWeight: 'bold',
    fontSize: 18,
  },
  securityOptionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    // backgroundColor handled by theme
    // borderColor handled by theme
  },
  securityOptionText: {
    fontSize: 16,
    // color handled by theme
  },
  redButton: {
    // backgroundColor handled by theme
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
  },
  redButtonText: {
    color: '#fff', // Cor do texto do botão vermelho
    fontWeight: 'bold',
    fontSize: 18,
  },
});