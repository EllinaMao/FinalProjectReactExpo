import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
const HomeScreen = () => {
  ///- Список усіх записів (назва, дата, тривалість)
  // - Пошук за назвою і фільтр за категоріями
  // - Перейменування і видалення записів
  // кнопка перехода на вкладку с записью аудио
  //раскрытие вкладки с Плеєр для нотаток (старт, пауза, перемотка слайдером)
  //
  const router = useRouter();
  const openRecorder = () => {
    // вызов модалки с Плеєр для нотаток (старт, пауза, перемотка слайдером)
    router.push({
      pathname: "/recorder-modal",
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
