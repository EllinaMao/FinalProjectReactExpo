import { CategoryDropdown } from "@/components/category-dropdown";
import { RecordList } from "@/components/record-list";
import { Category, dbManager, Record } from "@/lib/db";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const RecordsScreen = () => {
  const router = useRouter();

  const [records, setRecords] = useState<Record[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set(),
  );

  const loadData = async () => {
    try {
      await dbManager.init();
      const recordsData = await dbManager.getAllRecords();
      const categoriesData = await dbManager.getAllCategories();

      setRecords(recordsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Ошибка", "Не удалось загрузить данные.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryIds.length > 0
        ? record.categories?.some((cat) => selectedCategoryIds.includes(cat.id))
        : true;

    return matchesSearch && matchesCategory;
  });

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedRecords(new Set());
  };

  const handleToggleSelection = (id: string) => {
    const nextSelection = new Set(selectedRecords);
    if (nextSelection.has(id)) {
      nextSelection.delete(id);
    } else {
      nextSelection.add(id);
    }
    setSelectedRecords(nextSelection);
  };

  const handleDeleteSelected = async () => {
    Alert.alert("Подтверждение удаления", "Подумайте еще раз! Вы уверенны?", [
      {
        text: "Отмена",
        style: "cancel",
      },
      {
        text: "Удалить",
        style: "destructive",
        onPress: async () => {
          for (const id of selectedRecords) {
            await dbManager.deleteRecord(id);
          }
          setSelectedRecords(new Set());
          setIsSelectionMode(false);
          loadData();
        },
      },
    ]);
  };

  const openRecorder = () => {
    router.push({ pathname: "../recorder-modal" });
  };

  return (
    <View style={styles.container}>
      <View style={searchStyles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="#9ca3af"
          style={searchStyles.searchIcon}
        />
        <TextInput
          style={searchStyles.searchInput}
          placeholder="Поиск..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
      <View style={searchStyles.dropdownCustomStyle}>
        <CategoryDropdown
          categories={categories}
          selectedCategoryIds={selectedCategoryIds}
          onSelect={setSelectedCategoryIds}
          customStyle={searchStyles.insideDropdown}
        />
      </View>
      <View style={styles.listContainer}>
        <RecordList
          records={filteredRecords}
          isSelectionMode={isSelectionMode}
          selectedRecords={selectedRecords}
          onToggleSelection={handleToggleSelection}
        />
      </View>

      <View style={styles.buttonContainer}>
        {isSelectionMode && selectedRecords.size > 0 && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleDeleteSelected}
          >
            <Feather name="trash-2" style={styles.icon} />
          </TouchableOpacity>
        )}
        {!isSelectionMode && (
          <TouchableOpacity style={styles.button} onPress={openRecorder}>
            <Feather name="mic" style={styles.icon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={toggleSelectionMode}>
          {isSelectionMode ? (
            <Feather name="x" style={styles.checkIcon} />
          ) : (
            <Feather name="check-square" style={styles.checkIcon} />
          )}
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 24,
    paddingTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "red",
    fontSize: 30,
  },
  checkIcon: {
    color: "#ccc",
    fontSize: 25,
  },
});

const searchStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    // marginBottom: ,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    paddingVertical: 0,
  },
  dropdownCustomStyle: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 12,
  },
  insideDropdown: {
    borderWidth: 0,
  },
});

export default RecordsScreen;
