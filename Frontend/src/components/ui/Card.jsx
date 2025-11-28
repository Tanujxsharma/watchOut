import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      className={`${theme.glass.card} rounded-2xl p-6 ${className}`}
      whileHover={hover ? theme.animation.hover : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
