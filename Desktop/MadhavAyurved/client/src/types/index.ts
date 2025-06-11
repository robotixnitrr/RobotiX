export interface User {
  id: string;
  patientId: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  role?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  image: string;
  availability: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  userId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}