import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
