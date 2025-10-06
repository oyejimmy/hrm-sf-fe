import { DATE_FORMATS } from '../../../../constants';
import dayjs from 'dayjs';

export const generateLeavePDF = async (formData: any, employeeDetails: any, leaveBalances: any[]) => {
  console.log('Employee Details:', employeeDetails);
  
  const jsPDF = (await import('jspdf')).default;
  const doc = new jsPDF();

  try {
    const logoImg = new Image();
    logoImg.onload = () => {
      generatePDFWithLogo(doc, formData, employeeDetails, leaveBalances, logoImg);
    };
    logoImg.onerror = () => {
      generatePDFWithoutLogo(doc, formData, employeeDetails, leaveBalances);
    };
    logoImg.src = '/logo.png';
  } catch (error) {
    console.error('Error loading logo:', error);
    generatePDFWithoutLogo(doc, formData, employeeDetails, leaveBalances);
  }
};

const generatePDFWithLogo = (doc: any, formData: any, employeeDetails: any, leaveBalances: any[], logoImg: HTMLImageElement) => {
  // Header with logo on right
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Annual Leave Application Form', 20, 25);
  
  // Add logo on right
  doc.addImage(logoImg, 'PNG', 170, 10, 30, 15);
  
  // Employee details table
  let yPos = 50;
  doc.setFontSize(10);
  const employeeData = [
    ['Employee Name:', employeeDetails?.name || employeeDetails?.first_name || employeeDetails?.email || 'John Doe'],
    ['Employee Designation:', employeeDetails?.position || employeeDetails?.job_title || employeeDetails?.title || 'Software Engineer'],
    ['Reporting Manager:', employeeDetails?.manager || employeeDetails?.supervisor || 'Manager Name'],
    ['Type Of Leaves Requested:', formData.type],
    ['Dates of leave requested (Exact):', `${dayjs(formData.dates[0]).format(DATE_FORMATS.DISPLAY) || ''} to ${dayjs(formData.dates[1]).format(DATE_FORMATS.DISPLAY) || ''}`],
  ];
  
  employeeData.forEach(([label, value]) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    
    const valueLines = doc.splitTextToSize(value, 85);
    const rowHeight = Math.max(12, valueLines.length * 6 + 6);
    
    doc.rect(20, yPos - 6, 170, rowHeight);
    doc.line(100, yPos - 6, 100, yPos - 6 + rowHeight);
    
    doc.setFont('helvetica', 'bold');
    doc.text(label, 22, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(valueLines, 102, yPos - 2);
    yPos += rowHeight;
  });
  
  // Reason field with dynamic height
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  
  const reasonLines = doc.splitTextToSize(formData.reason, 75);
  const reasonHeight = Math.max(24, reasonLines.length * 6 + 12);
  
  doc.rect(20, yPos - 6, 170, reasonHeight);
  doc.line(100, yPos - 6, 100, yPos - 6 + reasonHeight);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Reason of leave:', 22, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(reasonLines, 102, yPos - 2);
  yPos += reasonHeight;
  
  generateCommonPDFContent(doc, yPos, leaveBalances);
};

const generatePDFWithoutLogo = (doc: any, formData: any, employeeDetails: any, leaveBalances: any[]) => {
  // Header without logo
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Annual Leave Application Form', 20, 25);
  
  // Employee details table
  let yPos = 50;
  doc.setFontSize(10);
  const employeeData = [
    ['Employee Name:', employeeDetails?.name || employeeDetails?.first_name || employeeDetails?.email || 'John Doe'],
    ['Employee Designation:', employeeDetails?.position || employeeDetails?.job_title || employeeDetails?.title || 'Software Engineer'],
    ['Reporting Manager:', employeeDetails?.manager || employeeDetails?.supervisor || 'Manager Name'],
    ['Type Of Leaves Requested:', formData.type],
    ['Dates of leave requested (Exact):', `${dayjs(formData.dates[0]).format(DATE_FORMATS.DISPLAY) || ''} to ${dayjs(formData.dates[1]).format(DATE_FORMATS.DISPLAY) || ''}`],
  ];
  
  employeeData.forEach(([label, value]) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    
    const valueLines = doc.splitTextToSize(value, 95);
    const rowHeight = Math.max(12, valueLines.length * 6 + 6);
    
    doc.rect(20, yPos - 6, 170, rowHeight);
    doc.line(90, yPos - 6, 90, yPos - 6 + rowHeight);
    
    doc.setFont('helvetica', 'bold');
    doc.text(label, 22, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(valueLines, 92, yPos - 2);
    yPos += rowHeight;
  });
  
  // Reason field with dynamic height
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  
  const reasonLines = doc.splitTextToSize(formData.reason, 85);
  const reasonHeight = Math.max(24, reasonLines.length * 6 + 12);
  
  doc.rect(20, yPos - 6, 170, reasonHeight);
  doc.line(90, yPos - 6, 90, yPos - 6 + reasonHeight);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Reason of leave:', 22, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(reasonLines, 92, yPos - 2);
  yPos += reasonHeight;
  
  generateCommonPDFContent(doc, yPos, leaveBalances);
};

