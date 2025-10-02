import React, { useState } from "react";
import {
  Row,
  Col,
  Typography,
  Tabs,
  Button,
  Tag,
  Spin,
  Alert,
} from "antd";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  Edit,
  Heart,
  DollarSign,
  Award,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api/api";
import { DATE_FORMATS } from "../../constants";
import dayjs from 'dayjs';
import * as S from "./styles";

const { Text } = Typography;
const { TabPane } = Tabs;

interface ProfileProps {
  userData?: any;
  profileData?: any;
}

const Profile: React.FC<ProfileProps> = ({ userData, profileData }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch profile data if not provided
  const {
    data: apiProfileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: () => api.get("/api/employees/me/profile").then((res) => res.data),
    enabled: !profileData,
  });

  // Use provided data or fetched data or fallback
  const employeeData = profileData ||
    apiProfileData || {
      personalInfo: {
        name: "Loading...",
        position: "-",
        department: "-",
        location: "-",
        email: "-",
        phone: "-",
        hireDate: "-",
        employmentType: "-",
        employeeId: "-",
        manager: "-",
        qualification: "-",
        bloodGroup: "-",
      },
      emergencyContacts: [],
      jobInfo: {
        title: "-",
        department: "-",
        reportsTo: "-",
        teamSize: 0,
        startDate: "-",
        employmentType: "-",
        workSchedule: "-",
        location: "-",
      },
      compensation: {
        salary: "-",
        bonus: "-",
        stockOptions: "-",
        lastIncrease: "-",
        nextReview: "-",
      },
      skills: [],
      documents: [],
    };

  if (isLoading && !profileData) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <Alert
        message="Error Loading Profile"
        description="Unable to load profile data. Please try again later."
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  const getEditProfilePath = () => {
    const currentPath = location.pathname;
    return `${currentPath}/edit`;
  };

  return (
    <S.PageContainer isDarkMode={isDarkMode}>
      <S.StyledCard bodyStyle={{ padding: 0 }} isDarkMode={isDarkMode}>
        <S.CoverSection
          bgImage={employeeData.personalInfo?.coverImage}
          isDarkMode={isDarkMode}
        />

        <S.ProfileCard isDarkMode={isDarkMode}>
          <S.ProfileContent>
            <S.UserInfoContainer align="flex-end">
              <S.AvatarContainer>
                <S.AvatarImage
                  size={140}
                  src={
                    employeeData.personalInfo?.avatar ||
                    "https://images.unsplash.com/photo-1580489944761-15a19d65463f?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                />
              </S.AvatarContainer>

              <S.UserInfo>
                <S.UserName level={2} isDarkMode={isDarkMode}>
                  {employeeData.personalInfo?.name || '-'}
                </S.UserName>
                <S.UserDetailsVertical>
                  <S.UserDetailItem>
                    <Briefcase size={18} color="#1890ff" />
                    <Text>{employeeData.personalInfo?.position || '-'}</Text>
                  </S.UserDetailItem>
                  <S.UserDetailItem>
                    <MapPin size={18} color="#ff4d4f" />
                    <Text>{employeeData.personalInfo?.location || '-'}</Text>
                  </S.UserDetailItem>
                </S.UserDetailsVertical>
              </S.UserInfo>

              <Button
                type="primary"
                icon={<Edit size={16} />}
                onClick={() => navigate(getEditProfilePath())}
              >
                Edit Profile
              </Button>
            </S.UserInfoContainer>

            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col xs={24} md={8}>
                <S.StyledCard isDarkMode={isDarkMode}>
                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Mail
                        size={16}
                        style={{ marginRight: 8, color: "#52c41a" }}
                      />
                      Email
                    </div>
                    <a
                      href={`mailto:${employeeData.personalInfo?.email || ''}`}
                      className="value"
                    >
                      {employeeData.personalInfo?.email || '-'}
                    </a>
                  </S.SideInfoItem>

                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Phone
                        size={16}
                        style={{ marginRight: 8, color: "#1890ff" }}
                      />
                      Phone
                    </div>
                    <a
                      href={`tel:${employeeData.personalInfo?.phone || ''}`}
                      className="value"
                    >
                      {employeeData.personalInfo?.phone || '-'}
                    </a>
                  </S.SideInfoItem>

                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Calendar
                        size={16}
                        style={{ marginRight: 8, color: "#faad14" }}
                      />
                      Hired on
                    </div>
                    <div className="value">
                      {employeeData.personalInfo?.hireDate || '-'}
                    </div>
                  </S.SideInfoItem>

                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Clock
                        size={16}
                        style={{ marginRight: 8, color: "#722ed1" }}
                      />
                      Employment type
                    </div>
                    <div className="value">
                      {employeeData.personalInfo?.employmentType || '-'}
                    </div>
                  </S.SideInfoItem>

                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Users
                        size={16}
                        style={{ marginRight: 8, color: "#13c2c2" }}
                      />
                      Employee ID
                    </div>
                    <div className="value">
                      {employeeData.personalInfo?.employeeId || '-'}
                    </div>
                  </S.SideInfoItem>

                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <User
                        size={16}
                        style={{ marginRight: 8, color: "#eb2f96" }}
                      />
                      Manager
                    </div>
                    <div className="value">
                      {employeeData.personalInfo?.manager || '-'}
                    </div>
                  </S.SideInfoItem>
                </S.StyledCard>
              </Col>

              <Col xs={24} md={16}>
                <S.StyledTabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  isDarkMode={isDarkMode}
                >
                  <TabPane
                    tab={
                      <span>
                        <User
                          size={16}
                          style={{ marginRight: 8, color: "#1890ff" }}
                        />
                        Personal
                      </span>
                    }
                    key="personal"
                  >
                    <S.StyledCard
                      title="Personal Information"
                      isDarkMode={isDarkMode}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Gender</div>
                            <div className="value">
                              {employeeData.personalInfo?.gender || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Date of Birth</div>
                            <div className="value">
                              {employeeData.personalInfo?.dateOfBirth || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Marital Status</div>
                            <div className="value">
                              {employeeData.personalInfo?.maritalStatus ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Blood Group</div>
                            <div className="value">
                              {employeeData.personalInfo?.bloodGroup || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Nationality</div>
                            <div className="value">
                              {employeeData.personalInfo?.nationality || "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Religion</div>
                            <div className="value">
                              {employeeData.personalInfo?.religion || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Languages Known</div>
                            <div className="value">
                              {employeeData.personalInfo?.languagesKnown ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Hobbies</div>
                            <div className="value">
                              {employeeData.personalInfo?.hobbies || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Address</div>
                            <div className="value">
                              {employeeData.personalInfo?.address || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Personal Email</div>
                            <div className="value">
                              {employeeData.personalInfo?.personalEmail ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                      </Row>
                    </S.StyledCard>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <Heart
                          size={16}
                          style={{ marginRight: 8, color: "#ff4d4f" }}
                        />
                        Emergency Contacts
                      </span>
                    }
                    key="emergency"
                  >
                    <S.StyledCard
                      title="Emergency Contact Information"
                      isDarkMode={isDarkMode}
                    >
                      {employeeData.personalInfo?.emergency_contact_name ||
                      employeeData.personalInfo?.emergencyContactName ? (
                        <Row gutter={16}>
                          <Col span={12}>
                            <S.SideInfoItem isDarkMode={isDarkMode}>
                              <div className="label">
                                <User
                                  size={16}
                                  style={{ marginRight: 8, color: "#1890ff" }}
                                />
                                Contact Name
                              </div>
                              <div className="value">
                                {employeeData.personalInfo
                                  ?.emergency_contact_name ||
                                  employeeData.personalInfo
                                    ?.emergencyContactName}
                              </div>
                            </S.SideInfoItem>
                            <S.SideInfoItem isDarkMode={isDarkMode}>
                              <div className="label">
                                <Heart
                                  size={16}
                                  style={{ marginRight: 8, color: "#ff4d4f" }}
                                />
                                Relationship
                              </div>
                              <div className="value">
                                {employeeData.personalInfo
                                  ?.emergency_contact_relationship ||
                                  employeeData.personalInfo
                                    ?.emergencyContactRelationship ||
                                  "-"}
                              </div>
                            </S.SideInfoItem>
                            <S.SideInfoItem isDarkMode={isDarkMode}>
                              <div className="label">
                                <Phone
                                  size={16}
                                  style={{ marginRight: 8, color: "#52c41a" }}
                                />
                                Mobile Number
                              </div>
                              <div className="value">
                                <a
                                  href={`tel:${
                                    employeeData.personalInfo
                                      ?.emergency_contact_phone ||
                                    employeeData.personalInfo
                                      ?.emergencyContactPhone
                                  }`}
                                >
                                  {employeeData.personalInfo
                                    ?.emergency_contact_phone ||
                                    employeeData.personalInfo
                                      ?.emergencyContactPhone}
                                </a>
                              </div>
                            </S.SideInfoItem>
                          </Col>
                          <Col span={12}>
                            <S.SideInfoItem isDarkMode={isDarkMode}>
                              <div className="label">
                                <Phone
                                  size={16}
                                  style={{ marginRight: 8, color: "#faad14" }}
                                />
                                Work Phone
                              </div>
                              <div className="value">
                                {employeeData.personalInfo
                                  ?.emergency_contact_work_phone ||
                                employeeData.personalInfo
                                  ?.emergencyContactWorkPhone ? (
                                  <a
                                    href={`tel:${
                                      employeeData.personalInfo
                                        ?.emergency_contact_work_phone ||
                                      employeeData.personalInfo
                                        ?.emergencyContactWorkPhone
                                    }`}
                                  >
                                    {employeeData.personalInfo
                                      ?.emergency_contact_work_phone ||
                                      employeeData.personalInfo
                                        ?.emergencyContactWorkPhone}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </S.SideInfoItem>
                            <S.SideInfoItem isDarkMode={isDarkMode}>
                              <div className="label">
                                <Phone
                                  size={16}
                                  style={{ marginRight: 8, color: "#722ed1" }}
                                />
                                Home Phone
                              </div>
                              <div className="value">
                                {employeeData.personalInfo
                                  ?.emergency_contact_home_phone ||
                                employeeData.personalInfo
                                  ?.emergencyContactHomePhone ? (
                                  <a
                                    href={`tel:${
                                      employeeData.personalInfo
                                        ?.emergency_contact_home_phone ||
                                      employeeData.personalInfo
                                        ?.emergencyContactHomePhone
                                    }`}
                                  >
                                    {employeeData.personalInfo
                                      ?.emergency_contact_home_phone ||
                                      employeeData.personalInfo
                                        ?.emergencyContactHomePhone}
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </S.SideInfoItem>
                            <S.SideInfoItem isDarkMode={isDarkMode}>
                              <div className="label">
                                <MapPin
                                  size={16}
                                  style={{ marginRight: 8, color: "#13c2c2" }}
                                />
                                Address
                              </div>
                              <div className="value">
                                {employeeData.personalInfo
                                  ?.emergency_contact_address ||
                                  employeeData.personalInfo
                                    ?.emergencyContactAddress ||
                                  "-"}
                              </div>
                            </S.SideInfoItem>
                          </Col>
                        </Row>
                      ) : (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                          <Heart
                            size={48}
                            color="#d9d9d9"
                            style={{ marginBottom: "16px" }}
                          />
                          <Text type="secondary">
                            No emergency contact information available
                          </Text>
                        </div>
                      )}
                    </S.StyledCard>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <Briefcase
                          size={16}
                          style={{ marginRight: 8, color: "#faad14" }}
                        />
                        Job
                      </span>
                    }
                    key="job"
                  >
                    <S.StyledCard
                      title="Job Information"
                      isDarkMode={isDarkMode}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Employment Status</div>
                            <div className="value">
                              {employeeData.jobInfo?.employmentStatus || '-'}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Work Location</div>
                            <div className="value">
                              {employeeData.jobInfo?.workLocation || '-'}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Team Size</div>
                            <div className="value">
                              {employeeData.jobInfo?.teamSize || 0} people
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Work Schedule</div>
                            <div className="value">
                              {employeeData.jobInfo?.workSchedule || '-'}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Qualification</div>
                            <div className="value">
                              {employeeData.personalInfo?.qualification ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Education Level</div>
                            <div className="value">
                              {employeeData.personalInfo?.educationLevel ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                      </Row>
                    </S.StyledCard>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <DollarSign
                          size={16}
                          style={{ marginRight: 8, color: "#52c41a" }}
                        />
                        Compensation
                      </span>
                    }
                    key="compensation"
                  >
                    <S.StyledCard
                      title="Compensation Details"
                      isDarkMode={isDarkMode}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Base Salary</div>
                            <div className="value">
                              {employeeData.compensation?.salary || '-'}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Bonus Target</div>
                            <div className="value">
                              {employeeData.compensation?.bonus || '-'}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Stock Options</div>
                            <div className="value">
                              {employeeData.compensation?.stockOptions || '-'}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Next Review</div>
                            <div className="value">
                              {employeeData.compensation?.nextReview || '-'}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                      </Row>
                    </S.StyledCard>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <Award
                          size={16}
                          style={{ marginRight: 8, color: "#722ed1" }}
                        />
                        Education & Skills
                      </span>
                    }
                    key="education"
                  >
                    <S.StyledCard
                      title="Education & Skills"
                      isDarkMode={isDarkMode}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">University</div>
                            <div className="value">
                              {employeeData.personalInfo?.university || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Graduation Year</div>
                            <div className="value">
                              {employeeData.personalInfo?.graduationYear ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Certifications</div>
                            <div className="value">
                              {employeeData.personalInfo?.certifications ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Skills Summary</div>
                            <div className="value">
                              {employeeData.personalInfo?.skillsSummary ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                      </Row>
                      <div style={{ marginTop: 16 }}>
                        <Text strong>Technical Skills:</Text>
                        <div style={{ marginTop: 8 }}>
                          {employeeData?.personalInfo?.technical_skills && employeeData.personalInfo.technical_skills.length > 0 ? (
                            employeeData.personalInfo.technical_skills.map((skill: string, index: number) => (
                              <Tag key={index} style={{ margin: '4px' }}>
                                {skill}
                              </Tag>
                            ))
                          ) : (
                            <Text type="secondary">No technical skills listed</Text>
                          )}
                        </div>
                      </div>
                    </S.StyledCard>
                  </TabPane>
                </S.StyledTabs>
              </Col>
            </Row>
          </S.ProfileContent>
        </S.ProfileCard>
      </S.StyledCard>
    </S.PageContainer>
  );
};

export default Profile;
