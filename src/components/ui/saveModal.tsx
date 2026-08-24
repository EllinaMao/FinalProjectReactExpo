import { CategoryDropdown } from "@/components/category-dropdown";
import { Category } from "@/lib/db";
import Feather from "@expo/vector-icons/Feather";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SaveRecordModalProps {
  visible: boolean;
  title: string;
  categoryIds: string[];
  categories: Category[];
  onTitleChange: (text: string) => void;
  onCategoryChange: (ids: string[]) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const SaveRecordModal = ({
  visible,
  title,
  categoryIds,
  categories,
  onTitleChange,
  onCategoryChange,
  onCancel,
  onSave,
}: SaveRecordModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogContent}>
          <Text style={styles.dialogTitle}>Сохранение записи</Text>

          <TextInput
            style={styles.dialogInput}
            value={title}
            onChangeText={onTitleChange}
            selectTextOnFocus={true}
            autoFocus={true}
            placeholder="Введите название..."
            placeholderTextColor="#9ca3af"
          />

          <CategoryDropdown
            categories={categories}
            selectedCategoryIds={categoryIds}
            onSelect={onCategoryChange}
            customStyle={styles.dropdown}
          />

          <View style={styles.dialogButtons}>
            <TouchableOpacity style={styles.dialogButton} onPress={onCancel}>
              <Feather name="x" size={26} color="#ef4444" />
            </TouchableOpacity>

            <View style={styles.dialogSeparator} />

            <TouchableOpacity style={styles.dialogButton} onPress={onSave}>
              <Feather name="save" size={24} color="#51d645" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialogContent: {
    width: "85%",
    borderRadius: 24,
    padding: 24,
    backgroundColor: "#f1f1f1",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  dialogInput: {
    color: "#111827",
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    marginBottom: 24,
    textAlign: "center",
  },
  dialogButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dialogButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  dialogSeparator: {
    width: 1,
    height: 30,
    backgroundColor: "#e5e7eb",
  },
  dropdown: {
    backgroundColor: "#f3f4f6",
    borderWidth: 0,
    marginBottom: 24,
  },
});
