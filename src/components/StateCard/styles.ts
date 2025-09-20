import styled from "styled-components";

export type PastelVariant =
  | "pastelGreen"
  | "pastelPink"
  | "lightPeach"
  | "softLavender";

export const pastelPalette: Record<
  PastelVariant,
  { bg: string; icon: string }
> = {
  pastelGreen: {
    bg: "#e9f7e8",
    icon: "#52c41a",
  },
  pastelPink: {
    bg: "#fbe6e6",
    icon: "#f5222d",
  },
  lightPeach: {
    bg: "#fff6e3",
    icon: "#faad14",
  },
  softLavender: {
    bg: "#f3e8f8",
    icon: "#722ed1",
  },
};

export const CardRoot = styled.div<{
  $variant: PastelVariant;
  isDarkMode?: boolean;
}>`
  color: ${({ isDarkMode }) => (isDarkMode ? "white" : "rgba(0, 0, 0, 0.88)")};
  background: ${({ $variant, isDarkMode }) =>
    !isDarkMode && pastelPalette[$variant].bg};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: ${({ isDarkMode }) =>
    isDarkMode
      ? "0 2px 8px rgba(255, 255, 255, 0.08)"
      : "0 2px 8px rgba(0, 0, 0, 0.06)"};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ isDarkMode }) =>
      isDarkMode
        ? "0 10px 24px rgba(255, 255, 255, 0.12)"
        : "0 10px 24px rgba(0, 0, 0, 0.08)"};
  }

  @media (max-width: 575px) {
    padding: 14px;
    border-radius: 10px;
  }
`;

export const IconWrapper = styled.div<{
  $variant: PastelVariant;
  isDarkMode?: boolean;
}>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $variant, isDarkMode }) =>
    !isDarkMode ? pastelPalette[$variant].icon : "white"};

  svg {
    display: block;
  }

  @media (max-width: 575px) {
    width: 32px;
    height: 32px;
  }
`;
