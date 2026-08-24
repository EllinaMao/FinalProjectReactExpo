import { Category } from "@/lib/db";
import Feather from "@expo/vector-icons/Feather";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { MultiSelect } from "react-native-element-dropdown";

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onSelect: (ids: string[]) => void;
  customStyle?: StyleProp<ViewStyle>;
}

export const CategoryDropdown = ({
  categories,
  selectedCategoryIds,
  onSelect,
  customStyle,
}: CategoryDropdownProps) => {
  const dropdownData = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
    assignedColor: cat.assignedColor,
  }));

  return (
    <View style={styles.container}>
      <MultiSelect
        style={[styles.dropdown, customStyle]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.dropdownContainer}
        data={dropdownData}
        labelField="label"
        valueField="value"
        placeholder="Выберите категории..."
        value={selectedCategoryIds}
        onChange={(items) => {
          onSelect(items);
        }}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity
            onPress={() => unSelect && unSelect(item)}
            style={{ marginBottom: 10 }}
          >
            <View
              style={[
                styles.selectedItem,
                { backgroundColor: item.assignedColor, borderRadius: 14 },
              ]}
            >
              <Text style={styles.selectedItemText}>{item.label}</Text>
              <Feather name="check-square" size={14} color="#1f2937" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  dropdown: {
    minHeight: 50,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  placeholderStyle: { fontSize: 16, color: "#9ca3af" },
  selectedTextStyle: { fontSize: 14, color: "#371f1f" },
  dropdownContainer: { borderRadius: 12, elevation: 4, overflow: "hidden" },
  selectedItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#24324d",
    marginRight: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedItemText: {
    fontSize: 14,
    color: "#ffffff",
    marginRight: 4,
  },
});
