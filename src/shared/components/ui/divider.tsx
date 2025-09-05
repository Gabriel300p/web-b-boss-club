type DividerProps = {
  orientation?: "horizontal" | "vertical";
  thickness?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  thickness = orientation === "horizontal" ? 1 : "100%",
  className = "",
  style,
}) => {
  const baseClass =
    orientation === "horizontal"
      ? "border-t border-neutral-300 dark:border-neutral-800"
      : "border-l border-neutral-300 dark:border-neutral-800";
  const dividerStyle: React.CSSProperties =
    orientation === "horizontal"
      ? {
          width: "100%",
          height: thickness,
          ...style,
        }
      : {
          width: thickness,
          height: "100%",
          display: "inline-block",
          ...style,
        };

  return (
    <div
      className={`${baseClass} ${className}`.trim()}
      style={dividerStyle}
      role="separator"
    />
  );
};

export default Divider;
