import { useQuery } from '@tanstack/react-query';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/lib/api';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await api.get('/health');
      return res.data as { status: string; services: { database: string } };
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="mb-4 text-3xl font-bold text-white">Carteira Pokémon TCG</Text>
        <Text className="mb-8 text-slate-400">MVP em construção</Text>

        {isLoading && <ActivityIndicator color="#3b82f6" />}

        {error && (
          <View className="rounded-lg bg-red-900/40 p-4">
            <Text className="text-red-200">
              Não foi possível conectar à API. Verifique se ela está rodando.
            </Text>
          </View>
        )}

        {data && (
          <View className="rounded-lg bg-slate-800 p-4">
            <Text className="mb-1 text-white">API: {data.status}</Text>
            <Text className="text-slate-400">DB: {data.services.database}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
