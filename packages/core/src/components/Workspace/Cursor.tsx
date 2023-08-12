interface CursorProps {
  currentPosition: SVGPoint;
  active?: boolean;
}

function Cursor({ currentPosition: position, active }: CursorProps) {
  return (
    <>
      {active && (
        <>
          <circle r={13} fill="none" stroke="white" cx={position.x} cy={position.y} strokeWidth={1} />
          <circle r={15} fill="none" stroke="black" cx={position.x} cy={position.y} strokeWidth={3} />
          <circle r={17} fill="none" stroke="white" cx={position.x} cy={position.y} strokeWidth={1} />
        </>
      )}
      <circle r={2} fill="white" cx={position.x} cy={position.y} className="pointer-events-none" />
    </>
  );
}

export default Cursor;
