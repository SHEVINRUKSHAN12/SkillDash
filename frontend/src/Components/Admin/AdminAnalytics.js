import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../Nav/AdminNav';

const AdminAnalytics = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('week');
    const [analyticsData, setAnalyticsData] = useState({
        userGrowth: [],
        activityLogs: [],
        userSessions: { today: 0, week: 0, month: 0 },
        topServices: [],
        regionStats: []
    });
    
    // Check if admin is logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/admin');
        }
    }, [navigate]);
    
    // Fetch analytics data
    useEffect(() => {
        // This would be replaced with actual API calls
        setTimeout(() => {
            try {
                // Mock data
                const mockAnalyticsData = {
                    userGrowth: [
                        { date: '2023-05-01', customers: 120, providers: 45 },
                        { date: '2023-05-15', customers: 135, providers: 52 },
                        { date: '2023-06-01', customers: 148, providers: 58 },
                        { date: '2023-06-15', customers: 160, providers: 65 },
                        { date: '2023-07-01', customers: 175, providers: 72 },
                        { date: '2023-07-15', customers: 190, providers: 80 }
                    ],
                    activityLogs: [
                        { id: 1, user: 'John Doe (Customer)', action: 'Login', timestamp: '2023-07-15 09:15:22' },
                        { id: 2, user: 'Robert Smith (Provider)', action: 'Updated Profile', timestamp: '2023-07-15 10:05:47' },
                        { id: 3, user: 'Jane Smith (Customer)', action: 'Posted Job', timestamp: '2023-07-15 11:30:10' },
                        { id: 4, user: 'Lisa Johnson (Provider)', action: 'Added Service', timestamp: '2023-07-15 12:22:35' },
                        { id: 5, user: 'Mike Johnson (Customer)', action: 'Contacted Provider', timestamp: '2023-07-15 13:45:18' },
                        { id: 6, user: 'David Williams (Provider)', action: 'Responded to Job', timestamp: '2023-07-15 14:17:42' },
                        { id: 7, user: 'Sarah Williams (Customer)', action: 'Left Review', timestamp: '2023-07-15 15:09:15' },
                        { id: 8, user: 'Emma Brown (Provider)', action: 'Updated Service', timestamp: '2023-07-15 16:30:27' }
                    ],
                    userSessions: {
                        today: 145,
                        week: 876,
                        month: 3250
                    },
                    topServices: [
                        { name: 'Plumbing', count: 87 },
                        { name: 'Electrical', count: 74 },
                        { name: 'Carpentry', count: 65 },
                        { name: 'Cleaning', count: 52 },
                        { name: 'Painting', count: 41 }
                    ],
                    regionStats: [
                        { region: 'North', customers: 350, providers: 120 },
                        { region: 'South', customers: 275, providers: 95 },
                        { region: 'East', customers: 220, providers: 85 },
                        { region: 'West', customers: 300, providers: 110 },
                        { region: 'Central', customers: 180, providers: 70 }
                    ]
                };
                
                setAnalyticsData(mockAnalyticsData);
                setLoading(false);
            } catch (err) {
                setError("Failed to load analytics data. Please try again later.");
                setLoading(false);
                console.error("Error loading analytics:", err);
            }
        }, 1000);
    }, []);
    
    return (
        <div>
            <AdminNav />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2>User Activity & Analytics</h2>
                    <select 
                        value={timeframe} 
                        onChange={(e) => setTimeframe(e.target.value)}
                        style={styles.timeframeSelect}
                    >
                        <option value="day">Last 24 Hours</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
                
                {loading ? (
                    <div style={styles.loading}>Loading analytics data...</div>
                ) : error ? (
                    <div style={styles.error}>{error}</div>
                ) : (
                    <div style={styles.dashboardGrid}>
                        {/* User Growth Card */}
                        <div style={styles.card}>
                            <h3>User Growth</h3>
                            <div style={styles.barChart}>
                                {analyticsData.userGrowth.map((item, index) => (
                                    <div key={index} style={styles.barGroup}>
                                        <div style={styles.barLabel}>{item.date.split('-')[2]}/{item.date.split('-')[1]}</div>
                                        <div style={styles.bars}>
                                            <div 
                                                style={{
                                                    ...styles.bar,
                                                    height: `${item.customers / 2}px`,
                                                    backgroundColor: '#4CAF50'
                                                }} 
                                                title={`Customers: ${item.customers}`}
                                            />
                                            <div 
                                                style={{
                                                    ...styles.bar,
                                                    height: `${item.providers / 2}px`, 
                                                    backgroundColor: '#2196F3'
                                                }} 
                                                title={`Providers: ${item.providers}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={styles.legend}>
                                <div style={styles.legendItem}>
                                    <div style={{...styles.legendColor, backgroundColor: '#4CAF50'}}></div>
                                    <span>Customers</span>
                                </div>
                                <div style={styles.legendItem}>
                                    <div style={{...styles.legendColor, backgroundColor: '#2196F3'}}></div>
                                    <span>Providers</span>
                                </div>
                            </div>
                        </div>

                        {/* User Sessions Card */}
                        <div style={styles.card}>
                            <h3>User Sessions</h3>
                            <div style={styles.statsGrid}>
                                <div style={styles.statCard}>
                                    <div style={styles.statValue}>{analyticsData.userSessions.today}</div>
                                    <div style={styles.statLabel}>Today</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statValue}>{analyticsData.userSessions.week}</div>
                                    <div style={styles.statLabel}>This Week</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statValue}>{analyticsData.userSessions.month}</div>
                                    <div style={styles.statLabel}>This Month</div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Logs */}
                        <div style={{...styles.card, gridColumn: 'span 2'}}>
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
                                    {analyticsData.activityLogs.map(log => (
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
                )}
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
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    timeframeSelect: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
    },
    dashboardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        padding: '20px',
    },
    barChart: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: '200px',
        padding: '20px 0',
    },
    barGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    barLabel: {
        marginTop: '8px',
        fontSize: '0.8rem',
        color: '#666',
    },
    bars: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
    },
    bar: {
        width: '18px',
        borderRadius: '3px 3px 0 0',
    },
    legend: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '15px',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    legendColor: {
        width: '15px',
        height: '15px',
        borderRadius: '3px',
    },
    statsGrid: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
    },
    statCard: {
        textAlign: 'center',
        padding: '15px',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#0177cc',
    },
    statLabel: {
        color: '#666',
        marginTop: '5px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '15px',
    },
};

export default AdminAnalytics;
