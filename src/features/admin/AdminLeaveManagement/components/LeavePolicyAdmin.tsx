import React from "react";
import { Collapse, Button } from "antd";

const { Panel } = Collapse;

interface Props {
    policies: any;
    onEdit: (policy: any) => void;
}

const LeavePolicyAdmin: React.FC<Props> = ({ policies, onEdit }) => (
    <Collapse accordion>
        {policies.map((policy: any, idx: any) => (
            <Panel header={policy.type} key={idx}>
                <p><b>Eligibility:</b> {policy.eligibility}</p>
                <p><b>Workflow:</b> {policy.workflow}</p>
                {policy.documentation && <p><b>Documentation:</b> {policy.documentation}</p>}
                <Button type="link" onClick={() => onEdit(policy)}>Edit Policy</Button>
            </Panel>
        ))}
    </Collapse>
);

export default LeavePolicyAdmin;
