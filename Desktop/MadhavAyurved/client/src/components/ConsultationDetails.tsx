import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, IndianRupee } from "lucide-react";

interface ConsultationDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    consultation: any;  // Replace with proper type
}

export function ConsultationDetails({ isOpen, onClose, consultation }: ConsultationDetailsProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'confirmed':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'completed':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Consultation Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{consultation.doctorName}</span>
                        </div>
                        <Badge className={`${getStatusColor(consultation.status)} capitalize`}>
                            {consultation.status}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(consultation.date), 'PPP')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{consultation.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>{consultation.consultationType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <IndianRupee className="w-4 h-4" />
                            <span>₹{consultation.amount}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Symptoms</h4>
                        <p className="text-sm text-gray-600">{consultation.symptoms}</p>
                    </div>

                    {consultation.prescription && (
                        <div className="space-y-2">
                            <h4 className="font-medium">Prescription</h4>
                            {consultation.prescription.medicines?.map((medicine: any, index: number) => (
                                <div key={index} className="text-sm text-gray-600">
                                    <p className="font-medium">{medicine.name}</p>
                                    <p>Dosage: {medicine.dosage}</p>
                                    <p>Duration: {medicine.duration}</p>
                                </div>
                            ))}
                            {consultation.prescription.instructions && (
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium">Instructions</p>
                                    <p>{consultation.prescription.instructions}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 