import React from "react";
import { Typography, Flex, Statistic, Spin } from "antd";
import { CardRoot, IconWrapper, PastelVariant, pastelPalette } from "./styles";
import { useTheme } from "../../contexts/ThemeContext";

const { Text } = Typography;

// IconComponent type for feather/react-icons style support
type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}>;

export interface StateCardProps {
  label?: string | React.ReactNode;
  value?: number | string;
  icon?: React.ReactNode | IconComponent;
  tone?: PastelVariant | "auto";
  colorKey?: string; // optional for consistent hash-based auto tone
  iconSize?: number;
  titleLevel?: 1 | 2 | 3 | 4 | 5;
  textSecondary?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  description?: React.ReactNode;
  precision?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  formatter?: (value: any) => React.ReactNode;
  valueStyle?: React.CSSProperties;
  loading?: boolean;
}

const TONES: PastelVariant[] = [
  "pastelPink",
  "pastelGreen",
  "lightPeach",
  "softLavender",
  "pastelBlue",
];

// Hash function for "auto" tone assignment
function hashString(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function resolveTone(tone: StateCardProps["tone"], seed?: string): PastelVariant {
  if (tone && tone !== "auto") return tone;
  if (!seed) return TONES[0];
  return TONES[hashString(seed) % TONES.length];
}

function renderIcon(icon: StateCardProps["icon"], iconSize?: number) {
  const size = iconSize ?? 30;
  if (!icon) return null;

  if (React.isValidElement(icon)) {
    // Clone react element to enforce consistent sizing
    return React.cloneElement(icon as React.ReactElement<any>, {
      size: (icon as any).props?.size ?? size,
    });
  }
  const IconComp = icon as IconComponent;
  return <IconComp size={size} />;
}

export const StateCard: React.FC<StateCardProps> = ({
  label,
  value,
  icon,
  tone = "auto",
  colorKey,
  iconSize,
  titleLevel = 3,
  textSecondary = true,
  className,
  style,
  onClick,
  description,
  precision,
  prefix,
  suffix,
  formatter,
  valueStyle,
  loading = false,
}) => {
  const { isDarkMode } = useTheme();

  const resolvedTone =
    tone !== "auto"
      ? tone
      : resolveTone(tone, colorKey ?? (typeof label === "string" ? label : undefined));

  const labelNode = label && (
    <Text
      type={textSecondary ? "secondary" : undefined}
      style={{
        margin: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {label}
    </Text>
  );

  return (
    <CardRoot
      className={className}
      style={style}
      $variant={resolvedTone}
      onClick={onClick}
      isDarkMode={isDarkMode}
    >
      {loading ? (
        <Flex align="center" justify="center" style={{ flex: 1, minHeight: 80 }}>
          <Spin />
        </Flex>
      ) : (
        <>
          <Flex
            align="center"
            justify="space-between"
            style={{ width: "100%", gap: 12 }}
          >
            {labelNode && <div style={{ flex: 1, minWidth: 0 }}>{labelNode}</div>}
            {icon && (
              <IconWrapper $variant={resolvedTone} isDarkMode={isDarkMode}>
                {renderIcon(icon, iconSize)}
              </IconWrapper>
            )}
          </Flex>

          {value != null && (
            <Statistic
              value={value}
              precision={precision}
              prefix={prefix}
              suffix={suffix}
              formatter={formatter}
              valueStyle={{
                margin: "8px 0 0",
                fontSize:
                  titleLevel === 1
                    ? "38px"
                    : titleLevel === 2
                    ? "30px"
                    : titleLevel === 3
                    ? "24px"
                    : titleLevel === 4
                    ? "20px"
                    : "16px",
                fontWeight: "bold",
                color: isDarkMode ? "white" : pastelPalette[resolvedTone].icon,
                ...valueStyle,
              }}
            />
          )}

          {description && (
            <Text style={{ margin: "15px 0px" }}>{description}</Text>
          )}
        </>
      )}
    </CardRoot>
  );
};