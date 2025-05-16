import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function CadastroProduto() {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleSalvar = () => {
    // lógica para salvar no Supabase
    console.log({ nome, quantidade, preco, categoria });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Cadastrar Produto</Text>
      <TextInput placeholder="Nome do produto" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Quantidade" style={styles.input} keyboardType="numeric" value={quantidade} onChangeText={setQuantidade} />
      <TextInput placeholder="Preço" style={styles.input} keyboardType="numeric" value={preco} onChangeText={setPreco} />
      <TextInput placeholder="Categoria" style={styles.input} value={categoria} onChangeText={setCategoria} />
      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});