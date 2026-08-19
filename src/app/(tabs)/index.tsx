import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { dbManager } from "../../lib/db";
const HomeScreen = () => {
  ///- Список усіх записів (назва, дата, тривалість)
  // - Пошук за назвою і фільтр за категоріями
  // - Перейменування і видалення записів
  // кнопка перехода на вкладку с записью аудио
  //раскрытие вкладки с Плеєр для нотаток (старт, пауза, перемотка слайдером)
  //
  useEffect(() => {
    const initDb = async () => {
      try {
        await dbManager.init();
        console.log("Database initialized successfully");
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initDb();
  }, []);
  const router = useRouter();
  const openRecorder = () => {
    // вызов модалки с Плеєр для нотаток (старт, пауза, перемотка слайдером)
    router.push({
      pathname: "../recorder-modal",
    });
  };

  return (
    <View>
      <Text>This is homescreen temp icon</Text>
      <TouchableOpacity onPress={openRecorder}>
        <Text>Open recorder</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
