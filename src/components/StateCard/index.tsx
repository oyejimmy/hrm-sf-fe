import React from "react";
import { Typography, Flex } from "antd";
import { CardRoot, IconWrapper, PastelVariant } from "./styles";
import { useTheme } from "../../contexts/ThemeContext";

const { Title, Text } = Typography;

type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}>;

export interface PastelStatCardProps {
  label?: any;
  value?: any;
  icon?: React.ReactNode | IconComponent;
  tone?: PastelVariant | "auto";
  colorKey?: string;
  iconSize?: number;
  titleLevel?: any | 1 | 2 | 3 | 4 | 5;
  textSecondary?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  description?: any;
}

const TONES: PastelVariant[] = [
  "pastelPink",
  "pastelGreen",
  "lightPeach",
  "softLavender",
];

// Optimized hashing function
function hashString(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// Improved tone resolution
function resolveTone(
  tone: PastelStatCardProps["tone"],
  seed?: string
): PastelVariant {
  if (tone && tone !== "auto") return tone;
  if (!seed) return TONES[0]; // Default to first tone if no seed
  return TONES[hashString(seed) % TONES.length];
}

// Icon rendering with existence check
function renderIcon(icon: PastelStatCardProps["icon"], iconSize?: number) {
  const size = iconSize ?? 20;
  if (!icon) return null;

  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as React.ReactElement<any>, {
      size: (icon as any).props?.size ?? size,
    });
  }
  const IconComp = icon as IconComponent;
  return <IconComp size={size} />;
}

export const StateCard = ({
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
}: PastelStatCardProps) => {
  const { isDarkMode } = useTheme();
  const resolvedTone =
    tone !== "auto"
      ? tone
      : resolveTone(
          tone,
          colorKey ?? (typeof label === "string" ? label : undefined)
        );

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
        <Title level={titleLevel} style={{ margin: "8px 0 0" }}>
          {value}
        </Title>
      )}
      {description != null && (
        <Text style={{ margin: "15px 0px" }}>{description}</Text>
      )}
    </CardRoot>
  );
};
