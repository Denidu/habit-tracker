import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";


export default function AuthScreen(){
    const [isSignUp, setIsSignUp] = useState(false);
    const [email,setEmail] = useState<string>("");
    const [password,setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const { signIn, signUp } = useAuth();
    const router = useRouter();

    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    };

    const handleAuth = async() => {
        if (!email || !password){
            setError("Email and Password are required");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        setError(null);

        if (isSignUp){
            const signUpError = await signUp(email, password);
            if (signUpError) {
                setError(signUpError);
            }
        }else{
            const signInError = await signIn(email, password);
            if (signInError) {
                setError(signInError);
            }
            router.replace("/");
        }
    }

    return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
     style={styles.container}>

        <View style={styles.content}>
            <Text style={styles.title} variant="headlineMedium"> {isSignUp ?"Create Account" : "Welcome Back"} </Text>

            <TextInput label="Email" autoCapitalize="none" keyboardType="email-address" placeholder="example@gmail.com" mode="outlined" style={styles.input} onChangeText={setEmail}/>

            <TextInput label="Password" secureTextEntry mode="outlined" style={styles.input} onChangeText={setPassword}/>

            {error && <Text style={{ color: theme.colors.error, textAlign: "center", marginBottom: 8 }}>{error}</Text>}

            <Button mode="contained" style={styles.button} onPress={handleAuth}>{isSignUp ? "Sign Up" : "Sign In"}</Button>

            <Button mode="text" onPress={handleSwitchMode} style={styles.switchModeButton}>{isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}</Button>

        </View>
    </KeyboardAvoidingView>
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#f5f5f5"
    },
    content:{
        flex:1,
        padding:16,
        justifyContent:"center",
        backgroundColor:"#f5f5f5"
    },
    title:{
        textAlign:"center",
        marginBottom:24,
    },
    input:{
        marginBottom:16,
    },
    button:{
        marginTop:8,
    },
    switchModeButton:{
        marginTop:16,
    },
})


