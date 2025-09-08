import React from "react";
import { Modal, Descriptions, Divider, Tag } from "antd";
import { Payslip } from "../types";
import { ModalContent, HighlightedNet } from "./styles";

interface Props {
  visible: boolean;
  onClose: () => void;
  payslip: Payslip | null;
}

const PayslipDetailsModal: React.FC<Props> = ({ visible, onClose, payslip }) => {
  if (!payslip) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      title={`Payslip Details - ${payslip.month} ${payslip.year}`}
    >
      <ModalContent>
        <Descriptions title="Employee Payslip" bordered column={2} size="small">
          <Descriptions.Item label="Month">{payslip.month}</Descriptions.Item>
          <Descriptions.Item label="Year">{payslip.year}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={payslip.status === "Paid" ? "green" : "orange"}>
              {payslip.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Net Pay">
            <HighlightedNet>{payslip.netPay} PKR</HighlightedNet>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions title="Earnings" bordered column={2} size="small">
          <Descriptions.Item label="Basic">
            {payslip.earnings.basic} PKR
          </Descriptions.Item>
          <Descriptions.Item label="HRA">
            {payslip.earnings.hra} PKR
          </Descriptions.Item>
          <Descriptions.Item label="Bonus">
            {payslip.earnings.bonus} PKR
          </Descriptions.Item>
          <Descriptions.Item label="Allowances">
            {payslip.earnings.allowances} PKR
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Descriptions title="Deductions" bordered column={2} size="small">
          <Descriptions.Item label="Tax">
            {payslip.deductions.tax} PKR
          </Descriptions.Item>
          <Descriptions.Item label="PF">
            {payslip.deductions.pf} PKR
          </Descriptions.Item>
          <Descriptions.Item label="Loan">
            {payslip.deductions.loan} PKR
          </Descriptions.Item>
          <Descriptions.Item label="Others">
            {payslip.deductions.others} PKR
          </Descriptions.Item>
        </Descriptions>
      </ModalContent>
    </Modal>
  );
};

export default PayslipDetailsModal;
