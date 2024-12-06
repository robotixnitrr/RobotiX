import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tooltip } from "./ui/Tooltip";

export default function FloatingConsultButton() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 right-4 z-50"
        >
            <Tooltip
                content="Quick Appointment"
                position="left"
            >
                <Link
                    to="/book-consultation"
                    className="flex items-center gap-2 bg-navy-500 text-white p-3 rounded-full shadow-lg hover:bg-navy-600 transition-colors"
                >
                    <Calendar size={20} />
                </Link>
            </Tooltip>
        </motion.div>
    );
} 