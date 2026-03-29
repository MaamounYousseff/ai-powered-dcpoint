interface CardSlotProps {
  icon: React.ReactNode;
  text: string;
  additionalClasses: string
}


export default function CardSlot({ icon, text, additionalClasses }: CardSlotProps) {
  return (
    <div className={additionalClasses}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}