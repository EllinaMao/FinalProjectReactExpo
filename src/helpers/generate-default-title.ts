export const generateDefaultTitle = () => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const date = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear().toString().slice(2)}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `Audio record ${date}_${time}`;
};