const generateCommonPDFContent = (doc: any, yPos: number, leaveBalances: any[]) => {
  // Signatures section
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Signatures of Applicant', 120, yPos);
  
  yPos += 20;
  
  // Pre-owned Leave Balance section (full width)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Pre-owned Leave Balance', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(9);
  // Leave balance table header (full width)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(20, yPos - 5, 170, 10);
  doc.line(76.67, yPos - 5, 76.67, yPos + 5);
  doc.line(133.33, yPos - 5, 133.33, yPos + 5);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Annual', 48, yPos);
  doc.text('Sick', 105, yPos);
  doc.text('Casual', 162, yPos);
  
  yPos += 10;
  // Leave balance values (full width)
  doc.rect(20, yPos - 5, 170, 10);
  doc.line(76.67, yPos - 5, 76.67, yPos + 5);
  doc.line(133.33, yPos - 5, 133.33, yPos + 5);
  
  doc.setFont('helvetica', 'normal');
  const annualBalance = leaveBalances?.find(b => b.type === 'Annual')?.remaining || 0;
  const sickBalance = leaveBalances?.find(b => b.type === 'Sick')?.remaining || 0;
  const casualBalance = leaveBalances?.find(b => b.type === 'Casual')?.remaining || 0;
  
  doc.text(annualBalance.toString(), 53, yPos);
  doc.text(sickBalance.toString(), 110, yPos);
  doc.text(casualBalance.toString(), 167, yPos);
  
  // Available Leave Balance section (full width)
  yPos += 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Available Leave Balance (to be filled by HR Officer)', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(9);
  // Available balance table header (full width)
  doc.rect(20, yPos - 5, 170, 10);
  doc.line(76.67, yPos - 5, 76.67, yPos + 5);
  doc.line(133.33, yPos - 5, 133.33, yPos + 5);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Annual', 48, yPos);
  doc.text('Sick', 105, yPos);
  doc.text('Casual', 162, yPos);
  
  yPos += 10;
  // Available balance values (empty for HR to fill, full width)
  doc.rect(20, yPos - 5, 170, 10);
  doc.line(76.67, yPos - 5, 76.67, yPos + 5);
  doc.line(133.33, yPos - 5, 133.33, yPos + 5);
  
  // Approval section (centered)
  yPos += 25;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const approvalText = 'Approval by Immediate Supervisor';
  const textWidth = doc.getTextWidth(approvalText);
  const centerX = (210 - textWidth) / 2; // A4 width is 210mm
  doc.text(approvalText, centerX, yPos);
  doc.line(centerX, yPos + 2, centerX + textWidth, yPos + 2); // Underline
  
  yPos += 15;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Name: ____________________', 20, yPos);
  doc.text('Signature: ____________________', 105, yPos);
  
  yPos += 15;
  doc.text('Date: ____________________', 20, yPos);
  doc.text('Approved by Team Lead: ____________________', 105, yPos);
  
  yPos += 10;
  const formText = 'Leave request form';
  const formTextWidth = doc.getTextWidth(formText);
  const formCenterX = (210 - formTextWidth) / 2;
  doc.text(formText, formCenterX, yPos);
  
  // Save PDF
  doc.save(`Annual-Leave-Request-${new Date().toISOString().split('T')[0]}.pdf`);
};