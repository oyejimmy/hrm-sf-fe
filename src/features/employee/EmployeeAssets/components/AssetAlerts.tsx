// features/employee/Assets/components/AssetAlerts.tsx
import React from "react";
import { List, Tag, Button, Space, Empty } from "antd";
import type { ReactNode } from "react";
import { AssetCard } from "./styles";

/**
 * Local alert type — lightweight and self-contained.
 * You can move this to your shared types file if you prefer.
 */
export type AssetAlert = {
    id: string;
    assetId?: string;
    assetName?: string;
    type: "Overdue" | "Due" | "Maintenance" | "Request";
    message: string;
    date?: string; // friendly date or ISO
    acknowledged?: boolean;
};

interface Props {
    alerts: AssetAlert[];
    /** Called when user acknowledges an alert */
    onAcknowledge?: (id: string) => void;
    /** Open asset details */
    onViewAsset?: (assetId: string) => void;
    /** Start return workflow */
    onRequestReturn?: (assetId: string) => void;
    /** Optional render override for left icon */
    renderIcon?: (alert: AssetAlert) => ReactNode;
}

/**
 * AssetAlerts - displays upcoming/overdue/maintenance notifications
 * - shows tag by type, message, date, and actions (Acknowledge / View / Return)
 */
const AssetAlerts: React.FC<Props> = ({ alerts, onAcknowledge, onViewAsset, onRequestReturn, renderIcon }) => {
    if (!alerts || alerts.length === 0) {
        return (
            <AssetCard>
                <Empty description="No alerts" />
            </AssetCard>
        );
    }

    const tagColor = (type: AssetAlert["type"]) =>
        type === "Overdue" ? "red" : type === "Due" ? "orange" : type === "Maintenance" ? "blue" : "green";

    return (
        <AssetCard>
            <List
                dataSource={alerts}
                renderItem={(a) => (
                    <List.Item
                        key={a.id}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}
                    >
                        <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                            <div style={{ minWidth: 40 }}>
                                {renderIcon ? renderIcon(a) : <Tag color={tagColor(a.type)}>{a.type}</Tag>}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{a.assetName ?? "Asset"}</div>
                                <div style={{ color: "#666", marginTop: 4 }}>{a.message}</div>
                                {a.date && <div style={{ color: "#999", marginTop: 6 }}>{a.date}</div>}
                            </div>
                        </div>

                        <Space>
                            {!a.acknowledged && (
                                <Button
                                    size="small"
                                    onClick={() => onAcknowledge && onAcknowledge(a.id)}
                                >
                                    Acknowledge
                                </Button>
                            )}

                            {a.assetId && (
                                <Button
                                    size="small"
                                    onClick={() => onViewAsset && onViewAsset(a.assetId!)}
                                >
                                    View
                                </Button>
                            )}

                            {a.type !== "Maintenance" && a.assetId && (
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => onRequestReturn && onRequestReturn(a.assetId!)}
                                >
                                    Return
                                </Button>
                            )}
                        </Space>
                    </List.Item>
                )}
            />
        </AssetCard>
    );
};

export default AssetAlerts;
