import { CategoryDropdown } from "@/components/category-dropdown";
import { Category } from "@/lib/db";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditModalProps {
  visible: boolean;
  initialTitle: string;
  categoryIds: string[];
  categories: Category[];
  onClose: () => void;
  onSave: (newTitle: string, newCategoryIds: string[]) => void;
}

export const EditModal = ({
  visible,
  initialTitle,
  categoryIds,
  categories,
  onClose,
  onSave,
}: EditModalProps) => {
  const [editTitle, setEditTitle] = useState(initialTitle);
  const [editCategoryIds, setEditCategoryIds] = useState<string[]>(categoryIds);

  useEffect(() => {
    if (visible) {
      setEditTitle(initialTitle);
      setEditCategoryIds(categoryIds);
    }
  }, [visible, initialTitle, categoryIds]);

  const handleSave = () => {
    onSave(editTitle, editCategoryIds);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.dialogOverlay}>
        <View style={styles.dialogContent}>
          <Text style={styles.dialogTitle}>Переименовать запись</Text>

          <TextInput
            style={styles.dialogInput}
            value={editTitle}
            onChangeText={setEditTitle}
            selectTextOnFocus={true}
            autoFocus={true}
          />
          <CategoryDropdown
            categories={categories}
            selectedCategoryIds={editCategoryIds}
            onSelect={setEditCategoryIds}
            customStyle={styles.dropdown}
          />
          <View style={styles.dialogButtons}>
            <TouchableOpacity style={styles.dialogButton} onPress={onClose}>
              <Text style={styles.dialogCancelText}>Отмена</Text>
            </TouchableOpacity>

            <View style={styles.dialogSeparator} />

            <TouchableOpacity style={styles.dialogButton} onPress={handleSave}>
              <Text style={styles.dialogSaveText}>Сохранить</Text>
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
    width: "90%",
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    padding: 24,
    elevation: 10,
  },
  dialogTitle: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 20,
  },
  dialogInput: {
    color: "#000000",
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginBottom: 30,
  },
  dialogButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  dialogSeparator: {
    width: 1,
    height: 20,
    backgroundColor: "#4a4a4a",
  },
  dialogCancelText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
  dialogSaveText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    backgroundColor: "#f3f4f6",
    borderWidth: 0,
    marginBottom: 5,
  },
});
