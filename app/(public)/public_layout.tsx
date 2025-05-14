import {Stack} from "expo-router";
import { Header } from "react-native/Libraries/NewAppScreen";

export default function PublicLayout(){
    return(
        <Stack>
            <Stack.Screen
                name="inicial"
                
            />
            <Stack.Screen
                name="login"
                
            />
            <Stack.Screen
                name="forgot"
                
            />
            <Stack.Screen
                name="register"
            
            />
        </Stack>

    )

}