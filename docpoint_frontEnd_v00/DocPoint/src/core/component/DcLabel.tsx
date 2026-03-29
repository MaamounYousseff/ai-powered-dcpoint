
interface DcLabelProps {
  slot?: React.ReactNode;
  value: string;
  additionalClasses?: string;
}

function DcLabel({ slot, value, additionalClasses = "" }: DcLabelProps) {
  return (
    <> 
      {slot ? (
        <div className={additionalClasses}>
          <span>{slot}</span>
          <span>{value}</span>
        </div>
      ) : (
        <div className={additionalClasses}>{value}</div>
      )}
    </>
  );
}

export default DcLabel;