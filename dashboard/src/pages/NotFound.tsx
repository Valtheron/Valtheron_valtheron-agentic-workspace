import { motion } from 'framer-motion';
import { Frown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <motion.div
        className="max-w-sm w-full flex flex-col items-center gap-5 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-[#1E2A3A] flex items-center justify-center">
          <Frown className="w-8 h-8 text-[#6B7B8D]" />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-[#E8E8EC] mb-2">404</h1>
          <p className="text-base text-[#6B7B8D]">
            This page doesn't exist in the Valtheron workspace.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1E2A3A] text-[#E8E8EC] rounded-lg text-sm font-medium hover:bg-[#243447] transition-colors mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
