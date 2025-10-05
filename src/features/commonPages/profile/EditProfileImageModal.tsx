import React, { useState, useRef, useCallback } from 'react';
import { Modal, Button, Upload, Slider, Row, Col, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTheme } from '../../../contexts/ThemeContext';
import styled from 'styled-components';

const ModalContainer = styled.div<{ isDarkMode: boolean }>`
  .ant-modal-content {
    background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
    color: ${props => props.isDarkMode ? 'white' : 'inherit'};
  }
  
  .ant-modal-header {
    background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
  }
  
  .ant-modal-title {
    color: ${props => props.isDarkMode ? 'white' : 'inherit'};
  }
`;

const ImagePreviewContainer = styled.div<{ isDarkMode: boolean }>`
  border: 2px dashed ${props => props.isDarkMode ? '#434343' : '#d9d9d9'};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 16px;
  background: ${props => props.isDarkMode ? '#2a2a2a' : '#fafafa'};
`;

const CoverImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-bottom: 16px;
`;

const CoverImage = styled.img<{ offsetY: number; isDragging?: boolean }>`
  width: 100%;
  height: auto;
  min-height: 100%;
  object-fit: cover;
  transform: translateY(${props => props.offsetY}px);
  transition: ${props => props.isDragging ? 'none' : 'transform 0.3s ease'};
  cursor: grab;
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
`;



const CropContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #1890ff;
  margin: 0 auto 16px;
  background: transparent;
`;

const CropImage = styled.img<{ scale: number; offsetX: number; offsetY: number; isDragging?: boolean }>`
  width: ${props => 200 * props.scale}px;
  height: ${props => 200 * props.scale}px;
  object-fit: cover;
  position: absolute;
  left: ${props => props.offsetX}px;
  top: ${props => props.offsetY}px;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  user-select: none;
  transition: ${props => props.isDragging ? 'none' : 'transform 0.2s ease'};
`;



const SliderContainer = styled.div<{ isDarkMode: boolean; hideRail?: boolean }>`
  margin: 16px 0;
  
  .ant-slider {
    .ant-slider-rail {
      background: ${props => props.hideRail ? 'transparent' : props.isDarkMode ? '#434343' : '#f5f5f5'};
    }
    
    .ant-slider-track {
      background: #1890ff;
    }
    
    .ant-slider-handle {
      border-color: #1890ff;
    }
  }
`;

const ControlLabel = styled.div<{ isDarkMode: boolean }>`
  color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#666'};
  margin-bottom: 8px;
  font-weight: 500;
`;

interface EditProfileImageModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (profileImage: string | null, coverImage: string | null, coverOffset?: number, profileCrop?: { scale: number; offsetX: number; offsetY: number }) => void;
  loading?: boolean;
  currentProfileImage?: string;
  currentCoverImage?: string;
}

