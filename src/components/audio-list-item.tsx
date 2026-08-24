import { Record } from "@/lib/db";
import Feather from "@expo/vector-icons/Feather";
import { useAudioPlayer } from "expo-audio";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatDate } from "../helpers/formatDate";
interface AudioListItemProps {
  item: Record;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onRename?: (item: Record) => void;
}

const AudioListItem = ({
  item,
  isSelectionMode,
  isSelected,
  onToggle,
}: AudioListItemProps) => {
  const player = useAudioPlayer(item.audioFilePath ?? null);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    if (isSelectionMode) {
      onToggle(item.id);
    } else {
      if (item.audioFilePath) {
        router.push({
          pathname: "/player",
          params: {
            id: item.id,
          },
        });
      }
    }
  };

  const formattedDate = formatDate(item.created_at);

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={handlePress}
      delayLongPress={100}
    >
      {isSelectionMode && (
        <View style={[styles.checkbox, isSelected && styles.checked]}>
          {isSelected && <Feather name="check" style={styles.checkmark} />}
        </View>
      )}

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDate}>{formattedDate}</Text>
        <View style={styles.categoriesWrapper}>
          {item.categories && item.categories.length > 0 ? (
            <>
              {(isExpanded ? item.categories : item.categories.slice(0, 2)).map(
                (cat) => (
                  <Text
                    key={cat.id}
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: cat.assignedColor },
                    ]}
                  >
                    {cat.name}
                  </Text>
                ),
              )}

              {!isExpanded && item.categories.length > 2 && (
                <TouchableOpacity
                  style={[styles.categoryBadge]}
                  onPress={() => setIsExpanded(true)}
                  activeOpacity={0.7}
                >
                  <Text>+{item.categories.length - 2}</Text>
                </TouchableOpacity>
              )}

              {isExpanded && item.categories.length > 2 && (
                <TouchableOpacity
                  style={[styles.categoryBadge, styles.collapseButton]}
                  onPress={() => setIsExpanded(false)}
                  activeOpacity={0.7}
                >
                  <Feather name="chevron-up" color="black" />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.categoryBadge}>Без категории</Text>
          )}
        </View>
      </View>
      {!isSelectionMode &&
        (item.audioFilePath ? (
          <View style={styles.playButton}>
            <Feather name="play" size={24} color="black" />
          </View>
        ) : (
          <View style={styles.noAudioBadge}>
            <Text style={styles.noAudioText}>Нет аудио</Text>
          </View>
        ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  playButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  noAudioBadge: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  noAudioText: {
    color: "#9ca3af",
    fontSize: 12,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3b82f6",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#3b82f6",
  },
  checkmark: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },

  categoriesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 0,
    marginTop: 10,
  },
  categoryBadge: {
    backgroundColor: "#e5e7eb",
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginVertical: 4,
    fontStyle: "italic",

    fontSize: 14,
  },
  collapseButton: {
    padding: 6,
    marginLeft: 8,
    alignSelf: "center",
  },
});

export default AudioListItem;
