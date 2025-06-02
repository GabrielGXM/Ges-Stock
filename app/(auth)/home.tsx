import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,Platform,StatusBar,SafeAreaView,Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo, Feather } from '@expo/vector-icons';
import { useAuth,useUser } from '@clerk/clerk-expo';
import Constants from 'expo-constants';




export default function Home() {
  
  
  const {user} = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert( // Adicionar Alert para confirmação
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
      { cancelable: false } // Impede que o alerta seja fechado tocando fora
    );
  };

  return (
   <SafeAreaView style={styles.safeArea}> {/* Use styles.safeArea para padronizar */}
      <View style={styles.container}>
        {/* Header - Ajuste o paddingTop aqui para a Status Bar */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : Constants.statusBarHeight + 10 }]}> {/* Adiciona altura da status bar + um pouco de padding extra */}
          <TouchableOpacity onPress={() => router.push("(auth)/config")}>
            <Ionicons name="settings-outline" size={28} />
          </TouchableOpacity>
          <Text style={styles.logo}>📈 GES Stock</Text>
          <TouchableOpacity onPress={handleLogout} >
            <Ionicons name="log-out-outline" size={28} />
          </TouchableOpacity>
        </View>

      {/* User Info */}
      <View style={styles.userCard}>
        <View style={styles.userLeft}>
          <Ionicons name="person-circle-outline" size={36} />
          <Text style={styles.welcome}>
                Bem vindo, <Text style={styles.username}>{user?.firstName ?? ''}</Text>
          </Text>
        </View>
        <Text style={styles.store}>Loja <Text style={styles.storeName}>{(user?.unsafeMetadata?.companyName as string) ?? ''}</Text></Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Grid Buttons */}
        <TouchableOpacity style={styles.box} onPress={() => router.push("(auth)/cadProd")}>
          <MaterialIcons name="post-add" size={30} />
          <Text style={styles.boxText}>Cadastrar produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}onPress={() => router.push("(auth)/cadCate")}>
          <Entypo name="flow-tree" size={30} />
          <Text style={styles.boxText}>Cadastrar categorias</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}onPress={() => router.push("(auth)/exportData")}>
          <Feather name="bar-chart-2" size={30} />
          <Text style={styles.boxText}>Exportar dados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <MaterialIcons name="qr-code" size={30} />
          <Text style={styles.boxText}>Gerar QrCode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxVizu}onPress={() => router.push("(auth)/VizuEstoq")}>
          <FontAwesome5 name="search" size={24} />
          <Text style={styles.boxText}>Visualizar estoque</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/(auth)/profile')}>
          <Ionicons name="person-outline" size={26} />
          <Text>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/about')}>
          <Entypo name="info-with-circle" size={26} />
          <Text>Sobre</Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { // Novo estilo para SafeAreaView
    flex: 1,
    backgroundColor: '#fff',
  },
  container: { // Remova o paddingTop fixo daqui
    flex: 1,
    // paddingTop: 50, <--- REMOVER ESTA LINHA
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: '#fff', // Adicione um background para o header se ele for flutuante
    paddingVertical: 10, // Ajuste o padding vertical conforme necessário
    // paddingTop: já será calculado dinamicamente no componente
  },
  logo: { fontSize: 20, fontWeight: 'bold' },
  userCard: {
    margin: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f4f3f2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  welcome: { fontSize: 16 },
  username: { fontWeight: 'bold', fontSize: 18 },
  store: { fontSize: 14, textAlign: 'right' },
  storeName: { fontWeight: 'bold' },
  body: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 10,
    flexGrow: 1, // Permite que o ScrollView cresça
  },
  box: {
    width: '40%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  boxVizu: {
    width: '80%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  boxText: { marginTop: 8, textAlign: 'center' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    backgroundColor: '#f4f3f2',
  },
});