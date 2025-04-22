import { motion } from 'framer-motion';

interface AuthBackgroundProps {
  variant?: 'personal' | 'company' | 'default';
}

export function AuthBackground({ variant = 'default' }: AuthBackgroundProps) {
  const gradients = {
    personal: "from-fuchsia-500/20 via-blue-500/20 to-cyan-400/20",
    company: "from-blue-600/20 via-fuchsia-500/20 to-pink-400/20",
    default: "from-indigo-500/20 via-purple-500/20 to-pink-500/20"
  };

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[variant]} animate-gradient-slow`} />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Animated blobs */}
        <motion.div
          className="absolute -left-4 -top-4 h-72 w-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -right-4 -bottom-4 h-72 w-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-72 w-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4,
          }}
        />
      </div>
    </>
  );
}