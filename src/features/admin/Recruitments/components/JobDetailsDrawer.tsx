import React from "react";
import { Drawer, Descriptions, Tag } from "antd";
import { StatusTag } from "./styles";

const JobDetailsDrawer = ({ job, open, onClose }: any) => {
  if (!job) return null;

  return (
    <Drawer
      title={`Job Details - ${job.title}`}
      placement="right"
      width={480}
      onClose={onClose}
      open={open}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Department">{job.department}</Descriptions.Item>
        <Descriptions.Item label="Location">{job.location}</Descriptions.Item>
        <Descriptions.Item label="Type">{job.employmentType}</Descriptions.Item>
        <Descriptions.Item label="Experience">{job.experienceLevel}</Descriptions.Item>
        <Descriptions.Item label="Salary">{job.salaryRange || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Deadline">{job.deadline}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <StatusTag status={job.status}>{job.status}</StatusTag>
        </Descriptions.Item>
        <Descriptions.Item label="Skills">
          {job.skills.map((s: any) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label="Description">{job.description}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default JobDetailsDrawer;
