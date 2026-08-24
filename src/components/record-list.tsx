import { Record } from "@/lib/db";
import { FlatList, StyleSheet, Text } from "react-native";
import AudioListItem from "./audio-list-item";

interface RecordListProps {
  records: Record[];
  isSelectionMode: boolean;
  selectedRecords: Set<string>;
  onToggleSelection: (id: string) => void;
}

export const RecordList = ({
  records,
  isSelectionMode,
  selectedRecords,
  onToggleSelection,
}: RecordListProps) => {
  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AudioListItem
          item={item}
          isSelectionMode={isSelectionMode}
          isSelected={selectedRecords.has(item.id)}
          onToggle={onToggleSelection}
        />
      )}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Список записей пуст.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
    fontSize: 16,
  },
});
