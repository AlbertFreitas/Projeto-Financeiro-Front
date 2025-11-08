import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthState } from "../types/auth";
import { signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut} from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";


interface AuthContextProps {
    authState: AuthState;
    signWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
const [authState, setAuthState] = useState<AuthState>({
        user: null,
        error: null,
        // marcar como loading até que o onAuthStateChanged retorne o estado real
        loading: true
    });

 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                setAuthState({
                    user: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    error: null,
                    loading: false
                });
            } else {
                setAuthState({
                    user: null,
                    error: null,
                    loading: false
                });
            }
        }, (error) => {
            console.error("Auth state change error:");
            setAuthState({
                user: null,
                error: error.message,
                loading: false
            });
        }
    
    );

        return () => unsubscribe();

    }, []);

    const signWithGoogle = async (): Promise<void> => {
        setAuthState((prevState) => ({ ...prevState, loading: true }));

        try {
            await signInWithPopup(firebaseAuth, googleAuthProvider);
        } catch (error) {
            
            const message = error instanceof Error ? error.message : 'erro ao tentar logar';

            setAuthState((prevState) => ({
                ...prevState, loading: false, 
                error: message
            }));
        }
    };

    const signOut = async (): Promise<void> => {

        setAuthState((prevState) => ({ ...prevState, loading: true }));

        try {
            await firebaseSignOut(firebaseAuth);
        } catch (error) {

            const message = error instanceof Error ? error.message : 'erro ao tentar deslogar';

            setAuthState((prevState) => ({
                ...prevState, loading: false, 
                error: message
            }));
        }
    };

    return (
        <AuthContext.Provider value={{ authState, signWithGoogle, signOut }}>{children}</AuthContext.Provider>
    );

}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}