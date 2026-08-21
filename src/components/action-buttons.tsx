import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  saveDisabled: boolean;
}

export const ActionButtons = ({ onCancel, onSave, saveDisabled }: ActionButtonsProps) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.buttonText}>Отмена</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.saveButton, saveDisabled && styles.saveButtonDisabled]}
        onPress={onSave}
        disabled={saveDisabled}
      >
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});