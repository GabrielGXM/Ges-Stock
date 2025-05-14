import React from 'react';
import {useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,TextInput } from 'react-native';
import {useSignIn} from '@clerk/clerk-expo';
import {Link} from 'expo-router';
import * as Animatable from 'react-native-animatable'

export default function Login(){

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");   

    function handleSignIn (){

    } 

    return(
        
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Bem Vindo(a)</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>

                <Text style={styles.title}>Email</Text>
                <TextInput
                    autoCapitalize='none'
                    placeholder="Digite seu email:"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                    autoCapitalize='none'
                    placeholder="Digite sua senha:"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    
                />
            <Link href={"/(public)/forgot"} asChild>
                <TouchableOpacity style={styles.buttonForget}>
                    <Text >Esqueci minha senha</Text>
                </TouchableOpacity>
            </Link>
            
                <TouchableOpacity
                style={styles.button}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            
            <Link href={'/(public)/register'} asChild>
                <TouchableOpacity style={styles.buttonRegister} onPress={handleSignIn}>
                    <Text style={styles.registerText}>Não possui conta? Cadastre-se!</Text>
                </TouchableOpacity>
            </Link>

            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#38a69d',
    },
    containerHeader:{
        marginTop:14,
        marginBottom:'8%',
        paddingStart:'5%', 
    },
    message:{
        fontSize:28,
        fontWeight:'bold',
        color: '#FFF',
    },
    containerForm:{
        backgroundColor:'#FFF',
        flex:1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart:'5%',
        paddingEnd:'5%'
    },
    title:{
        fontSize:20,
        marginTop:28,
    },
    input:{
        borderBottomWidth:1,
        height:40,
        marginBottom:12,
        fontSize:16,
    },
    buttonForget:{
        fontWeight:'bold',
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        backgroundColor:'#38a69d',
        width:'100%',
        borderRadius:15,
        paddingVertical:2,
        marginTop:14,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
        color:'#FFF',
        fontSize:18,
        fontWeight:'bold'
    },
    buttonRegister:{
        marginTop:14,
        alignSelf:'center'
    },
    registerText:{
        color:'a1a1a1'
    }
})