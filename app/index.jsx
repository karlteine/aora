import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
    <Text className="text-3xl text-red-400">Aora</Text>
    <StatusBar style="auto" />
    <Link className="font-pblack" href="/home">
      Go To Home
    </Link>
    </View>
  );
}