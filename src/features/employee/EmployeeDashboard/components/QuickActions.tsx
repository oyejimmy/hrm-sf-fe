import React from "react";
import { Button } from "antd";
import { SectionCard, GridRow } from "./styles";
import type { QuickAction } from "../types";

interface Props {
  actions: QuickAction[];
}

const QuickActions: React.FC<Props> = ({ actions }) => (
  <SectionCard title="Quick Actions">
    <GridRow minWidth={140}>
      {actions.map((a) => (
        <Button key={a.id} icon={a.icon} onClick={a.onClick} block>
          {a.label}
        </Button>
      ))}
    </GridRow>
  </SectionCard>
);

export default QuickActions;
