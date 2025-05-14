import {Redirect ,Stack} from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Header } from "react-native/Libraries/NewAppScreen";

export default function StackPage(){
    return(
        <Stack>
            <Stack.Screen
                name="home"
                
            />
            <Stack.Screen
                name="profile"
            
            />
        </Stack>
    );
};