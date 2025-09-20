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
  isDarkMode: boolean;
}>`
  background: ${({ $variant, isDarkMode }) =>
    !isDarkMode ? pastelPalette[$variant].bg : "#141414"};
  color: ${({ isDarkMode }) => (isDarkMode ? "white" : "black")};
  border: ${({ isDarkMode }) =>
    isDarkMode ? "1px solid #1c1c1c" : "1px solid rgba(0, 0, 0, 0.05)"};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }
`;

export const IconWrapper = styled.div<{
  $variant: PastelVariant;
  isDarkMode: boolean;
}>`
  color: ${({ $variant, isDarkMode }) =>
    !isDarkMode ? pastelPalette[$variant].icon : "#141414"};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;
