'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReports, RoomUsageReport, UserActivityReport, TimeSlotUsageReport, BuildingUsageReport, DailyBookingReport, DeviceUsageReport } from '../../context/ReportContext';
import AdminLayout from '@/app/admin/components/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import styles from './reports.module.css';

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const reports = useReports();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Report state
  const [activeReportType, setActiveReportType] = useState('room-usage');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter state
  const [buildingFilter, setBuildingFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');

  // Kiểm tra đăng nhập được xử lý bởi AdminLayout
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.replace('/login');
    }
  }, [user, isLoading]);

  // Set default date range to current month
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);

  // Get report data based on active report type
  const getReportData = () => {
    try {
      let data: any[] = [];

      switch (activeReportType) {
        case 'room-usage': {
          data = reports.getRoomUsageReport(startDate, endDate);
          // Lọc theo tòa nhà nếu có
          if (buildingFilter) {
            data = data.filter(item => item.building === buildingFilter);
          }
          break;
        }
        case 'user-activity': {
          data = reports.getUserActivityReport(startDate, endDate);
          // Lọc theo người dùng nếu có
          if (userFilter) {
            data = data.filter(item => item.userId === userFilter);
          }
          break;
        }
        case 'time-slot-usage': {
          data = reports.getTimeSlotUsageReport(startDate, endDate);
          break;
        }
        case 'building-usage': {
          data = reports.getBuildingUsageReport(startDate, endDate);
          break;
        }
        case 'daily-booking': {
          data = reports.getDailyBookingReport(startDate, endDate);
          break;
        }
        case 'device-usage': {
          data = reports.getDeviceUsageReport();
          // Lọc theo loại thiết bị nếu có
          if (deviceFilter) {
            data = data.filter(item => item.category === deviceFilter);
          }
          break;
        }
        default:
          data = [];
      }

      return data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu báo cáo:', error);
      return [];
    }
  };

  // Handle export report
  const handleExportReport = () => {
    try {
      const reportData = getReportData();
      if (reportData.length === 0) {
        alert('Không có dữ liệu để xuất báo cáo');
        return;
      }

      const csvContent = reports.exportReportToCSV(activeReportType, reportData);

      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeReportType}-report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Lỗi khi xuất báo cáo:', error);
      alert('Có lỗi xảy ra khi xuất báo cáo');
    }
  };

  // Render report content based on active report type
  const renderReportContent = () => {
    const reportData = getReportData();

    if (reportData.length === 0) {
      return (
        <div className={styles.emptyState}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.emptyStateIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>Không có dữ liệu báo cáo</h3>
          <p>Không tìm thấy dữ liệu báo cáo cho khoảng thời gian đã chọn.</p>
        </div>
      );
    }

    switch (activeReportType) {
      case 'room-usage':
        return renderRoomUsageReport(reportData);
      case 'user-activity':
        return renderUserActivityReport(reportData);
      case 'time-slot-usage':
        return renderTimeSlotUsageReport(reportData);
      case 'building-usage':
        return renderBuildingUsageReport(reportData);
      case 'daily-booking':
        return renderDailyBookingReport(reportData);
      case 'device-usage':
        return renderDeviceUsageReport(reportData);
      default:
        return null;
    }
  };

  // Render room usage report
  const renderRoomUsageReport = (data: RoomUsageReport[]) => {
    return (
      <>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng số phòng</h3>
            <p className={styles.summaryValue}>{data.length}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng lượt đặt phòng</h3>
            <p className={styles.summaryValue}>{data.reduce((sum: number, item: RoomUsageReport) => sum + item.totalBookings, 0)}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tỷ lệ sử dụng trung bình</h3>
            <p className={styles.summaryValue}>
              {data.length > 0
                ? (data.reduce((sum: number, item: RoomUsageReport) => sum + item.usageRate, 0) / data.length).toFixed(2)
                : '0.00'}%
            </p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Phòng</th>
                <th>Tòa nhà</th>
                <th>Tổng lượt đặt</th>
                <th>Đã duyệt</th>
                <th>Từ chối</th>
                <th>Đã hủy</th>
                <th>Đang chờ</th>
                <th>Tỷ lệ sử dụng</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.roomId}>
                  <td>{item.roomName}</td>
                  <td>{item.building}</td>
                  <td>{item.totalBookings}</td>
                  <td>{item.approvedBookings}</td>
                  <td>{item.rejectedBookings}</td>
                  <td>{item.cancelledBookings}</td>
                  <td>{item.pendingBookings}</td>
                  <td>{item.usageRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // Render user activity report
  const renderUserActivityReport = (data: UserActivityReport[]) => {
    return (
      <>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng số người dùng</h3>
            <p className={styles.summaryValue}>{data.length}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng lượt đặt phòng</h3>
            <p className={styles.summaryValue}>{data.reduce((sum: number, item: UserActivityReport) => sum + item.totalBookings, 0)}</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Vai trò</th>
                <th>Tổng lượt đặt</th>
                <th>Đã duyệt</th>
                <th>Từ chối</th>
                <th>Đã hủy</th>
                <th>Đang chờ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: UserActivityReport) => (
                <tr key={item.userId}>
                  <td>{item.userName}</td>
                  <td>{item.role}</td>
                  <td>{item.totalBookings}</td>
                  <td>{item.approvedBookings}</td>
                  <td>{item.rejectedBookings}</td>
                  <td>{item.cancelledBookings}</td>
                  <td>{item.pendingBookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // Render time slot usage report
  const renderTimeSlotUsageReport = (data: TimeSlotUsageReport[]) => {
    return (
      <>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng số khung giờ</h3>
            <p className={styles.summaryValue}>{data.length}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng lượt đặt phòng</h3>
            <p className={styles.summaryValue}>{data.reduce((sum: number, item: TimeSlotUsageReport) => sum + item.totalBookings, 0)}</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Khung giờ</th>
                <th>Tổng lượt đặt</th>
                <th>Đã duyệt</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: TimeSlotUsageReport, index: number) => (
                <tr key={index}>
                  <td>{item.timeSlot}</td>
                  <td>{item.totalBookings}</td>
                  <td>{item.approvedBookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // Render building usage report
  const renderBuildingUsageReport = (data: BuildingUsageReport[]) => {
    return (
      <>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng số tòa nhà</h3>
            <p className={styles.summaryValue}>{data.length}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng số phòng</h3>
            <p className={styles.summaryValue}>{data.reduce((sum: number, item: BuildingUsageReport) => sum + item.totalRooms, 0)}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng lượt đặt phòng</h3>
            <p className={styles.summaryValue}>{data.reduce((sum: number, item: BuildingUsageReport) => sum + item.totalBookings, 0)}</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Tòa nhà</th>
                <th>Số phòng</th>
                <th>Tổng lượt đặt</th>
                <th>Tỷ lệ sử dụng</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: BuildingUsageReport, index: number) => (
                <tr key={index}>
                  <td>{item.building}</td>
                  <td>{item.totalRooms}</td>
                  <td>{item.totalBookings}</td>
                  <td>{item.usageRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // Render daily booking report
  const renderDailyBookingReport = (data: DailyBookingReport[]) => {
    return (
      <>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng số ngày</h3>
            <p className={styles.summaryValue}>{data.length}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng lượt đặt phòng</h3>
            <p className={styles.summaryValue}>{data.reduce((sum: number, item: DailyBookingReport) => sum + item.totalBookings, 0)}</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Tổng lượt đặt</th>
                <th>Đã duyệt</th>
                <th>Từ chối</th>
                <th>Đã hủy</th>
                <th>Đang chờ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: DailyBookingReport, index: number) => (
                <tr key={index}>
                  <td>{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                  <td>{item.totalBookings}</td>
                  <td>{item.approvedBookings}</td>
                  <td>{item.rejectedBookings}</td>
                  <td>{item.cancelledBookings}</td>
                  <td>{item.pendingBookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // Render device usage report
  const renderDeviceUsageReport = (data: DeviceUsageReport[]) => {
    return (
      <>
        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng số thiết bị</h3>
            <p className={styles.summaryValue}>{data.length}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Tổng số lượng</h3>
            <p className={styles.summaryValue}>{data.reduce((sum: number, item: DeviceUsageReport) => sum + item.totalQuantity, 0)}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryCardTitle}>Số lượng khả dụng</h3>
            <p className={styles.summaryValue}>{data.reduce((sum: number, item: DeviceUsageReport) => sum + item.availableQuantity, 0)}</p>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Thiết bị</th>
                <th>Loại</th>
                <th>Tổng số lượng</th>
                <th>Số lượng khả dụng</th>
                <th>Tỷ lệ sử dụng</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: DeviceUsageReport) => (
                <tr key={item.deviceId}>
                  <td>{item.deviceName}</td>
                  <td>{item.category}</td>
                  <td>{item.totalQuantity}</td>
                  <td>{item.availableQuantity}</td>
                  <td>{item.usageRate.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  if (isLoading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <AdminLayout requiredPermission="admin.reports">
      <div className={styles.reportsContainer}>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          <div className={styles.pageHeader}>
            <div>
              <h2 className={styles.pageTitle}>Báo cáo và thống kê</h2>
              <p className={styles.pageBreadcrumb}>
                <Link href="/admin">Trang chủ</Link> / Báo cáo
              </p>
            </div>
            <button className={styles.exportButton} onClick={handleExportReport}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSmall} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Xuất báo cáo
            </button>
          </div>

          <div className={styles.reportControls}>
            <div className={styles.reportTypeSelector}>
              <button
                className={`${styles.reportTypeButton} ${activeReportType === 'room-usage' ? styles.active : ''}`}
                onClick={() => setActiveReportType('room-usage')}
              >
                Sử dụng phòng
              </button>
              <button
                className={`${styles.reportTypeButton} ${activeReportType === 'user-activity' ? styles.active : ''}`}
                onClick={() => setActiveReportType('user-activity')}
              >
                Hoạt động người dùng
              </button>
              <button
                className={`${styles.reportTypeButton} ${activeReportType === 'time-slot-usage' ? styles.active : ''}`}
                onClick={() => setActiveReportType('time-slot-usage')}
              >
                Khung giờ
              </button>
              <button
                className={`${styles.reportTypeButton} ${activeReportType === 'building-usage' ? styles.active : ''}`}
                onClick={() => setActiveReportType('building-usage')}
              >
                Tòa nhà
              </button>
              <button
                className={`${styles.reportTypeButton} ${activeReportType === 'daily-booking' ? styles.active : ''}`}
                onClick={() => setActiveReportType('daily-booking')}
              >
                Đặt phòng theo ngày
              </button>
              <button
                className={`${styles.reportTypeButton} ${activeReportType === 'device-usage' ? styles.active : ''}`}
                onClick={() => setActiveReportType('device-usage')}
              >
                Sử dụng thiết bị
              </button>
            </div>

            <div className={styles.filterControls}>
              <div className={styles.filterGroup}>
                <label htmlFor="startDate">Từ ngày:</label>
                <input
                  type="date"
                  id="startDate"
                  className={styles.dateInput}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className={styles.filterGroup}>
                <label htmlFor="endDate">Đến ngày:</label>
                <input
                  type="date"
                  id="endDate"
                  className={styles.dateInput}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Additional filters based on report type */}
              {activeReportType === 'room-usage' && (
                <div className={styles.filterGroup}>
                  <label htmlFor="buildingFilter">Tòa nhà:</label>
                  <select
                    id="buildingFilter"
                    className={styles.selectInput}
                    value={buildingFilter}
                    onChange={(e) => setBuildingFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="H1">H1</option>
                    <option value="H2">H2</option>
                    <option value="H3">H3</option>
                    <option value="H6">H6</option>
                  </select>
                </div>
              )}

              {activeReportType === 'device-usage' && (
                <div className={styles.filterGroup}>
                  <label htmlFor="deviceFilter">Loại thiết bị:</label>
                  <select
                    id="deviceFilter"
                    className={styles.selectInput}
                    value={deviceFilter}
                    onChange={(e) => setDeviceFilter(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="Máy chiếu">Máy chiếu</option>
                    <option value="Máy tính">Máy tính</option>
                    <option value="Âm thanh">Âm thanh</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className={styles.reportPanel}>
            <div className={styles.reportHeader}>
              <h3 className={styles.reportTitle}>
                {activeReportType === 'room-usage' && 'Báo cáo sử dụng phòng học'}
                {activeReportType === 'user-activity' && 'Báo cáo hoạt động người dùng'}
                {activeReportType === 'time-slot-usage' && 'Báo cáo sử dụng khung giờ'}
                {activeReportType === 'building-usage' && 'Báo cáo sử dụng tòa nhà'}
                {activeReportType === 'daily-booking' && 'Báo cáo đặt phòng theo ngày'}
                {activeReportType === 'device-usage' && 'Báo cáo sử dụng thiết bị'}
              </h3>
              <p className={styles.reportDescription}>
                {startDate && endDate ? `Dữ liệu từ ${startDate} đến ${endDate}` : 'Tất cả dữ liệu'}
              </p>
            </div>

            <div className={styles.reportBody}>
              {renderReportContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
    </AdminLayout>
  );
}
