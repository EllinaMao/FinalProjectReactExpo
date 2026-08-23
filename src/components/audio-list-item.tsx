import { Record } from "@/lib/db";
import Entypo from "@expo/vector-icons/Entypo";
import { useAudioPlayer } from "expo-audio";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatDate } from "../helpers/formatDate";
interface AudioListItemProps {
  item: Record;
  isSelectionMode: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const AudioListItem = ({
  item,
  isSelectionMode,
  isSelected,
  onToggle,
}: AudioListItemProps) => {
  const player = useAudioPlayer(item.audioFilePath ?? null);
  const router = useRouter();

  const handleLongPress = () => {
    //change title to input field and allow user to edit it
  };
  const handlePress = () => {
    if (isSelectionMode) {
      onToggle(item.id);
    } else {
      if (item.audioFilePath) {
        router.push({
          pathname: "../player",
          params: {
            title: item.title,
            uri: item.audioFilePath,
          },
        });
      }
    }
  };

  const formattedDate = formatDate(item.created_at);

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={handlePress}>
      {isSelectionMode && (
        <View style={[styles.checkbox, isSelected && styles.checked]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDate}>{formattedDate}</Text>
      </View>
      {!isSelectionMode &&
        (item.audioFilePath ? (
          <View style={styles.playButton}>
            <Entypo name="controller-play" size={24} color="black" />
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
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
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  playingButton: {
    backgroundColor: "#ef4444",
  },
  playButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
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
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 40,
    fontSize: 16,
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
});

export default AudioListItem;
