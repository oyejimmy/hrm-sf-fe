import React, { useMemo } from "react";
import { Row, Col, Typography, Button, Spin } from "antd";
import {
  Package,
  Laptop,
  Monitor,
  Smartphone,
  Headphones,
  Printer,
} from "lucide-react";
import { useAvailableAssets } from "../../../../hooks/api/useAssets";
import {
  StyledModal,
  SummaryContainer,
  AssetCard,
  IconContainer,
  AssetCount,
  TipContainer,
  EmptyStateContainer,
  EmptyIconContainer,
  LoadingContainer,
} from "./styles";

const { Title, Text } = Typography;

interface AvailableAssetsModalProps {
  visible: boolean;
  onClose: () => void;
}

const AvailableAssetsModal: React.FC<AvailableAssetsModalProps> = ({
  visible,
  onClose,
}) => {
  const { data: availableAssets = [], isLoading } = useAvailableAssets();

  const assetTypes = useMemo(() => {
    const excludedTypes = ["Furniture", "Tablet", "Phone"];
    return availableAssets
      .filter((asset: any) => !excludedTypes.includes(asset.asset_type))
      .reduce((acc: any, asset: any) => {
        acc[asset.asset_type] = (acc[asset.asset_type] || 0) + 1;
        return acc;
      }, {});
  }, [availableAssets]);

  const getAssetIcon = (type: string) => {
    const iconConfig = {
      Laptop: { component: Laptop, color: "#1890ff" },
      Monitor: { component: Monitor, color: "#52c41a" },
      Smartphone: { component: Smartphone, color: "#faad14" },
      Headphones: { component: Headphones, color: "#722ed1" },
      Printer: { component: Printer, color: "#f5222d" },
      Keyboard: { component: Package, color: "#13c2c2" },
      Mouse: { component: Package, color: "#eb2f96" },
    };

    const config =
      iconConfig[type as keyof typeof iconConfig] || {
        component: Package,
        color: "#8c8c8c",
      };
    const IconComponent = config.component;
    return <IconComponent size={32} color={config.color} />;
  };

  const totalAssets = useMemo(
    () =>
      Object.values(assetTypes).reduce(
        (sum: number, count: any) => sum + count,
        0
      ),
    [assetTypes]
  );

  if (isLoading) {
    return (
      <StyledModal
        title="Available Assets"
        open={visible}
        onCancel={onClose}
        closable={false}
        footer={null}
        width={700}
        centered
      >
        <LoadingContainer>
          <Spin size="large" tip="Loading available assets..." />
        </LoadingContainer>
      </StyledModal>
    );
  }

  return (
    <StyledModal
      title="Available Assets"
      open={visible}
      onCancel={onClose}
      closable={false}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={700}
      centered
    >
      {Object.keys(assetTypes).length > 0 ? (
        <>
          <SummaryContainer>
            <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
              Total Available: {totalAssets} Assets
            </Title>
          </SummaryContainer>

          <Row gutter={[16, 16]}>
            {Object.entries(assetTypes).map(([type, count]) => (
              <Col xs={24} sm={12} md={8} key={type}>
                <AssetCard bodyStyle={{ padding: "20px 16px" }}>
                  <IconContainer>{getAssetIcon(type)}</IconContainer>
                  <Title
                    level={5}
                    style={{ margin: "8px 0 4px 0", fontSize: "14px" }}
                  >
                    {type}
                  </Title>
                  <AssetCount>{count as number}</AssetCount>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {count === 1 ? "unit" : "units"} available
                  </Text>
                </AssetCard>
              </Col>
            ))}
          </Row>

          <TipContainer>
            <Text type="secondary">
              <strong>Tip:</strong> Contact IT department to request any of
              these assets
            </Text>
          </TipContainer>
        </>
      ) : (
        <EmptyStateContainer>
          <EmptyIconContainer>
            <Package size={48} color="#d9d9d9" />
          </EmptyIconContainer>
          <Title level={4} type="secondary">
            No Available Assets
          </Title>
          <Text type="secondary">
            All assets are currently assigned or under maintenance
          </Text>
        </EmptyStateContainer>
      )}
    </StyledModal>
  );
};

export default AvailableAssetsModal;