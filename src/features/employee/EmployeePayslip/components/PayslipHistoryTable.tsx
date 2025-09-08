import React from "react";
import { Table, Space, Tag, Tooltip } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { Payslip } from "../types";
import { StyledTable } from "./styles";

interface Props {
    data: Payslip[];
    onView: (payslip: Payslip) => void;
    onDownload: (payslip: Payslip) => void;
}

const PayslipHistoryTable: React.FC<Props> = ({ data, onView, onDownload }) => {
    const columns: any = [
        { title: "Month", dataIndex: "month", key: "month" },
        { title: "Year", dataIndex: "year", key: "year" },
        {
            title: "Net Pay",
            dataIndex: "netPay",
            key: "netPay",
            render: (val: number) => `${val} PKR`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "Paid" ? "green" : "orange"}>{status}</Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Payslip) => (
                <Space>
                    <Tooltip title="View Payslip">
                        <EyeOutlined
                            style={{ cursor: "pointer" }}
                            onClick={() => onView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Download Payslip">
                        <DownloadOutlined
                            style={{ cursor: "pointer" }}
                            onClick={() => onDownload(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <StyledTable>
            <Table rowKey="id" columns={columns} dataSource={data} />
        </StyledTable>
    );
};

export default PayslipHistoryTable;
