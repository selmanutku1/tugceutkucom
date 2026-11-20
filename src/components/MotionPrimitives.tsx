import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';

export const EXECUTIVE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EXIT_EASE: [number, number, number, number] = [0.4, 0, 1, 1];

export const PAGE_TRANSITION_VARIANTS = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.34,
      ease: EXECUTIVE_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.2,
      ease: EXIT_EASE,
    },
  },
};

type SlideDirection = 'up' | 'down' | 'left' | 'right';

function getSlideOffset(direction: SlideDirection, distance: number) {
  switch (direction) {
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: -distance, y: 0 };
    case 'right':
      return { x: distance, y: 0 };
    case 'up':
    default:
      return { x: 0, y: distance };
  }
}

interface PageTransitionProps {
  key?: string | number;
  routeKey: string;
  children: ReactNode;
}

export function PageTransition({ routeKey, children }: PageTransitionProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div key={routeKey}>{children}</div>;
  }

  return (
    <motion.div
      key={routeKey}
      variants={PAGE_TRANSITION_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

interface RevealProps {
  key?: string | number;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  direction?: SlideDirection;
  distance?: number;
  duration?: number;
  immediate?: boolean;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y,
  direction = 'up',
  distance = 34,
  duration = 0.62,
  immediate = false,
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const effectiveDistance = typeof y === 'number' ? y : distance;
  const offset = getSlideOffset(direction, effectiveDistance);

  if (immediate) {
    return (
      <motion.div
        initial={{ opacity: 0, x: offset.x, y: offset.y }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration,
          delay: delay + 0.08,
          ease: EXECUTIVE_EASE,
        }}
        style={{ willChange: 'transform, opacity' }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration, delay, ease: EXECUTIVE_EASE }}
      style={{ willChange: 'transform, opacity' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  immediate?: boolean;
}

export function StaggerGroup({
  children,
  className = '',
  staggerDelay = 0.095,
  delayChildren,
  immediate = false,
}: StaggerGroupProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const resolvedDelay =
    typeof delayChildren === 'number' ? delayChildren : immediate ? 0.08 : 0.04;

  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: resolvedDelay,
      },
    },
  };

  if (immediate) {
    return (
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  key?: string | number;
  children: ReactNode;
  className?: string;
  y?: number;
  direction?: SlideDirection;
  distance?: number;
}

export function StaggerItem({
  children,
  className = '',
  y,
  direction = 'up',
  distance = 28,
}: StaggerItemProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const effectiveDistance = typeof y === 'number' ? y : distance;
  const offset = getSlideOffset(direction, effectiveDistance);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: offset.x, y: offset.y },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.58,
            ease: EXECUTIVE_EASE,
          },
        },
      }}
      style={{ willChange: 'transform, opacity' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  durationMs = 900,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();
  const [value, setValue] = useState(prefersReduced ? target : 0);

  useEffect(() => {
    if (prefersReduced) {
      setValue(target);
      return;
    }
    if (!inView) return;

    let frameId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Cubic ease-out settling
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView, target, durationMs, prefersReduced]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-gradient-to-r from-brand-navy via-[#01526C] to-brand-teal-mid pointer-events-none"
    />
  );
}

interface AccordionBodyProps {
  isOpen: boolean;
  children: ReactNode;
  id?: string;
  className?: string;
}

export function AccordionBody({
  isOpen,
  children,
  id,
  className = '',
}: AccordionBodyProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    if (!isOpen) return null;
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.26, ease: EXECUTIVE_EASE }}
          className="overflow-hidden"
        >
          <div className={className}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
