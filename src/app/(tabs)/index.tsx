import { RecordList } from "@/components/record-list";
import { dbManager, Record } from "@/lib/db";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
  const router = useRouter();
  
  const [records, setRecords] = useState<Record[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

  const loadRecords = async () => {
    try {
      await dbManager.init();
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
    for (const id of selectedRecords) {
      await dbManager.deleteRecord(id);
    }
    setSelectedRecords(new Set());
    setIsSelectionMode(false);
    loadRecords();
  };

  const openRecorder = () => {
    router.push({
      pathname: "../recorder-modal",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.selectModeButton} onPress={toggleSelectionMode}>
          <Text style={styles.selectModeButtonText}>
            {isSelectionMode ? "Отмена" : "Выбрать"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <RecordList 
          records={records} 
          isSelectionMode={isSelectionMode}
          selectedRecords={selectedRecords}
          onToggleSelection={handleToggleSelection}
        />
      </View>

      {isSelectionMode && selectedRecords.size > 0 && (
        <TouchableOpacity style={styles.deleteFloatingButton} onPress={handleDeleteSelected}>
          <Text style={styles.buttonText}>Удалить выбранные ({selectedRecords.size})</Text>
        </TouchableOpacity>
      )}
      
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  selectModeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  selectModeButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
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
  deleteFloatingButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;