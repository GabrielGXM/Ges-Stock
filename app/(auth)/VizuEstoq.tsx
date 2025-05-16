import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const MOCK_DATA = [
  { id: '1', nome: 'Produto A', quantidade: 10, preco: 'R$20,00' },
  { id: '2', nome: 'Produto B', quantidade: 5, preco: 'R$50,00' },
];

export default function VisualizarEstoque() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Estoque</Text>
      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Quantidade: {item.quantidade}</Text>
            <Text>Preço: {item.preco}</Text>
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
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
