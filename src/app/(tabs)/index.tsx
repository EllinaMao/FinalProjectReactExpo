import { RecordList } from "@/components/record-list";
import { dbManager, Record } from "@/lib/db";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

//написать партиал загрузку тут и в дб тоже
  ///- Список усіх записів (назва, дата, тривалість)
  // - Пошук за назвою і фільтр за категоріями
  // - Перейменування і видалення записів
  // кнопка перехода на вкладку с записью аудио
  //раскрытие вкладки с Плеєр для нотаток (старт, пауза, перемотка слайдером)
  
const HomeScreen = () => {
  const router = useRouter();
  
  const [records, setRecords] = useState<Record[]>([]);

  const loadRecords = async () => {
    try {
      const data = await dbManager.getAllRecords(); 
      setRecords(data);
    } catch (error) {
      console.error("Error loading records:", error);
    }
  };

  useEffect(() => {
    const initDb = async () => {
      try {
        await dbManager.init();
        console.log("Database initialized successfully");
        await loadRecords();
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initDb();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

 

  const openRecorder = () => {
    router.push({
      pathname: "../recorder-modal",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <RecordList records={records} />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={openRecorder}>
        <Text style={styles.buttonText}>Open recorder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContainer: {
    flex: 1, 
    width: "100%",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;