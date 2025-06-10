
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/clerk-expo";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, SafeAreaView, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useTheme } from '../../utils/context/themedContext'; // <-- IMPORTAR useTheme AQUI


// Converte um número inteiro (centavos) para uma string de moeda formatada ($X.XX)
// (Estas funções não são estritamente necessárias aqui se não houver campo de preço, mas mantidas por consistência)
const formatCentsToCurrency = (cents: number): string => {
  if (isNaN(cents) || cents < 0) {
    return "$0.00";
  }
  const actualCents = Math.round(Math.max(0, cents));
  const str = String(actualCents).padStart(3, '0');
  const integerPart = str.slice(0, -2);
  const decimalPart = str.slice(-2);
  return `$${integerPart}.${decimalPart}`;
};

// Converte uma string de input (com ou sem símbolos, letras, etc.) para um número inteiro (centavos)
const parseCurrencyInputToCents = (text: string): number => {
  const cleanText = text.replace(/[^0-9]/g, '');
  if (!cleanText) {
    return 0;
  }
  return parseInt(cleanText, 10);
};

// Tipagem para a categoria (para Async Storage)
interface Categoria {
  id: string;
  nome: string;
  userId: string; // Para associar a categoria ao usuário
}

export default function CadastroCategoria() {
  const { userId, isLoaded } = useAuth(); // userId é o ID do Clerk
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);

  const { theme } = useTheme(); // <-- CHAMAR O HOOK useTheme AQUI!

  // Chave para AsyncStorage (única por usuário)
  const CATEGORIAS_KEY = `user_${userId}_categorias`;

  // Função para carregar categorias do Async Storage
  const loadCategorias = useCallback(async () => {
    if (!userId) { // Garante que userId está disponível
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const storedCategorias = await AsyncStorage.getItem(CATEGORIAS_KEY);
      if (storedCategorias) {
        setCategorias(JSON.parse(storedCategorias));
      }
    } catch (e) {
      console.error("Erro ao carregar categorias do Async Storage:", e);
      Alert.alert("Erro", "Não foi possível carregar as categorias salvas.");
    } finally {
      setLoading(false);
    }
  }, [userId, CATEGORIAS_KEY]);

  useEffect(() => {
    if (isLoaded && userId) {
      loadCategorias();
    } else if (isLoaded && !userId) {
      setLoading(false);
      Alert.alert("Erro de Autenticação", "Você precisa estar logado para gerenciar categorias.");
    }
  }, [isLoaded, userId, loadCategorias]);

  const adicionarCategoria = async () => {
    if (!categoria.trim()) {
      Alert.alert("Erro", "Por favor, digite o nome da categoria.");
      return;
    }
    if (!userId) {
      Alert.alert("Erro", "Usuário não identificado. Tente novamente.");
      return;
    }

    setAddingCategory(true);
    try {
      const newCategoria: Categoria = {
        id: Date.now().toString(),
        nome: categoria.trim(),
        userId: userId, // Associar ao userId do Clerk
      };

      const updatedCategorias = [...categorias, newCategoria];
      await AsyncStorage.setItem(CATEGORIAS_KEY, JSON.stringify(updatedCategorias));
      setCategorias(updatedCategorias);
      setCategoria('');
      Alert.alert("Sucesso", "Categoria adicionada!");
    } catch (e) {
      console.error("Erro ao adicionar categoria no Async Storage:", e);
      Alert.alert("Erro", "Não foi possível adicionar a categoria.");
    } finally {
      setAddingCategory(false);
    }
  };

  const deletarCategoria = async (id: string, nome: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a categoria "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const updatedCategorias = categorias.filter(cat => cat.id !== id);
              await AsyncStorage.setItem(CATEGORIAS_KEY, JSON.stringify(updatedCategorias));
              setCategorias(updatedCategorias);
              Alert.alert("Sucesso", "Categoria excluída!");
            } catch (e) {
              console.error("Erro ao deletar categoria do Async Storage:", e);
              Alert.alert("Erro", "Não foi possível excluir a categoria.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}> {/* Cor de fundo do loading */}
        <ActivityIndicator size="large" color={theme.text} /> {/* Cor do indicador */}
        <Text style={[styles.loadingText, { color: theme.text }]}>Carregando categorias...</Text> {/* Cor do texto */}
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> {/* Cor de fundo principal */}
      {/* Remover ScrollView e usar FlatList como scroll principal, com ListHeaderComponent */}
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}> {/* Cores do card */}
            <Text style={{ color: theme.text }}>{item.nome}</Text> {/* Cor do texto */}
            <TouchableOpacity onPress={() => deletarCategoria(item.id, item.nome)}>
              <MaterialIcons name="delete" size={24} color={theme.red} /> {/* Cor do ícone (vermelho) */}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={[styles.emptyListText, { color: theme.text }]}>Nenhuma categoria cadastrada ainda.</Text>
        )}
        // ListHeaderComponent conterá o título, input e botão
        ListHeaderComponent={() => (
          <View style={styles.listHeaderContainer}>
            <Text
              style={[
                styles.headerText,
                { paddingTop: (Constants.statusBarHeight || 0) + 10, color: theme.text } // Cor do texto do header
              ]}
            >
              Cadastrar Categoria
            </Text>
            <TextInput
              placeholder="Nome da categoria"
              style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder, color: theme.inputText }]} // Cores do input
              placeholderTextColor={theme.text === '#FFFFFF' ? '#aaa' : '#999'} // Cor do placeholder
              value={categoria}
              onChangeText={setCategoria}
            />
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.buttonPrimaryBg }, addingCategory && styles.buttonDisabled]} onPress={adicionarCategoria} disabled={addingCategory}>
              {addingCategory ? (
                <ActivityIndicator color={theme.buttonPrimaryText} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.buttonPrimaryText }]}>Adicionar</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.flatListContentContainer} // Estilo para o conteúdo da FlatList
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor handled by theme
  },
  flatListContentContainer: { // Novo estilo para o contentContainerStyle da FlatList
    paddingHorizontal: 20, // Mantém o padding horizontal
    paddingBottom: 20, // Mantém o padding inferior
    flexGrow: 1, // Permite que a lista ocupe todo o espaço disponível
  },
  listHeaderContainer: { // NOVO estilo para o container do cabeçalho da lista
    marginBottom: 20, // Espaço entre o cabeçalho e a lista de produtos
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    // color handled by theme
    textAlign: 'center',
  },
  loadingText: {
  marginTop: 10,
  fontSize: 16,
  color: '#555', // Esta cor deve ser substituída por theme.text ao aplicar o tema
},
  input: {
    borderWidth: 1,
    // borderColor handled by theme
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    // backgroundColor handled by theme
    // color handled by theme
  },
  button: {
    // backgroundColor handled by theme
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000', // Sombra geralmente preta/cinza escuro
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    // color handled by theme (via conditional inline style)
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    // backgroundColor handled by theme
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor handled by theme
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    // color handled by theme
    fontStyle: 'italic',
  },
  closeModalButton: {
    marginTop: 20,
    // backgroundColor handled by theme
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#333', // Cor do texto do botão (pode ser theme.buttonSecondaryText)
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    // backgroundColor handled by theme
  }
});