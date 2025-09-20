// components/EmployeePayslip/components/styles.tsx
import styled from 'styled-components';
import { Card, Table } from 'antd';

export const PageWrapper = styled.div`
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 576px) {
    padding: 12px;
  }
`;

export const SummaryWrapper = styled.div`
  margin-bottom: 24px;
`;

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: ${(props: any) => props.theme.themeMode === 'light' ? '#f0f0f0' : '#262626'};
  }
  
  @media (max-width: 768px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px;
    }
  }
`;

export const ModalContent = styled.div`
  padding: 16px 0;
`;

export const HighlightedNet = styled.span`
  color: #52c41a;
  font-weight: bold;
`;

export const StyledCard = styled(Card)`
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

// export const IconWrapper = styled.div<{ $color: string }>`
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   width: 40px;
//   height: 40px;
//   border-radius: 8px;
//   background-color: ${(props) => `${props.$color}15`};
//   color: ${(props) => props.$color};
//   margin-bottom: 12px;
  
//   @media (max-width: 576px) {
//     width: 32px;
//     height: 32px;
//   }
// `;

// export const StatisticCard = styled(Card)`
// //   height: 100%;
  
// //   .ant-card-body {
// //     display: flex;
// //     flex-direction: column;
// //   }
  
// //   @media (max-width: 576px) {
// //     .ant-card-body {
// //       padding: 12px;
// //     }
// //   }
// // `;

export const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
  
  .search-section {
    display: flex;
    align-items: center;
  }
  
  .filter-section {
    display: flex;
    align-items: center;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    
    .search-section, .filter-section {
      width: 100%;
    }
    
    .search-section {
      margin-bottom: 8px;
    }
  }
  
  @media (max-width: 576px) {
    .search-section {
      > div {
        width: 100%;
      }
    }
    
    .filter-section {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      
      > div {
        width: 100%;
      }
    }
  }
`;
export type PastelVariant = 'pastelGreen' | 'pastelPink' | 'lightPeach' | 'softLavender';

const pastelPalette: Record<
  PastelVariant,
  { bg: string; border: string; iconBg: string; icon: string }
> = {
  pastelGreen: {
    bg: '#E9F7EF',      // Pastel Green
    border: '#CDEFD8',
    iconBg: '#DFF3E7',
    icon: '#2E7D32',
  },
  pastelPink: {
    bg: '#FFE6EE',      // Pastel Pink
    border: '#F9CEDA',
    iconBg: '#FBD6E1',
    icon: '#C2185B',
  },
  lightPeach: {
    bg: '#FFF1E6',      // Light Peach
    border: '#FFDCC5',
    iconBg: '#FFE5D2',
    icon: '#C05A00',
  },
  softLavender: {
    bg: '#F1EAFB',      // Soft Lavender
    border: '#DDD1F3',
    iconBg: '#E8DEF8',
    icon: '#5E35B1',
  },
};

export const StatisticCard = styled.div<{ $variant: PastelVariant }>`
  background: ${({ $variant }) => pastelPalette[$variant].bg};
  border: 1px solid ${({ $variant }) => pastelPalette[$variant].border};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  }

  /* Tweak Ant Typography colors slightly for pastel backgrounds */
  .ant-typography {
    color: rgba(0, 0, 0, 0.88);
  }
  .ant-typography.ant-typography-secondary {
    color: rgba(0, 0, 0, 0.56);
  }

  @media (max-width: 575px) {
    padding: 14px;
    border-radius: 10px;
  }
`;

export const IconWrapper = styled.div<{ $variant: PastelVariant }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $variant }) => pastelPalette[$variant].iconBg};
  color: ${({ $variant }) => pastelPalette[$variant].icon};
  margin-bottom: 8px;

  /* lucide-react icons inherit currentColor, so this sets their stroke */
  svg {
    display: block;
  }

  @media (max-width: 575px) {
    width: 32px;
    height: 32px;
  }
`;