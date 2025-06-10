
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
// 1. IMPORTAÇÕES ATUALIZADAS
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { BarcodeFormat, scanBarcodes, type Barcode } from 'vision-camera-code-scanner';
import { runOnJS } from 'react-native-reanimated'; // <-- Importante
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Interface Produto (sem alterações)
interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  categoriaId: string;
  userId: string;
}

export default function ScanBarcodeScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  // 2. VAMOS GERENCIAR O ESTADO DOS BARCODES MANUALMENTE
  const [barcodes, setBarcodes] = useState<Barcode[]>([]);

  // 3. ESTA É A MUDANÇA PRINCIPAL: CRIAMOS O FRAME PROCESSOR DIRETAMENTE
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'; // Diretiva essencial do Reanimated
    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS]);
    // 'runOnJS' é necessário para atualizar o estado do React a partir da thread da UI
    runOnJS(setBarcodes)(detectedBarcodes);
  }, []); // O array de dependências vazio significa que o processador é criado uma vez

  // Pede permissão para a câmera (sem alterações)
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // A lógica agora depende do nosso estado 'barcodes'
  useEffect(() => {
    if (barcodes.length > 0 && isScanning) {
      const scannedValue = barcodes[0].displayValue;
      setIsScanning(false);
      
      console.log('Código detectado:', scannedValue);
      findProductByBarcode(scannedValue);
    }
  }, [barcodes]); // A dependência agora é o nosso estado

  // Função findProductByBarcode (sem alterações)
  const findProductByBarcode = async (barcode: string | undefined) => {
    if (!barcode || !userId) {
      Alert.alert('Erro', 'Código de barras inválido ou usuário não logado.');
      router.back();
      return;
    }
    
    try {
      const PRODUTOS_ASYNC_KEY = `user_${userId}_produtos`;
      const storedProducts = await AsyncStorage.getItem(PRODUTOS_ASYNC_KEY);
      const products: Produto[] = storedProducts ? JSON.parse(storedProducts) : [];
      
      const foundProduct = products.find(p => p.id === barcode);

      if (foundProduct) {
        Alert.alert('Produto Encontrado', foundProduct.nome);
        router.replace({
          pathname: '/(auth)/VizuEstoq',
          params: { openProductWithId: foundProduct.id },
        });
      } else {
        Alert.alert('Não Encontrado', 'Nenhum produto com este código foi encontrado.', [
            { text: 'Escanear Novamente', onPress: () => setIsScanning(true) }
        ]);
      }
    } catch (e) {
        Alert.alert('Erro', 'Ocorreu um erro ao buscar os produtos.');
        console.error("Erro ao buscar produto por código:", e);
        setIsScanning(true);
    }
  };

  // Renderização do componente (sem alterações na lógica, apenas no JSX da Câmera)
  if (!device) {
    return <View style={styles.container}><Text style={styles.infoText}>Câmera não disponível</Text></View>;
  }

  if (!hasPermission) {
      return (
          <View style={styles.container}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.infoText}>Aguardando permissão da câmera...</Text>
          </View>
      )
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        frameProcessor={frameProcessor} // A prop 'frameProcessor' agora recebe a variável criada com 'useFrameProcessor'
        fps={5}
      />
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.instructions}>Aponte a câmera para o código de barras</Text>
        <View style={styles.scanArea} />
        {!isScanning && <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator}/>}
      </View>
    </View>
  );
}

// Estilos (sem alterações)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
    infoText: { color: 'white', fontSize: 18, marginTop: 20 },
    overlay: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
    backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 5 },
    instructions: { color: 'white', fontSize: 20, position: 'absolute', top: '20%', backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 5, zIndex: 10, },
    scanArea: { width: '80%', height: '30%', borderWidth: 2, borderColor: 'white', borderRadius: 20, borderStyle: 'dashed' },
    loadingIndicator: { position: 'absolute' },
});