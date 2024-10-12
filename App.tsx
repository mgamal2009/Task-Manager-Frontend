import WelcomeScreen from "./src/screens/WelcomeScreen";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import {useEffect, useState} from "react";
import * as Font from "expo-font";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TaskScreen from "./src/screens/TaskScreen";
import * as SplashScreen from "expo-splash-screen";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();
export default function App() {
  const Stack = createNativeStackNavigator();

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'montserrat': require('./assets/fonts/Montserrat-Regular.ttf'),
      'montserrat-medium': require('./assets/fonts/Montserrat-Medium.ttf'),
      'montserrat-semiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
      'montserrat-bold': require('./assets/fonts/Montserrat-Bold.ttf')
    });
    setFontsLoaded(true);
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Task" component={TaskScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
