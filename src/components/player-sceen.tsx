import { Category, Record } from "@/lib/db";
import Feather from "@expo/vector-icons/Feather";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatTime } from "../helpers/formatTime";
import { EditModal } from "./edit-modal";

export function PlayerUI({
  record,
  router,
  categories,
  onHandleEdit,
  onHandleDelete,
}: {
  record: Record;
  router: any;
  categories: Category[];
  onHandleEdit: (newTitle: string, newCategoryIds: string[]) => void;
  onHandleDelete: () => void;
}) {
  const filePath = record.audioFilePath || "";

  const audioSource = filePath.startsWith("file://")
    ? filePath
    : `file://${filePath}`;

  const player = useAudioPlayer(audioSource);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const [currentTitle, setCurrentTitle] = useState(record.title);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleSaveEdit = async (newTitle: string, newCategoryIds: string[]) => {
    const trimmedTitle = newTitle.trim();
    if (trimmedTitle) {
      await onHandleEdit(trimmedTitle, newCategoryIds);
      setCurrentTitle(trimmedTitle);
    }
    setIsEditModalVisible(false);
  };

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      setIsPlaying(player.playing);

      if (!isSeeking) {
        setCurrentTime(player.currentTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [player, isSeeking]);

  const handleTogglePlay = () => {
    if (!player) return;
    if (player.currentTime >= player.duration) {
      player.seekTo(0);
    }
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleSlidingStart = () => {
    setIsSeeking(true);
  };

  const handleSeek = (value: number) => {
    if (player) {
      player.seekTo(value);
      setCurrentTime(value);
    }
    setIsSeeking(false);
  };

  const handleForward = (back: boolean) => {
    if (!player) return;
    const seekTime = back
      ? Math.max(player.currentTime - 10, 0)
      : Math.min(player.currentTime + 10, player.duration);
    player.seekTo(seekTime);
    setCurrentTime(seekTime);
  };

  const validDuration =
    player?.duration && player.duration > 0 ? player.duration : 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" style={styles.closeIcon} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {currentTitle}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsEditModalVisible(true)}
        >
          <Feather
            name="edit-2"
            style={[styles.icon, { color: "#b3b2b2", fontSize: 20 }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Alert.alert(
              "Удаление записи",
              "Вы уверены, что хотите удалить эту запись?",
              [
                {
                  text: "Отмена",
                  style: "cancel",
                },
                {
                  text: "Удалить",
                  style: "destructive",
                  onPress: onHandleDelete,
                },
              ],
            );
          }}
        >
          <Feather
            name="trash-2"
            style={[styles.icon, { color: "#b3b2b2", fontSize: 20 }]}
          />
        </TouchableOpacity>
      </View>
      {/* Категории */}
      <View style={styles.categoriesWrapper}>
        {record.categories?.map((cat) => (
          <Text
            key={cat.id}
            style={[
              styles.categoryBadge,
              { backgroundColor: cat.assignedColor },
            ]}
          >
            {cat.name}
          </Text>
        ))}
      </View>
      {/* тело */}
      <View style={styles.sliderContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={validDuration}
          value={currentTime}
          onSlidingStart={handleSlidingStart}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#3b82f6"
        />

        <Text style={styles.timeText}>{formatTime(player?.duration ?? 0)}</Text>
      </View>
      {/* кнопки */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleForward(true)}
        >
          <Feather
            name="rotate-ccw"
            style={[styles.icon, styles.fastForwardIcon]}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleTogglePlay}>
          {isPlaying ? (
            <Feather name="pause" style={styles.icon} />
          ) : (
            <Feather name="play" style={styles.icon} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleForward(false)}
        >
          <Feather
            name="rotate-cw"
            style={[styles.icon, styles.fastForwardIcon]}
          />
        </TouchableOpacity>
      </View>

      <EditModal
        visible={isEditModalVisible}
        initialTitle={currentTitle}
        categoryIds={record.categories?.map((cat) => cat.id) ?? []}
        categories={categories}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleSaveEdit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#1f57c067",
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 15,
    height: 40,
  },
  timeText: {
    fontSize: 14,
    color: "#6b7280",
    fontVariant: ["tabular-nums"],
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  button: {
    padding: 10,
  },
  icon: {
    color: "#1e6ffa",
    fontSize: 28,
  },
  fastForwardIcon: {
    fontSize: 20,
  },
  closeIcon: {
    color: "#9ca3af",
    fontSize: 24,
    fontWeight: "600",
  },
  categoriesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: "#e5e7eb",
    color: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14,
  },
});
