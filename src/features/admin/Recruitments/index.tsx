import React, { useState } from "react";
import { Table, Button, Space, Input } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { PageContainer, Header, TableWrapper, StatusTag } from "./components/styles";
import JobModal from "./components/JobModal";
import JobDetailsDrawer from "./components/JobDetailsDrawer";
import CandidateTable from "./components/CandidateTable";
import { Job } from "./types";

const Recruitments: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const handleSaveJob = (job: Partial<Job>) => {
        if (selectedJob) {
            setJobs((prev) =>
                prev.map((j) => (j.id === selectedJob.id ? { ...j, ...job } as Job : j))
            );
        } else {
            const newJob: Job = {
                ...(job as Job),
                id: Date.now(),
                applicants: [],
            };
            setJobs((prev) => [...prev, newJob]);
        }
        setModalOpen(false);
        setSelectedJob(null);
    };

    const handleDelete = (id: number) => {
        setJobs((prev) => prev.filter((j) => j.id !== id));
    };

    const columns = [
        { title: "Title", dataIndex: "title" },
        { title: "Department", dataIndex: "department" },
        { title: "Location", dataIndex: "location" },
        { title: "Deadline", dataIndex: "deadline" },
        {
            title: "Status",
            dataIndex: "status",
            render: (status: string) => <StatusTag status={status}>{status}</StatusTag>,
        },
        {
            title: "Actions",
            render: (_: unknown, record: Job) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedJob(record);
                            setDrawerOpen(true);
                        }}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedJob(record);
                            setModalOpen(true);
                        }}
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <PageContainer>
            <Header>
                <h2>Recruitments</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setSelectedJob(null);
                        setModalOpen(true);
                    }}
                >
                    Add Job
                </Button>
            </Header>

            <Input.Search placeholder="Search jobs" style={{ maxWidth: 300, marginBottom: 16 }} />

            <TableWrapper>
                <Table
                    rowKey="id"
                    dataSource={jobs}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 800 }}
                />
            </TableWrapper>

            <JobModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedJob(null);
                }}
                onSave={handleSaveJob}
                initialValues={selectedJob || undefined}
            />

            <JobDetailsDrawer
                job={selectedJob || undefined}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            />

            {selectedJob && selectedJob.applicants.length > 0 && (
                <>
                    <h3 style={{ marginTop: "2rem" }}>Candidates for {selectedJob.title}</h3>
                    <CandidateTable candidates={selectedJob.applicants} />
                </>
            )}
        </PageContainer>
    );
};

export default Recruitments;
