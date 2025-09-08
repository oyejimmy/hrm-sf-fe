import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, DatePicker } from "antd";
import { PerformanceReview } from "../types";

const { RangePicker } = DatePicker;

interface Props {
    visible: boolean;
    onCancel: () => void;
    onSave: (review: PerformanceReview) => void;
    initialData?: PerformanceReview;
}

const PerformanceReviewModal: React.FC<Props> = ({
    visible,
    onCancel,
    onSave,
    initialData,
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue(initialData);
        } else {
            form.resetFields();
        }
    }, [initialData, form]);

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const review: PerformanceReview = {
                    ...initialData,
                    ...values,
                    reviewPeriod: values.reviewPeriod
                        ? `${values.reviewPeriod[0].format("DD MMM YYYY")} - ${values.reviewPeriod[1].format("DD MMM YYYY")}`
                        : "",
                    createdAt: initialData?.createdAt || new Date().toISOString(),
                };
                onSave(review);
                form.resetFields();
            })
            .catch(() => { });
    };

    return (
        <Modal
            title={initialData ? "Edit Performance Review" : "Add Performance Review"}
            open={visible}
            onCancel={onCancel}
            onOk={handleOk}
            okText="Save"
        >
            <Form form={form} layout="vertical">
                <Form.Item name="employeeName" label="Employee" rules={[{ required: true }]}>
                    <Input placeholder="Employee Name" />
                </Form.Item>

                <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                    <Input placeholder="Department" />
                </Form.Item>

                <Form.Item name="reviewer" label="Reviewer" rules={[{ required: true }]}>
                    <Input placeholder="Reviewer Name" />
                </Form.Item>

                <Form.Item name="reviewPeriod" label="Review Period" rules={[{ required: true }]}>
                    <RangePicker style={{ width: "100%" }} />
                </Form.Item>

                {[
                    "communication",
                    "teamwork",
                    "problemSolving",
                    "technicalSkills",
                    "initiative",
                    "attendance",
                    "goalAchievement",
                ].map((field) => (
                    <Form.Item
                        key={field}
                        name={field}
                        label={field.replace(/([A-Z])/g, " $1")}
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <InputNumber min={1} max={5} style={{ width: "100%" }} />
                    </Form.Item>
                ))}

                <Form.Item name="overallRating" label="Overall Rating" rules={[{ required: true }]}>
                    <InputNumber min={1} max={5} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="comments" label="Comments">
                    <Input.TextArea rows={3} placeholder="Write feedback..." />
                </Form.Item>

                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: "Draft", label: "Draft" },
                            { value: "Submitted", label: "Submitted" },
                            { value: "Finalized", label: "Finalized" },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PerformanceReviewModal;
