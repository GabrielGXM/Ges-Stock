import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function CadastroCategoria() {
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);

  const adicionarCategoria = () => {
    if (categoria) {
      setCategorias([...categorias, categoria]);
      setCategoria('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cadastrar Categoria</Text>
      <TextInput
        placeholder="Nome da categoria"
        style={styles.input}
        value={categoria}
        onChangeText={setCategoria}
      />
      <TouchableOpacity style={styles.button} onPress={adicionarCategoria}>
        <Text style={styles.buttonText}>Adicionar</Text>
      </TouchableOpacity>
      <FlatList
        data={categorias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#38a69d',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
});
