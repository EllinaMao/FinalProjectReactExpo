export const formatDate = (createdAt?: number): string => {
  if (!createdAt) {
    return "Дата неизвестна";
  }

  return new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
