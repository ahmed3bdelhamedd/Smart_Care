export type AppointmentRecord = {
  id: number;
  name: string;
  location: string | null;
  doctors: string[];
  durationMinutes: number;
  timezone: string;
  category: string;
  bookingUrl: string;
};

export type OdooAppointment = {
  id: number;
  name: string;
  start: string;
  stop: string;
  location: string | false;
  appointment_type_id: [number, string] | false;
  partner_ids: number[];
  patientNames?: string[];
};
