
import dayjs from "dayjs";

/**
 * Chuẩn hóa log từ API — map nested user + ipAddress → ip
 */
export const normalizeLog = (log) => ({
  ...log,
  user: log.user || {
    fullName: log.fullName || "Không xác định",
    username: log.username || "unknown",
    avatar: log.avatar || "?",
    role: log.role || "GUEST",
  },
  ip: log.ipAddress || log.ip || "—",
  device: log.device || "—",
});

/**
 * Format datetime cho detail dialog
 */
export const formatFullDateTime = (date) =>
  dayjs(date).format("HH:mm:ss DD/MM/YYYY");

/**
 * Format thời gian cho timeline
 */
export const formatTime = (date) => dayjs(date).format("HH:mm");
export const formatDate = (date) => dayjs(date).format("DD/MM");
export const formatRelative = (date) => dayjs(date).fromNow();