import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../Nav/AdminNav';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [metricsData, setMetricsData] = useState(null);
    
    // Check if admin is logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/admin');
        }
    }, [navigate]);
    
    // Fetch dashboard data
    useEffect(() => {
        // This would be replaced with actual API calls
        setTimeout(() => {
            // Mock analytics data
            setAnalyticsData({
                userGrowth: [
                    { date: '2023-05-01', customers: 120, providers: 45 },
                    { date: '2023-06-01', customers: 148, providers: 58 },
                    { date: '2023-07-01', customers: 175, providers: 72 },
                ],
                userSessions: {
                    today: 145,
                    week: 876,
                    month: 3250
                },
                activityLogs: [
                    { id: 1, user: 'John Doe (Customer)', action: 'Login', timestamp: '2023-07-15 09:15:22' },
                    { id: 2, user: 'Robert Smith (Provider)', action: 'Updated Profile', timestamp: '2023-07-15 10:05:47' },
                    { id: 3, user: 'Jane Smith (Customer)', action: 'Posted Job', timestamp: '2023-07-15 11:30:10' },
                ]
            });
            
            // Mock metrics data
            setMetricsData({
                overview: {
                    totalUsers: 1325,
                    activeUsers: 985,
                    totalServices: 450,
                    completedJobs: 875,
                },
                topServices: [
                    { name: 'Plumbing', count: 87 },
                    { name: 'Electrical', count: 74 },
                    { name: 'Carpentry', count: 65 },
                ]
            });
            
            setLoading(false);
        }, 1000);
    }, []);
    
    return (
        <div>
            <AdminNav />
            <div style={styles.container}>
                <div style={styles.content}>
                    <h2>Welcome to the Admin Dashboard</h2>
                    <p>This is where you can manage your application.</p>
                    
                    {/* Main Navigation Cards */}
                    <div style={styles.cardContainer}>
                        <div style={styles.card} onClick={() => navigate('/admin/customers')}>
                            <h3>Customers</h3>
                            <p>Manage customer accounts</p>
                        </div>
                        <div style={styles.card} onClick={() => navigate('/admin/providers')}>
                            <h3>Service Providers</h3>
                            <p>Manage service providers</p>
                        </div>
                        <div style={styles.card} onClick={() => navigate('/admin/services')}>
                            <h3>Services</h3>
                            <p>Manage services</p>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div style={styles.loading}>Loading dashboard data...</div>
                    ) : (
                        <>
                            {/* Analytics Section */}
                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}>Analytics</h2>
                                
                                <div style={styles.metricsGrid}>
                                    {/* User Sessions Card */}
                                    <div style={styles.metricCard}>
                                        <h3>User Sessions</h3>
                                        <div style={styles.statsGrid}>
                                            <div style={styles.statItem}>
                                                <div style={styles.statValue}>{analyticsData.userSessions.today}</div>
                                                <div style={styles.statLabel}>Today</div>
                                            </div>
                                            <div style={styles.statItem}>
                                                <div style={styles.statValue}>{analyticsData.userSessions.week}</div>
                                                <div style={styles.statLabel}>This Week</div>
                                            </div>
                                            <div style={styles.statItem}>
                                                <div style={styles.statValue}>{analyticsData.userSessions.month}</div>
                                                <div style={styles.statLabel}>This Month</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* User Growth Card */}
                                    <div style={styles.metricCard}>
                                        <h3>User Growth</h3>
                                        <div style={styles.barChart}>
                                            {analyticsData.userGrowth.map((data, index) => (
                                                <div key={index} style={styles.barGroup}>
                                                    <div style={styles.barLabel}>{data.date.split('-')[1]}/{data.date.split('-')[0].slice(2)}</div>
                                                    <div style={styles.bars}>
                                                        <div style={{...styles.bar, height: `${data.customers/2}px`, backgroundColor: '#4CAF50'}}></div>
                                                        <div style={{...styles.bar, height: `${data.providers/2}px`, backgroundColor: '#2196F3'}}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={styles.legend}>
                                            <span><span style={styles.legendDot1}></span> Customers</span>
                                            <span><span style={styles.legendDot2}></span> Providers</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Recent Activity Table */}
                                <div style={styles.activitySection}>
                                    <h3>Recent Activity</h3>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Action</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analyticsData.activityLogs.map((log) => (
                                                <tr key={log.id}>
                                                    <td>{log.user}</td>
                                                    <td>{log.action}</td>
                                                    <td>{log.timestamp}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            {/* Performance Metrics Section */}
                            <div style={styles.section}>
                                <h2 style={styles.sectionTitle}>Performance Metrics</h2>
                                
                                {/* Overview Cards */}
                                <div style={styles.overviewGrid}>
                                    <div style={styles.overviewCard}>
                                        <h3 style={styles.overviewValue}>{metricsData.overview.totalUsers}</h3>
                                        <p style={styles.overviewLabel}>Total Users</p>
                                    </div>
                                    <div style={styles.overviewCard}>
                                        <h3 style={styles.overviewValue}>{metricsData.overview.activeUsers}</h3>
                                        <p style={styles.overviewLabel}>Active Users</p>
                                    </div>
                                    <div style={styles.overviewCard}>
                                        <h3 style={styles.overviewValue}>{metricsData.overview.totalServices}</h3>
                                        <p style={styles.overviewLabel}>Total Services</p>
                                    </div>
                                    <div style={styles.overviewCard}>
                                        <h3 style={styles.overviewValue}>{metricsData.overview.completedJobs}</h3>
                                        <p style={styles.overviewLabel}>Completed Jobs</p>
                                    </div>
                                </div>
                                
                                {/* Top Services */}
                                <div style={styles.topServicesCard}>
                                    <h3>Most Popular Services</h3>
                                    <div style={styles.servicesList}>
                                        {metricsData.topServices.map((service, index) => (
                                            <div key={index} style={styles.serviceItem}>
                                                <span>{service.name}</span>
                                                <div style={styles.serviceBar}>
                                                    <div 
                                                        style={{
                                                            ...styles.serviceBarFill, 
                                                            width: `${(service.count / metricsData.topServices[0].count) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <span>{service.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        paddingTop: '80px', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    content: {
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    cardContainer: {
        display: 'flex',
        gap: '20px',
        marginTop: '20px',
        flexWrap: 'wrap',
        marginBottom: '30px',
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        padding: '20px',
        minWidth: '200px',
        flex: '1',
        border: '1px solid #eee',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        ':hover': {
            transform: 'scale(1.02)',
        }
    },
    section: {
        marginTop: '40px',
        borderTop: '1px solid #eee',
        paddingTop: '20px',
    },
    sectionTitle: {
        color: '#333',
        marginBottom: '20px',
    },
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px',
    },
    metricCard: {
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    statsGrid: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '15px',
    },
    statItem: {
        textAlign: 'center',
    },
    statValue: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#0177cc',
    },
    statLabel: {
        color: '#666',
        fontSize: '0.9rem',
    },
    barChart: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: '150px',
        marginTop: '15px',
    },
    barGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    bars: {
        display: 'flex',
        gap: '4px',
        alignItems: 'flex-end',
        height: '100px',
    },
    bar: {
        width: '20px',
        borderRadius: '3px 3px 0 0',
    },
    barLabel: {
        marginTop: '5px',
        fontSize: '0.8rem',
        color: '#666',
    },
    legend: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '15px',
        fontSize: '0.9rem',
    },
    legendDot1: {
        display: 'inline-block',
        width: '12px',
        height: '12px',
        backgroundColor: '#4CAF50',
        borderRadius: '50%',
        marginRight: '5px',
    },
    legendDot2: {
        display: 'inline-block',
        width: '12px',
        height: '12px',
        backgroundColor: '#2196F3',
        borderRadius: '50%',
        marginRight: '5px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px',
    },
    activitySection: {
        marginTop: '20px',
    },
    overviewGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '25px',
    },
    overviewCard: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '4px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    overviewValue: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#0177cc',
        margin: '0 0 5px 0',
    },
    overviewLabel: {
        color: '#666',
        margin: 0,
    },
    topServicesCard: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    servicesList: {
        marginTop: '15px',
    },
    serviceItem: {
        display: 'grid',
        gridTemplateColumns: '100px 1fr 50px',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '8px',
    },
    serviceBar: {
        height: '10px',
        backgroundColor: '#e0e0e0',
        borderRadius: '5px',
        overflow: 'hidden',
    },
    serviceBarFill: {
        height: '100%',
        backgroundColor: '#0177cc',
    },
    loading: {
        textAlign: 'center',
        padding: '40px 0',
        color: '#666',
    },
};

export default AdminDashboard;
