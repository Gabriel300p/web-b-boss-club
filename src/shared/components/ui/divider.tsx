type DividerProps = {
  orientation?: "horizontal" | "vertical";
  thickness?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
};

const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  thickness = orientation === "horizontal" ? 1 : "100%",
  color = "#e5e7eb",
  className = "",
  style,
}) => {
  const dividerStyle: React.CSSProperties =
    orientation === "horizontal"
      ? {
          width: "100%",
          height: thickness,
          backgroundColor: color,
          ...style,
        }
      : {
          width: thickness,
          height: "100%",
          backgroundColor: color,
          display: "inline-block",
          ...style,
        };

  return <div className={className} style={dividerStyle} role="separator" />;
};

export default Divider;
