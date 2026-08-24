import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  saveDisabled: boolean;
}

export const ActionButtons = ({
  onCancel,
  onSave,
  saveDisabled,
}: ActionButtonsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelText}>Отмена</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, saveDisabled && styles.saveDisabled]}
        onPress={onSave}
        disabled={saveDisabled}
        activeOpacity={0.7}
      >
        <Text style={styles.saveText}>Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#d5d7db",
    alignItems: "center",
    marginRight: 8,
  },
  cancelText: {
    color: "#4b5563",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#51d645",
    alignItems: "center",
    marginLeft: 8,
  },
  saveDisabled: {
    backgroundColor: "#bfdbfe",
  },
  saveText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
