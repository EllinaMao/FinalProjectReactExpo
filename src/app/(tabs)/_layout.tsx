import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TelegramDrawer from "../../components/drawer";

const TabLayout = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={(props) => <TelegramDrawer {...props} />}
          screenOptions={{
            swipeEnabled: true,
            swipeEdgeWidth: 100,
            headerShown: true,
            headerStyle: {
              backgroundColor: "#7fa3c4",
              shadowColor: "transparent",
              elevation: 0,
            },
            headerTintColor: "#ffffff",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
            },
            drawerStyle: {
              width: "70%",
              // borderWidth: 0,
              borderRadius: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              padding: 0,
              margin: 0,
            },
            drawerActiveTintColor: "#7fa3c4",
            drawerActiveBackgroundColor: "#ffffff",
            drawerLabelStyle: {
              color: "#000000",
            },
            drawerItemStyle: {
              borderRadius: 0,
              margin: 0,
            },
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: "Index",
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="home" size={size} color={color} />
              ),
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default TabLayout;
