import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type { RootStackParamList } from '../types/navigation';

import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerTitleAlign: 'center',
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Character Explorer',
      },
    },
    Detail: {
      screen: DetailScreen,
      options: {
        title: 'Character',
        headerBackTitle: 'Back',
      },
    },
  },
});

export const RootNavigator = createStaticNavigation(RootStack);
