// ARQUIVO about.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../../utils/context/themedContext'; // <-- IMPORTAR useTheme AQUI


export default function AboutScreen() {
  const router = useRouter();
  const { theme } = useTheme(); // <-- CHAMAR O HOOK useTheme AQUI!

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> {/* Aplicar background do tema */}
      <View style={styles.container}>
        {/* Header Customizado */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : Constants.statusBarHeight + 10, backgroundColor: theme.cardBackground, borderBottomColor: theme.cardBorder }]}> {/* Cores do tema */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={theme.text} /> {/* Cor do ícone */}
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Sobre</Text> {/* Cor do título */}
          <View style={styles.spacer} /> {/* Espaçador para centralizar o título */}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.appTitle, { color: theme.buttonPrimaryBg }]}>📈 GES Stock</Text> {/* Cor do tema */}
          <Text style={[styles.versionText, { color: theme.text }]}>Versão 1.0.1</Text> {/* Cor do tema */}

          <Text style={[styles.sectionTitle, { color: theme.text }]}>O que é o GES Stock?</Text> {/* Cores do tema */}
          <Text style={[styles.bodyText, { color: theme.text }]}> {/* Cores do tema */}
            O GES Stock é um aplicativo móvel intuitivo e fácil de usar, desenvolvido para auxiliar pequenos negócios e empreendedores a controlar seus produtos de forma eficiente.
            Com ele, você pode controlar seus produtos e categorias de forma simples, diretamente na palma da sua mão.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Principais Funções:</Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>Cadastro de Produtos:</Text> Adicione novos itens ao seu estoque com nome, quantidade, preço e categoria.</Text>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>Cadastro de Categorias:</Text> Organize seus produtos criando categorias personalizadas (ex: "Eletrônicos", "Alimentos", "Limpeza").</Text>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>Visualização do Estoque:</Text> Consulte todos os produtos cadastrados de forma clara, podendo editar ou excluir.</Text>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>Edição e Exclusão de Produtos:</Text> Mantenha seus dados atualizados modificando ou removendo produtos do estoque.</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Tecnologias Utilizadas:</Text>
          <Text style={[styles.bodyText, { color: theme.text }]}>
            O desenvolvimento do GES Stock foi realizado com as seguintes tecnologias de ponta:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>React Native:</Text> Framework para construção de aplicativos móveis multiplataforma.</Text>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>Expo:</Text> Plataforma que facilita o desenvolvimento, teste e deploy de aplicativos React Native.</Text>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>Clerk:</Text> Solução de autenticação robusta para gerenciamento de usuários.</Text>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>Async Storage:</Text> Armazenamento de dados persistente e local no dispositivo.</Text>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>Expo Router:</Text> Sistema de roteamento baseado em arquivos para navegação.</Text>
            <Text style={[styles.bulletItem, { color: theme.text }]}>• <Text style={styles.boldText}>@expo/vector-icons:</Text> Biblioteca de ícones para a interface.</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contexto do Projeto:</Text>
          <Text style={[styles.bodyText, { color: theme.text }]}>
            Este aplicativo foi concebido e desenvolvido como parte de um <Text style={styles.boldText}>Projeto de Extensão Universitária</Text>, visando aplicar conhecimentos práticos
            em desenvolvimento móvel e oferecer uma ferramenta útil para a comunidade.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Desenvolvimento:</Text>
          <Text style={[styles.bodyText, { color: theme.text }]}>
            [Seu Nome ou Nomes dos Membros da Equipe]
          </Text>

          <Text style={[styles.versionText, { color: theme.grayDark }]}>Versão 1.0.1</Text> {/* Usar uma cor cinza para texto de versão */}
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
    // color handled by theme
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
  spacer: {
    width: 28, // Largura do ícone de voltar para simetria
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    // color handled by theme (using buttonPrimaryBg for consistency)
    textAlign: 'center',
    marginBottom: 5,
  },
  versionText: {
    fontSize: 14,
    // color handled by theme (using grayDark)
    textAlign: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // color handled by theme
    marginTop: 25,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    // color handled by theme
    marginBottom: 10,
  },
  bulletList: {
    marginTop: 5,
    marginBottom: 10,
  },
  bulletItem: {
    fontSize: 16,
    lineHeight: 24,
    // color handled by theme
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  }
});