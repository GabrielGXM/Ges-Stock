import { Modal, Alert } from 'react-native'; // Adicionar Alert
import { supabase } from '../../utils/supabase';
import React, { useState, useEffect, useCallback } from 'react'; // Adicionar useCallback
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'; // Adicionar ActivityIndicator
import { useAuth } from "@clerk/clerk-expo";

// Tipagem para a categoria
interface Categoria {
  id: string;
  nome: string;
}

export default function CadastroProduto() {
  const { userId, isLoaded } = useAuth();
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null); // Armazena o objeto categoria
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false); // Estado para o salvamento do produto

  const fetchCategorias = useCallback(async () => {
    if (!userId) return;
    setLoadingCategorias(true);
    const { data, error } = await supabase
      .from('categorias')
      .select('id, nome') // Selecionar id e nome
      .eq('user_id', userId);

    if (error) {
      console.error("Erro ao carregar categorias:", error);
      Alert.alert("Erro", "Não foi possível carregar as categorias disponíveis.");
    } else if (data) {
      setCategoriasDisponiveis(data);
    }
    setLoadingCategorias(false);
  }, [userId]);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchCategorias();
    }
  }, [isLoaded, userId, fetchCategorias]);

  const handleSalvar = async () => {
    if (savingProduct) return; // Evita cliques múltiplos

    if (!nome.trim() || !quantidade.trim() || !preco.trim() || !selectedCategoria || !userId) {
      Alert.alert("Preencha todos os campos", "Por favor, preencha todos os dados do produto e selecione uma categoria.");
      return;
    }

    const parsedQuantidade = parseInt(quantidade);
    const parsedPreco = parseFloat(preco.replace(',', '.')); // Troca vírgula por ponto para parsear corretamente

    if (isNaN(parsedQuantidade) || parsedQuantidade <= 0) {
      Alert.alert("Quantidade inválida", "Por favor, insira uma quantidade numérica e positiva.");
      return;
    }

    if (isNaN(parsedPreco) || parsedPreco <= 0) {
      Alert.alert("Preço inválido", "Por favor, insira um preço numérico e positivo.");
      return;
    }

    setSavingProduct(true);

    const { error } = await supabase.from('produtos').insert([{
      nome,
      quantidade: parsedQuantidade,
      preco: parsedPreco,
      categoria_id: selectedCategoria.id, // Já temos o ID da categoria
      user_id: userId
    }]);

    setSavingProduct(false);

    if (error) {
      console.error("Erro ao inserir produto:", error);
      Alert.alert("Erro ao Salvar", `Não foi possível salvar o produto: ${error.message}`);
    } else {
      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      setNome('');
      setQuantidade('');
      setPreco('');
      setSelectedCategoria(null); // Limpa a categoria selecionada
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cadastrar Produto</Text>
      <TextInput
        placeholder="Nome do produto"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        placeholder="Quantidade"
        style={styles.input}
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />
      <TextInput
        placeholder="Preço"
        style={styles.input}
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
      />

      {loadingCategorias ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#38a69d" />
          <Text style={{ marginLeft: 10 }}>Carregando categorias...</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputSelect}>
          <Text style={selectedCategoria ? styles.selectedText : styles.placeholderText}>
            {selectedCategoria ? selectedCategoria.nome : 'Selecionar categoria'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, savingProduct && styles.buttonDisabled]}
        onPress={handleSalvar}
        disabled={savingProduct}
      >
        {savingProduct ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar</Text>
        )}
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione uma Categoria</Text>
            {categoriasDisponiveis.length === 0 ? (
              <Text style={styles.emptyCategoriesText}>Nenhuma categoria disponível. Cadastre uma categoria primeiro.</Text>
            ) : (
              <ScrollView>
                {categoriasDisponiveis.map((cat) => (
                  <TouchableOpacity
                    key={cat.id} // Usar o ID da categoria
                    onPress={() => {
                      setSelectedCategoria(cat);
                      setModalVisible(false);
                    }}
                    style={styles.modalItem}
                  >
                    <Text>{cat.nome}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flexGrow: 1, // Para permitir o ScrollView funcionar corretamente
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputSelect: { // Estilo para o TouchableOpacity que simula um input de seleção
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  selectedText: {
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#38a69d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '85%', // Mais largo
    maxHeight: '70%', // Altura máxima para o scroll
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyCategoriesText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#777',
    fontStyle: 'italic',
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  }
});