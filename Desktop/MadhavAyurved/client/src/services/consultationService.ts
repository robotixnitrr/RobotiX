import { consultationApi, ConsultationData, Prescription } from '../api/consultationApi';
import { getErrorMessage } from '../utils/apiErrorHandler';

export const consultationService = {
    createConsultation: async (consultationData: ConsultationData) => {
        try {
            const response = await consultationApi.create(consultationData);
            return response.data;
        } catch (error) {
            throw getErrorMessage(error);
        }
    },

    getMyConsultations: async (userId: string) => {
        try {
            const response = await consultationApi.getMyConsultations(userId);
            return response;
        } catch (error) {
            console.error('Failed to fetch consultations:', error);
            throw getErrorMessage(error);
        }
    },

    updateConsultationStatus: async (id: string, status: string) => {
        try {
            const response = await consultationApi.updateStatus(id, status);
            return response.data;
        } catch (error) {
            console.error('Failed to update consultation status:', error);
            throw error;
        }
    },

    addPrescription: async (id: string, prescription: Prescription) => {
        try {
            const response = await consultationApi.addPrescription(id, prescription);
            return response.data;
        } catch (error) {
            console.error('Failed to add prescription:', error);
            throw error;
        }
    },

    cancelConsultation: async (id: string) => {
        try {
            const response = await consultationApi.cancelConsultation(id);
            return response.data;
        } catch (error) {
            console.error('Failed to cancel consultation:', error);
            throw error;
        }
    },

    getUpcomingConsultations: async () => {
        try {
            const response = await consultationApi.getUpcomingConsultations();
            return response.data;
        } catch (error) {
            console.error('Failed to fetch upcoming consultations:', error);
            throw error;
        }
    },

    getPastConsultations: async () => {
        try {
            const response = await consultationApi.getPastConsultations();
            return response.data;
        } catch (error) {
            console.error('Failed to fetch past consultations:', error);
            throw error;
        }
    },

    getConsultationById: async (id: string) => {
        try {
            const response = await consultationApi.getConsultationById(id);
            return response;
        } catch (error) {
            console.error('Failed to fetch consultation details:', error);
            throw getErrorMessage(error);
        }
    },
}; 