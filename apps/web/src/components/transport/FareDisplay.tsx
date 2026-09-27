interface FareDisplayProps {
  fare: number;
}

export function FareDisplay({ fare }: FareDisplayProps) {
  const formatted = fare % 1 === 0 ? fare.toString() : fare.toFixed(2);
  return <span className="font-semibold">{"\u20B9"}{formatted}</span>;
}
