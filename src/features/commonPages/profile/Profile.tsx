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
  message,
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
  Camera,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "../../../services/api/api";
import { profileApi } from "../../../services/api/profileApi";
import { DATE_FORMATS } from "../../../constants";
import dayjs from 'dayjs';
import EditProfileImageModal from './EditProfileImageModal';
import * as S from "./styles";
import CroppedAvatar from '../../../components/CroppedAvatar';

const { Text } = Typography;
const { TabPane } = Tabs;

interface ProfileProps {
  userData?: any;
  profileData?: any;
}

const Profile: React.FC<ProfileProps> = ({ userData, profileData }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data: { avatar: string | null; coverImage: string | null; coverOffset?: number; profileCrop?: { scale: number; offsetX: number; offsetY: number } }) => 
      profileApi.updateProfileImages(data),
    onSuccess: (response, variables) => {
      setIsImageModalVisible(false);
      message.success('Profile images updated successfully!');
      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({ queryKey: ['employee-profile'] });
      queryClient.refetchQueries({ queryKey: ['employee-profile'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update profile images');
    }
  });

  // Fetch profile data if not provided
  const {
    data: apiProfileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["employee-profile"],
    queryFn: () => api.get("/api/employees/me/profile").then((res: any) => res.data),
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

  const handleImageSave = (profileImage: string | null, coverImage: string | null, coverOffset?: number, profileCrop?: { scale: number; offsetX: number; offsetY: number }) => {
    updateProfileMutation.mutate({
      avatar: profileImage,
      coverImage: coverImage,
      coverOffset: coverOffset,
      profileCrop: profileCrop
    });
  };

  return (
    <S.PageContainer isDarkMode={isDarkMode}>
      <S.StyledCard bodyStyle={{ padding: 0 }} isDarkMode={isDarkMode}>
        <S.CoverSection
          bgImage={employeeData.personalInfo?.coverImage}
          isDarkMode={isDarkMode}
        >
          {employeeData.personalInfo?.coverImage && (
            <img 
              src={employeeData.personalInfo.coverImage} 
              alt="Cover" 
              style={{
                width: '100%',
                height: 'auto',
                minHeight: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translateY(${employeeData.personalInfo?.coverOffset || 0}px)`
              }}
            />
          )}
          <Button
            type="primary"
            icon={<Camera size={16} />}
            onClick={() => setIsImageModalVisible(true)}
            style={{ 
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(0, 0, 0, 0.6)',
              border: 'none',
              zIndex: 2
            }}
          >
            Edit Profile Image
          </Button>
        </S.CoverSection>

        <S.ProfileCard isDarkMode={isDarkMode}>
          <S.ProfileContent>
            <S.UserInfoContainer align="flex-end">
              <S.AvatarContainer>
                <CroppedAvatar 
                  size={140}
                  src={employeeData.personalInfo?.avatar}
                  crop={employeeData.personalInfo?.profileCrop}
                  onClick={() => setIsImageModalVisible(true)}
                />
                <S.AvatarEditOverlay onClick={() => setIsImageModalVisible(true)}>
                  <Camera size={16} color="white" />
                </S.AvatarEditOverlay>
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

            <S.TabContent gutter={24}>
              <S.ResponsiveCol xs={24} md={8}>
                <S.StyledCard isDarkMode={isDarkMode}>
                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <S.IconWrapper color="#52c41a">
                        <Mail size={16} />
                      </S.IconWrapper>
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
                      <S.IconWrapper color="#1890ff">
                        <Phone size={16} />
                      </S.IconWrapper>
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
                      <S.IconWrapper color="#faad14">
                        <Calendar size={16} />
                      </S.IconWrapper>
                      Hired on
                    </div>
                    <div className="value">
                      {employeeData.personalInfo?.hireDate || '-'}
                    </div>
                  </S.SideInfoItem>

                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <S.IconWrapper color="#722ed1">
                        <Clock size={16} />
                      </S.IconWrapper>
                      Employment type
                    </div>
                    <div className="value">
                      {employeeData.personalInfo?.employmentType || '-'}
                    </div>
                  </S.SideInfoItem>

                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <S.IconWrapper color="#13c2c2">
                        <Users size={16} />
                      </S.IconWrapper>
                      Employee ID
                    </div>
                    <div className="value">
                      {employeeData.personalInfo?.employeeId || '-'}
                    </div>
                  </S.SideInfoItem>

                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <S.IconWrapper color="#eb2f96">
                        <User size={16} />
                      </S.IconWrapper>
                      Manager
                    </div>
                    <div className="value">
                      {employeeData.personalInfo?.manager || '-'}
                    </div>
                  </S.SideInfoItem>

                  <S.SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <S.IconWrapper color="#13c2c2">
                        <MapPin size={16} />
                      </S.IconWrapper>
                      Office Address
                    </div>
                    <div className="value">
                      {employeeData.personalInfo?.office_address || '-'}
                    </div>
                  </S.SideInfoItem>
                </S.StyledCard>
              </S.ResponsiveCol>

              <S.ResponsiveCol xs={24} md={16}>
                <S.StyledTabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  isDarkMode={isDarkMode}
                >
                  <TabPane
                    tab={
                      <span>
                        <S.TabIcon color="#1890ff">
                          <User size={16} />
                        </S.TabIcon>
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
                            <div className="label">
                              <S.IconWrapper color="#eb2f96">
                                <User size={16} />
                              </S.IconWrapper>
                              Gender
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.gender || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#faad14">
                                <Calendar size={16} />
                              </S.IconWrapper>
                              Date of Birth
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.dateOfBirth || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#ff4d4f">
                                <Heart size={16} />
                              </S.IconWrapper>
                              Marital Status
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.maritalStatus ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#f50">
                                <Award size={16} />
                              </S.IconWrapper>
                              Blood Group
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.bloodGroup || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#1890ff">
                                <MapPin size={16} />
                              </S.IconWrapper>
                              Nationality
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.nationality || "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#722ed1">
                                <Award size={16} />
                              </S.IconWrapper>
                              Religion
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.religion || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#13c2c2">
                                <Users size={16} />
                              </S.IconWrapper>
                              Languages Known
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.languagesKnown ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#52c41a">
                                <Heart size={16} />
                              </S.IconWrapper>
                              Hobbies
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.hobbies || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#fa8c16">
                                <MapPin size={16} />
                              </S.IconWrapper>
                              Address
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.address || "-"}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#1890ff">
                                <Mail size={16} />
                              </S.IconWrapper>
                              Personal Email
                            </div>
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
                        <S.TabIcon color="#ff4d4f">
                          <Heart size={16} />
                        </S.TabIcon>
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
                        <S.TabIcon color="#faad14">
                          <Briefcase size={16} />
                        </S.TabIcon>
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
                            <div className="label">
                              <S.IconWrapper color="#52c41a">
                                <Briefcase size={16} />
                              </S.IconWrapper>
                              Employment Status
                            </div>
                            <div className="value">
                              {employeeData.jobInfo?.employmentStatus || '-'}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#1890ff">
                                <MapPin size={16} />
                              </S.IconWrapper>
                              Work Location
                            </div>
                            <div className="value">
                              {employeeData.jobInfo?.workLocation || '-'}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#13c2c2">
                                <Users size={16} />
                              </S.IconWrapper>
                              Team Size
                            </div>
                            <div className="value">
                              {employeeData.jobInfo?.teamSize || 0} people
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#faad14">
                                <Clock size={16} />
                              </S.IconWrapper>
                              Work Schedule
                            </div>
                            <div className="value">
                              {employeeData.jobInfo?.workSchedule || '-'}
                            </div>
                          </S.SideInfoItem>

                        </Col>
                      </Row>
                    </S.StyledCard>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <S.TabIcon color="#52c41a">
                          <DollarSign size={16} />
                        </S.TabIcon>
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
                            <div className="label">
                              <S.IconWrapper color="#52c41a">
                                <DollarSign size={16} />
                              </S.IconWrapper>
                              Base Salary
                            </div>
                            <div className="value">
                              {employeeData.compensation?.salary || '-'}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#faad14">
                                <Award size={16} />
                              </S.IconWrapper>
                              Bonus Target
                            </div>
                            <div className="value">
                              {employeeData.compensation?.bonus || '-'}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#722ed1">
                                <Briefcase size={16} />
                              </S.IconWrapper>
                              Stock Options
                            </div>
                            <div className="value">
                              {employeeData.compensation?.stockOptions || '-'}
                            </div>
                          </S.SideInfoItem>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#1890ff">
                                <Calendar size={16} />
                              </S.IconWrapper>
                              Next Review
                            </div>
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
                        <S.TabIcon color="#722ed1">
                          <Award size={16} />
                        </S.TabIcon>
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
                            <div className="label">
                              <S.IconWrapper color="#1890ff">
                                <Briefcase size={16} />
                              </S.IconWrapper>
                              University
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.university || "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#eb2f96">
                                <Award size={16} />
                              </S.IconWrapper>
                              Education Level
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.educationLevel ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#722ed1">
                                <Award size={16} />
                              </S.IconWrapper>
                              Qualification
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.qualification ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#faad14">
                                <Calendar size={16} />
                              </S.IconWrapper>
                              Graduation Year
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.graduationYear ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#52c41a">
                                <Award size={16} />
                              </S.IconWrapper>
                              Certifications
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.certifications ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <S.SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">
                              <S.IconWrapper color="#722ed1">
                                <Users size={16} />
                              </S.IconWrapper>
                              Skills Summary
                            </div>
                            <div className="value">
                              {employeeData.personalInfo?.skillsSummary ||
                                "-"}
                            </div>
                          </S.SideInfoItem>
                        </Col>
                      </Row>
                      <div style={{ marginTop: 16 }}>
                        <Text strong>Technical Skills</Text>
                        <div style={{ marginTop: 8 }}>
                          {employeeData?.personalInfo?.technical_skills ? (
                            Array.isArray(employeeData.personalInfo.technical_skills) ? (
                              employeeData.personalInfo.technical_skills.length > 0 ? (
                                employeeData.personalInfo.technical_skills.map((skill: string, index: number) => {
                                  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
                                  return (
                                    <Tag key={index} color={colors[index % colors.length]} style={{ margin: '4px' }}>
                                      {skill}
                                    </Tag>
                                  );
                                })
                              ) : (
                                <Text type="secondary">No technical skills listed</Text>
                              )
                            ) : (
                              Object.values(employeeData.personalInfo.technical_skills).length > 0 ? (
                                Object.values(employeeData.personalInfo.technical_skills).map((skill: any, index: number) => {
                                  const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
                                  return (
                                    <Tag key={index} color={colors[index % colors.length]} style={{ margin: '4px' }}>
                                      {skill}
                                    </Tag>
                                  );
                                })
                              ) : (
                                <Text type="secondary">No technical skills listed</Text>
                              )
                            )
                          ) : (
                            <Text type="secondary">No technical skills listed</Text>
                          )}
                        </div>
                      </div>
                    </S.StyledCard>
                  </TabPane>
                </S.StyledTabs>
              </S.ResponsiveCol>
            </S.TabContent>
          </S.ProfileContent>
        </S.ProfileCard>
      </S.StyledCard>
      
      <EditProfileImageModal
        visible={isImageModalVisible}
        onCancel={() => setIsImageModalVisible(false)}
        onSave={handleImageSave}
        loading={updateProfileMutation.isPending}
        currentProfileImage={employeeData.personalInfo?.avatar}
        currentCoverImage={employeeData.personalInfo?.coverImage}
      />
    </S.PageContainer>
  );
};

export default Profile;
