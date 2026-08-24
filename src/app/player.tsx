import { PlayerUI } from "@/components/player-sceen";
import { Category, dbManager, Record } from "@/lib/db";
import AntDesign from "@expo/vector-icons/AntDesign";
import { setAudioModeAsync } from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [record, setRecord] = useState<Record | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [recordData, categoriesData] = await Promise.all([
          dbManager.getRecordById(id),
          dbManager.getAllCategories(),
        ]);

        setRecord(recordData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        Alert.alert(
          "Ошибка",
          "Не удалось загрузить данные. Пожалуйста, попробуйте снова.",
        );
      } finally {
        setIsLoading(false);
        setIsCategoriesLoading(false);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (e) {
        console.error("Ошибка при настройке аудио-режима:", e);
        Alert.alert(
          "Ошибка",
          "Не удалось настроить аудио-режим. Пожалуйста, попробуйте снова.",
        );
      }
    };
    setupAudio();
  }, []);

  if (isLoading || isCategoriesLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const handleEdit = async (newTitle: string, newCategoryIds: string[]) => {
    if (record) {
      try {
        await dbManager.updateRecord(record.id, newTitle, newCategoryIds);
        setRecord({
          ...record,
          title: newTitle,
          categories: categories.filter((cat) =>
            newCategoryIds.includes(cat.id),
          ),
        });
      } catch (error) {
        console.error("Ошибка при обновлении в БД:", error);
        Alert.alert("Ошибка", "Не удалось обновить запись.");
      }
    }
  };

  const handleDelete = async () => {
    if (record) {
      try {
        await dbManager.deleteRecord(record.id);
        router.back();
      } catch (error) {
        console.error("Ошибка при удалении записи из БД:", error);
        Alert.alert(
          "Ошибка",
          "Не удалось удалить запись. Пожалуйста, попробуйте снова.",
        );
      }
    }
  };
  if (!record || !record.audioFilePath) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Файл не найден</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <AntDesign name="rollback" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <PlayerUI
      record={record}
      categories={categories}
      router={router}
      onHandleEdit={handleEdit}
      onHandleDelete={handleDelete}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#ef4444",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#1f2937",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 15,
    height: 40,
  },
  timeText: {
    fontSize: 14,
    color: "#6b7280",
    fontVariant: ["tabular-nums"],
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 80,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "600",
  },
});
