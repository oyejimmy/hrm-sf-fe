import React from "react";
import { Card, Tag, Button } from "antd";

interface Props {
    module: any;
    onFeedback: (module: any) => void;
}

const TrainingModuleCard: React.FC<Props> = ({ module, onFeedback }) => {
    return (
        <Card
            title={module.title}
            extra={
                <Tag
                    color={
                        module.status === "Completed"
                            ? "green"
                            : module.status === "Active"
                                ? "blue"
                                : "orange"
                    }
                >
                    {module.status}
                </Tag>
            }
            actions={[
                <Button type="link" onClick={() => onFeedback(module)}>
                    Give Feedback
                </Button>,
            ]}
        >
            <p>{module.description}</p>
            <p>
                <b>Estimated Time:</b> {module.estimatedTime}
            </p>
            {module.deadline && (
                <p>
                    <b>Deadline:</b> {module.deadline}
                </p>
            )}
            {module.certification && <Tag color="purple">Certification Available</Tag>}
            <p>
                <b>Resources:</b>
            </p>
            <ul>
                {module.resources.map((r: any, idx: any) => (
                    <li key={idx}>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            {r}
                        </a>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default TrainingModuleCard;
