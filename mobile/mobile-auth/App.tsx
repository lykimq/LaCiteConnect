import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { LoginForm } from './components/LoginForm';

export default function App() {
  const handleLogin = (email: string, password: string) => {
    // TODO: Implement actual login logic here
    console.log('Login attempted with:', { email, password });
  };

  return (
    <View style={styles.container}>
      <LoginForm onLogin={handleLogin} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
