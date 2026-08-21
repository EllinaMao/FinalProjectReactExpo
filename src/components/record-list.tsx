import { useAudioPlayer } from 'expo-audio';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {Record} from "@/lib/db";


interface AudioListItemProps {
  item: Record;
}

const AudioListItem = ({ item }: AudioListItemProps) => {

    const player = useAudioPlayer(item.audioFilePath ?? null);

  const handleTogglePlay = () => {
    if (!player) return;

    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };


  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : "Дата неизвестна";

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDate}>{formattedDate}</Text>
      </View>

      {item.audioFilePath ? (
        <TouchableOpacity 
          style={[styles.playButton, player?.playing && styles.playingButton]} 
          onPress={handleTogglePlay}
        >
          <Text style={styles.playButtonText}>
            {player?.playing ? "Пауза" : "Слушать"}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.noAudioBadge}>
          <Text style={styles.noAudioText}>Нет аудио</Text>
        </View>
      )}
    </View>
  );
};

interface RecordListProps {
  records: Record[];
}

export const RecordList = ({ records }: RecordListProps) => {
  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AudioListItem item={item} />}
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  playButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  playingButton: {
    backgroundColor: '#ef4444',
  },
  playButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noAudioBadge: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  noAudioText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 40,
    fontSize: 16,
  },
});