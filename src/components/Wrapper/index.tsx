import styled from "styled-components";

export const Wrapper = styled.div<{ $isDarkMode?: boolean }>`
  padding: 24px;
  background-color: ${({ $isDarkMode }) => ($isDarkMode ? '#141414' : '#f5f5f5')};
  min-height: 100vh;
`;