export type AttendanceStatus = "confirmed" | "pending" | "cancelled";
export type WhatsAppStatus = "pending" | "sent" | "failed";

export interface Guest {
  id: string;
  name: string;
  phone: string;
  attendance_status: AttendanceStatus;
  whatsapp_status: WhatsAppStatus;
  whatsapp_error: string | null;
  created_at: string;
}

export interface GuestStats {
  total: number;
  confirmed: number;
  today: number;
  whatsappFailed: number;
}
