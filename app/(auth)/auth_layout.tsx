import {Redirect ,Stack} from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Header } from "react-native/Libraries/NewAppScreen";

export default function StackPage(){

    const{isSignedIn} = useAuth();
    
    return(
        <Stack>
            <Stack.Screen
                name="home"
                redirect={!isSignedIn}
            />
            <Stack.Screen
                name="profile"
                redirect={!isSignedIn}
            
            />
        </Stack>
    );
};