import { DrawerContentScrollView, DrawerItemList } from "expo-router/drawer";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TelegramDrawer(props: any) {
  const insets = useSafeAreaInsets();
  const date = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Image
          style={styles.avatar}
          source={require("../../assets/images/image.png")}
        />
        <Text style={styles.nameText}>Its me, Mario!</Text>
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
        <Text style={styles.footerTitle}>Homework Films</Text>
        <Text style={styles.footerText}>{date} • Ver 1.2.0</Text>
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  listContainer: {
    paddingTop: 8,
  },
  footer: {
    paddingTop: 16,
    alignItems: "center",
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: "400",
    color: "#333",
  },
  footerText: {
    fontSize: 8,
    color: "#888",
    marginTop: 4,
  },
});
