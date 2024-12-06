import { axiosInstance } from './authApi';
// import { Prescription } from './prescriptionApi';

export interface ConsultationData {
    doctorId: string;
    consultationType: 'General Consultation' | 'Follow-up' | 'Specific Treatment' | 'Emergency';
    date: Date;
    timeSlot: string;
    symptoms: string;
}

export interface Consultation extends ConsultationData {
    _id: string;
    patient: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    amount: number;
    paymentStatus: 'pending' | 'completed' | 'refunded';
    createdAt: string;
    updatedAt: string;
}

export interface Prescription {
    medicines: Array<{
        name: string;
        dosage: string;
        duration: string;
    }>;
    instructions: string;
}

export const consultationApi = {
    create: async (consultationData: ConsultationData) => {
        const response = await axiosInstance.post('/consultations', consultationData);
        return response.data;
    },

    getMyConsultations: async (userId: string) => {
        const response = await axiosInstance.get(`/consultations/user/${userId}`);
        return response.data;
    },

    getConsultationById: async (id: string) => {
        const response = await axiosInstance.get(`/consultations/${id}`);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await axiosInstance.patch(`/consultations/${id}/status`, { status });
        return response.data;
    },


    addPrescription: async (id: string, prescription: Prescription) => {
        const response = await axiosInstance.patch(`/consultations/${id}/prescription`, prescription);
        return response.data;
    },

    cancelConsultation: async (id: string) => {
        const response = await axiosInstance.patch(`/consultations/${id}/status`, { status: 'cancelled' });
        return response.data;
    },

    getDoctorConsultations: async (doctorId: string) => {
        const response = await axiosInstance.get(`/consultations/doctor/${doctorId}`);
        return response.data;
    },

    getUpcomingConsultations: async () => {
        const response = await axiosInstance.get('/consultations/upcoming');
        return response.data;
    },

    getPastConsultations: async () => {
        const response = await axiosInstance.get('/consultations/past');
        return response.data;
    }
}; 