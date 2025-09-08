import React from "react";
import { Collapse } from "antd";
import { LeavePolicy } from "../types";

const { Panel } = Collapse;

interface Props {
  policies: LeavePolicy[];
}

const PolicyGuidelines: React.FC<Props> = ({ policies }) => (
  <Collapse accordion>
    {policies.map((policy, idx) => (
      <Panel header={policy.type} key={idx}>
        <p><b>Eligibility:</b> {policy.eligibility}</p>
        <p><b>Workflow:</b> {policy.workflow}</p>
        {policy.documentation && <p><b>Documentation:</b> {policy.documentation}</p>}
      </Panel>
    ))}
  </Collapse>
);

export default PolicyGuidelines;
