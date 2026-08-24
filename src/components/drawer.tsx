import { DrawerContentScrollView, DrawerItemList } from "expo-router/drawer";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TelegramDrawer(props: any) {
  const insets = useSafeAreaInsets();
  const date = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        {/* <Text style={styles.nameText}>Welcome!</Text> */}
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: 0,
          paddingVertical: 0,
          paddingHorizontal: 0,
          margin: 0,
        }}
      >
        <View style={styles.listContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        ]}
      >
        <Text style={styles.footerTitle}>Final</Text>
        <Text style={styles.footerText}>{date} • Ver 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#7fa3c4",
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: 8,
  },
  listContainer: {
    paddingTop: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: "400",
    color: "#333",
  },
  footerText: {
    fontSize: 10,
    color: "#888",
  },
});