const EditProfileImageModal: React.FC<EditProfileImageModalProps> = ({
  visible,
  onCancel,
  onSave,
  loading = false,
  currentProfileImage,
  currentCoverImage
}) => {
  const { isDarkMode } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  // Reset state when modal opens
  React.useEffect(() => {
    if (visible) {
      setProfileImage(currentProfileImage || null);
      setCoverImage(currentCoverImage || null);
      setProfileScale(1);
      setProfileOffsetX(0);
      setProfileOffsetY(0);
      setCoverImageOffset(0);
    }
  }, [visible, currentProfileImage, currentCoverImage]);
  const [profileImageOffset, setProfileImageOffset] = useState(0);
  const [coverImageOffset, setCoverImageOffset] = useState(0);
  const [profileScale, setProfileScale] = useState(1);
  const [profileOffsetX, setProfileOffsetX] = useState(0);
  const [profileOffsetY, setProfileOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });


  const profileFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((file: File, type: 'profile' | 'cover') => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      message.error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return false;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      message.error('Image size should be less than 5MB');
      return false;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'profile') {
        setProfileImage(result);
        setProfileImageOffset(0);
        setProfileScale(1);
        setProfileOffsetX(0);
        setProfileOffsetY(0);
        setIsDraggingProfile(false);
      } else {
        setCoverImage(result);
        setCoverImageOffset(0);
      }
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload
  }, []);

  const handleDeleteImage = (type: 'profile' | 'cover') => {
    if (type === 'profile') {
      setProfileImage(null);
      setProfileImageOffset(0);
      setProfileScale(1);
      setProfileOffsetX(0);
      setProfileOffsetY(0);
    } else {
      setCoverImage(null);
      setCoverImageOffset(0);
    }
  };

  const handleSave = () => {
    const profileCrop = profileImage ? {
      scale: profileScale,
      offsetX: profileOffsetX,
      offsetY: profileOffsetY
    } : undefined;
    onSave(profileImage, coverImage, coverImageOffset, profileCrop);
  };

  const handleCancel = () => {
    // Reset to original values
    setProfileImage(currentProfileImage || null);
    setCoverImage(currentCoverImage || null);
    setProfileImageOffset(0);
    setCoverImageOffset(0);
    setProfileScale(1);
    setProfileOffsetX(0);
    setProfileOffsetY(0);
    setIsDraggingProfile(false);
    onCancel();
  };

  // Cover image drag handlers
  const handleCoverMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientY, y: coverImageOffset });
  };

  const handleCoverMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStart.x;
    const img = document.querySelector('.cover-image') as HTMLImageElement;
    if (!img) return;
    
    const containerHeight = 150;
    const imgHeight = img.offsetHeight;
    
    // Calculate max offset to prevent empty space
    const maxOffset = Math.max(0, imgHeight - containerHeight);
    
    // Constrain movement to prevent showing empty space
    const newOffset = Math.max(-maxOffset, Math.min(0, dragStart.y + deltaY));
    setCoverImageOffset(newOffset);
  }, [isDragging, dragStart]);

  const handleCoverMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Profile image drag handlers
  const handleProfileMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragStart({ 
      x: e.clientX - profileOffsetX, 
      y: e.clientY - profileOffsetY 
    });
    setIsDraggingProfile(true);
  };

  const handleProfileMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingProfile) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate bounds to prevent white space
    const imageSize = 200 * profileScale;
    const containerSize = 200;
    
    if (imageSize <= containerSize) {
      setProfileOffsetX(0);
      setProfileOffsetY(0);
    } else {
      // Ensure image edges never go inside container
      const minX = -(imageSize - containerSize);
      const maxX = 0;
      const minY = -(imageSize - containerSize);
      const maxY = 0;
      
      setProfileOffsetX(Math.max(minX, Math.min(maxX, newX)));
      setProfileOffsetY(Math.max(minY, Math.min(maxY, newY)));
    }
  }, [isDraggingProfile, dragStart, profileScale]);

  const handleProfileMouseUp = useCallback(() => {
    setIsDraggingProfile(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleCoverMouseMove);
      document.addEventListener('mouseup', handleCoverMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleCoverMouseMove);
        document.removeEventListener('mouseup', handleCoverMouseUp);
      };
    }
  }, [isDragging, handleCoverMouseMove, handleCoverMouseUp]);

  React.useEffect(() => {
    if (isDraggingProfile) {
      document.addEventListener('mousemove', handleProfileMouseMove);
      document.addEventListener('mouseup', handleProfileMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleProfileMouseMove);
        document.removeEventListener('mouseup', handleProfileMouseUp);
      };
    }
  }, [isDraggingProfile, handleProfileMouseMove, handleProfileMouseUp]);

  return (
    <ModalContainer isDarkMode={isDarkMode}>
      <Modal
        title="Edit Profile Images"
        open={visible}
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" loading={loading} onClick={handleSave}>
            Save Changes
          </Button>
        ]}
      >
        <Row gutter={24}>
          {/* Cover Image Section */}
          <Col span={24}>
            <ControlLabel isDarkMode={isDarkMode}>Cover Image</ControlLabel>
            <CoverImageContainer>
              {coverImage ? (
                <CoverImage 
                  className="cover-image"
                  src={coverImage} 
                  alt="Cover" 
                  offsetY={coverImageOffset}
                  isDragging={isDragging}
                  onMouseDown={handleCoverMouseDown}
                  draggable={false}
                />
              ) : (
                <ImagePreviewContainer isDarkMode={isDarkMode}>
                  <div>No cover image selected</div>
                </ImagePreviewContainer>
              )}
            </CoverImageContainer>
            
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <Upload
                beforeUpload={(file) => handleImageUpload(file, 'cover')}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} style={{ marginRight: 8 }}>
                  {coverImage ? 'Change Cover Image' : 'Upload Cover Image'}
                </Button>
              </Upload>
              {coverImage && (
                <Button 
                  icon={<DeleteOutlined />} 
                  danger 
                  onClick={() => handleDeleteImage('cover')}
                >
                  Remove Cover
                </Button>
              )}
            </div>
          </Col>

          {/* Profile Image Section */}
          <Col span={24}>
            <ControlLabel isDarkMode={isDarkMode}>Profile Image</ControlLabel>
            <CropContainer className="crop-container">
              {profileImage ? (
                <>
                  <CropImage 
                    src={profileImage} 
                    alt="Profile" 
                    scale={profileScale}
                    offsetX={profileOffsetX}
                    offsetY={profileOffsetY}
                    isDragging={isDraggingProfile}
                    onMouseDown={handleProfileMouseDown}
                    draggable={false}
                  />

                </>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#999'
                }}>
                  No image
                </div>
              )}
            </CropContainer>
            
            {profileImage && (
              <>
                <SliderContainer isDarkMode={isDarkMode}>
                  <ControlLabel isDarkMode={isDarkMode}>Zoom</ControlLabel>
                  <Slider
                    min={1}
                    max={3}
                    step={0.1}
                    value={profileScale}
                    onChange={setProfileScale}
                    tooltip={{ formatter: (value) => `${Math.round((value || 1) * 100)}%` }}
                  />
                </SliderContainer>
                <div style={{ textAlign: 'center', marginBottom: 16, color: isDarkMode ? 'rgba(255,255,255,0.65)' : '#666' }}>
                  Drag the image to reposition within the circle
                </div>
              </>
            )}
            
            <div style={{ textAlign: 'center' }}>
              <Upload
                beforeUpload={(file) => handleImageUpload(file, 'profile')}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} style={{ marginRight: 8 }}>
                  {profileImage ? 'Change Profile Image' : 'Upload Profile Image'}
                </Button>
              </Upload>
              {profileImage && (
                <Button 
                  icon={<DeleteOutlined />} 
                  danger 
                  onClick={() => handleDeleteImage('profile')}
                >
                  Remove Profile
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Modal>
    </ModalContainer>
  );
};

export default EditProfileImageModal;