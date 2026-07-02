import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/** Shown while lazy-loaded code chunks are being fetched */
export default function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 className="w-10 h-10 text-[#3DDC97]" />
        </motion.div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-[#E8E8EC]">Loading module...</p>
          <p className="text-xs text-[#6B7B8D]">Code splitting in action</p>
        </div>
      </motion.div>
    </div>
  );
}
