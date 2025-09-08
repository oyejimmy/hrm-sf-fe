// AdminDashboard/components/QuickActions.tsx
import React from "react";
import { Button, Tooltip } from "antd";
import { ActionsGrid, SectionCard } from "./styles";
import type { Role } from "../types";

/** action item */
export interface ActionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  roles?: Role[]; // visible to which roles (if undefined => all)
}

/** QuickActions: renders a grid of buttons; respects role-based visibility */
interface Props {
  actions: ActionItem[];
  role: Role;
}

const QuickActions: React.FC<Props> = ({ actions, role }) => {
  return (
    <SectionCard title="Quick Actions">
      <ActionsGrid>
        {actions
          .filter((a) => !a.roles || a.roles.includes(role))
          .map((a) => (
            <Tooltip key={a.id} title={a.title}>
              <Button
                onClick={a.onClick}
                style={{
                  height: 80,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                icon={a.icon}
                block
              >
                <small>{a.title}</small>
              </Button>
            </Tooltip>
          ))}
      </ActionsGrid>
    </SectionCard>
  );
};

export default QuickActions;
