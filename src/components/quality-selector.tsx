import {
    Column,
    Text as ComposeText,
    Host,
    RadioButton,
    Row,
    useMaterialColors,
} from "@expo/ui/jetpack-compose";
import {
    fillMaxWidth,
    height,
    padding,
    selectable,
    selectableGroup,
} from "@expo/ui/jetpack-compose/modifiers";
import { Text as RNText, StyleSheet, View } from "react-native";

export type QualityOption = "low" | "high";

interface QualitySelectorProps {
  selectedQuality: QualityOption;
  onSelect: (quality: QualityOption) => void;
  disabled: boolean; 
}

const qualityOptions = [
  { label: "Низкое качество (экономия места)", id: "low" as QualityOption },
  { label: "Высокое качество", id: "high" as QualityOption },
];

export const QualitySelector = ({ selectedQuality, onSelect, disabled }: QualitySelectorProps) => {
  const colors = useMaterialColors();

  return (
    <View style={styles.qualityContainer}>
      <RNText style={styles.qualityLabel}>Качество записи:</RNText>

      <Host matchContents>
        <Column modifiers={[selectableGroup()]}>
          {qualityOptions.map((opt) => (
            <Row
              key={opt.id}
              verticalAlignment="center"
              modifiers={[
                fillMaxWidth(),
                height(48),
                selectable(
                  opt.id === selectedQuality,
                  () => {
                    if (!disabled) onSelect(opt.id);
                  },
                  "radioButton"
                ),
              ]}
            >
              <RadioButton selected={opt.id === selectedQuality} />
              <ComposeText color={colors.onBackground} modifiers={[padding(16, 0, 0, 0)]}>
                {opt.label}
              </ComposeText>
            </Row>
          ))}
        </Column>
      </Host>
    </View>
  );
};

const styles = StyleSheet.create({
  qualityContainer: {
    marginBottom: 20,
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});