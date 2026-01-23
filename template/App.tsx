import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import './global.css';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
// import '@/global.css';

export default function App() {
  return (
    
    <GluestackUIProvider mode="dark">
       <Box className="flex-1 items-center justify-center bg-black">
        <Text className="text-red-500 text-2xl font-bold">
          Home
        </Text>
        <StatusBar style="light" />
      </Box>
    </GluestackUIProvider>
  
  );
}
