import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/clerk-expo";
import { supabase } from '../../utils/supabase';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Certifique-se de ter esta importação se for usar o botão de exclusão

export default function CadastroCategoria() {
  const { userId, isLoaded } = useAuth(); // userId é o ID do Clerk
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState<{ id: string; nome: string }[]>([]);
  const [loading, setLoading] = useState(true); // Estado para carregar categorias existentes
  const [addingCategory, setAddingCategory] = useState(false); // Estado para indicar que está adicionando nova categoria

  // Efeito para carregar as categorias existentes do usuário ao montar o componente
  const fetchCategorias = useCallback(async () => {
    console.log("fetchCategorias: Tentando carregar categorias para userId:", userId);
    if (!userId) {
      console.log("fetchCategorias: userId é nulo, não buscando categorias.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nome')
      .eq('user_id', userId);

    if (error) {
      console.error("Erro ao carregar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    } else if (data) {
      setCategorias(data);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchCategorias();
    } else if (isLoaded && !userId) {
      setLoading(false);
      Alert.alert("Erro de Autenticação", "Você precisa estar logado para gerenciar categorias.");
      // Opcional: Aqui você pode adicionar um router.replace('/(public)/login'); para redirecionar
    }
  }, [isLoaded, userId, fetchCategorias]);

  const adicionarCategoria = async () => {
    console.log("adicionarCategoria: Iniciando...");
    console.log("adicionarCategoria: userId do Clerk no momento do clique:", userId);
    console.log("adicionarCategoria: isLoaded do Clerk no momento do clique:", isLoaded);

    if (addingCategory) return;
    if (!categoria.trim()) {
      Alert.alert("Erro", "Por favor, digite o nome da categoria.");
      return;
    }
    if (!isLoaded || !userId) { // Garante que o Clerk carregou e o usuário está logado
      Alert.alert("Erro de Autenticação", "Usuário não autenticado ou carregamento pendente. Tente novamente.");
      return;
    }

    setAddingCategory(true);

    // --- CÓDIGO DE DEBUG: Inserir na tabela public.debug_auth ---
    console.log("DEBUG TEST: Tentando inserir em public.debug_auth...");
    try {
      const { data: debugInsertData, error: debugInsertError } = await supabase
        .from('debug_auth')
        .insert([
          {
            clerk_user_id: userId, // O ID do usuário do Clerk (STRING)
            supabase_auth_uid: (await supabase.auth.getSession()).data.session?.user?.id // O que auth.uid() retorna (UUID)
          }
        ]);

      if (debugInsertError) {
        console.error("DEBUG TEST: Erro ao inserir em public.debug_auth:", debugInsertError.message);
        Alert.alert("Erro Debug", `Não foi possível inserir na tabela de depuração: ${debugInsertError.message}`);
        setAddingCategory(false);
        return; // Pare aqui para ver o erro de debug
      } else {
        console.log("DEBUG TEST: Inserção em public.debug_auth SUCESSO!");
        // console.log("DEBUG TEST: Dados inseridos:", debugInsertData); // Para ver o retorno se necessário
      }
    } catch (e: any) {
      console.error("DEBUG TEST: Exceção ao tentar inserir em debug_auth:", e.message);
      Alert.alert("Erro Debug", `Erro inesperado ao depurar: ${e.message}`);
      setAddingCategory(false);
      return;
    }
    // --- FIM DO CÓDIGO DE DEBUG ---


    // --- CÓDIGO ORIGINAL: Inserir na tabela 'categorias' ---
    const { data, error } = await supabase
      .from('categorias')
      .insert([{ nome: categoria, user_id: userId }]) // user_id (UUID) esperado aqui
      .select('id, nome');

    setAddingCategory(false);

    if (error) {
      console.error("Erro ao inserir categoria:", error);
      if (error.code === '23505') { // Exemplo de tratamento para UNIQUE constraint violation
        Alert.alert("Erro", "Essa categoria já existe para o seu usuário.");
      } else if (error.message.includes("row-level security policy")) {
        Alert.alert("Erro de Permissão", "Você não tem permissão para adicionar esta categoria. (RLS Falhou)");
      } else {
        Alert.alert("Erro", `Não foi possível adicionar a categoria: ${error.message}`);
      }
      return;
    }

    if (data && data.length > 0) {
      setCategorias([...categorias, data[0]]);
      setCategoria('');
      Alert.alert("Sucesso", "Categoria adicionada!");
    }
  };

  // Função para deletar categoria (opcional, mas útil para gerenciar)
  const deletarCategoria = async (id: string, nome: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a categoria "${nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            const { error } = await supabase
              .from('categorias')
              .delete()
              .eq('id', id)
              .eq('user_id', userId); // Garante que só o usuário possa deletar suas categorias

            if (error) {
              console.error("Erro ao deletar categoria:", error);
              Alert.alert("Erro", "Não foi possível excluir a categoria.");
            } else {
              setCategorias(categorias.filter(cat => cat.id !== id));
              Alert.alert("Sucesso", "Categoria excluída!");
            }
          },
        },
      ]
    );
  };


  if (loading && (!isLoaded || !userId)) { // Condição de carregamento mais robusta
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38a69d" />
        <Text>Carregando categorias...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cadastrar Categoria</Text>
      <TextInput
        placeholder="Nome da categoria"
        style={styles.input}
        value={categoria}
        onChangeText={setCategoria}
      />
      <TouchableOpacity style={[styles.button, addingCategory && styles.buttonDisabled]} onPress={adicionarCategoria} disabled={addingCategory}>
        {addingCategory ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Adicionar</Text>
        )}
      </TouchableOpacity>
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id} // Usar o ID da categoria como key
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.nome}</Text>
            {/* Botão de exclusão (opcional) */}
            <TouchableOpacity onPress={() => deletarCategoria(item.id, item.nome)}>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>Nenhuma categoria cadastrada ainda.</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f8f8f8', // Cor de fundo mais suave
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1, // Borda para melhor visualização
    borderColor: '#ccc',
    borderRadius: 8,
    height: 50, // Altura maior para o input
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#38a69d',
    padding: 15, // Padding maior
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0', // Cor para botão desabilitado
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15, // Padding maior
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee', // Borda mais suave
    marginBottom: 10,
    flexDirection: 'row', // Para alinhar texto e botão de exclusão
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
    color: '#777',
  }
});
