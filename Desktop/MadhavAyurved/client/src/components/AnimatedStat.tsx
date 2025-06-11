import { useCounter } from '../hooks/useCounter';

interface AnimatedStatProps {
  value: number;
  label: string;
  duration?: number;
}

export default function AnimatedStat({ value, label, duration = 2000 }: AnimatedStatProps) {
  const { count, ref } = useCounter(value, duration);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-primary-600">
        {count}
        <span>+</span>
      </p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}