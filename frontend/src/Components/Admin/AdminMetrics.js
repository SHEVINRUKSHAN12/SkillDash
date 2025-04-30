import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../Nav/AdminNav';

const AdminMetrics = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('month');
    const [metrics, setMetrics] = useState({
        overview: {},
        jobStats: {},
        serviceStats: {},
        customerStats: {},
        providerStats: {},
        conversionRates: []
    });
    
    // Check if admin is logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/admin');
        }
    }, [navigate]);
    
    // Fetch metrics data
    useEffect(() => {
        // This would be replaced with actual API calls
        setLoading(true);
        setError(null);
        
        setTimeout(() => {
            try {
                // Mock data
                const mockMetrics = {
                    overview: {
                        totalUsers: 1325,
                        activeUsers: 985,
                        totalServices: 450,
                        completedJobs: 875,
                        pendingJobs: 125,
                        averageRating: 4.7
                    },
                    jobStats: {
                        postingRate: 85,  // Jobs posted per week
                        completionRate: 92, // % of jobs completed
                        averageResponseTime: 3.2, // hours
                        averageCompletionTime: 4.5  // days
                    },
                    serviceStats: {
                        mostRequested: [
                            { name: 'Plumbing', count: 145 },
                            { name: 'Electrical', count: 130 },
                            { name: 'Carpentry', count: 95 },
                            { name: 'Home Cleaning', count: 85 },
                            { name: 'Painting', count: 75 }
                        ],
                        averagePrice: 120.50, // $
                        priceRange: {
                            min: 35.00,
                            max: 500.00
                        }
                    },
                    customerStats: {
                        retention: 78, // %
                        averageJobsPosted: 3.5,
                        satisfactionScore: 88 // %
                    },
                    providerStats: {
                        retention: 85, // %
                        averageJobsCompleted: 12.5,
                        topPerformers: [
                            { name: 'Robert Smith', jobs: 45, rating: 4.9 },
                            { name: 'Lisa Johnson', jobs: 42, rating: 4.8 },
                            { name: 'David Williams', jobs: 38, rating: 4.7 },
                            { name: 'Emma Brown', jobs: 35, rating: 4.9 },
                            { name: 'James Davis', jobs: 32, rating: 4.6 }
                        ]
                    },
                    conversionRates: [
                        { stage: 'Visit to Sign Up', rate: 35 },
                        { stage: 'Sign Up to Post Job', rate: 65 },
                        { stage: 'Job Post to Completion', rate: 80 },
                        { stage: 'Completion to Repeat User', rate: 70 }
                    ]
                };
                
                setMetrics(mockMetrics);
                setLoading(false);
            } catch (err) {
                setError("Failed to load metrics data. Please try again later.");
                setLoading(false);
                console.error("Error loading metrics:", err);
            }
        }, 1000);
    }, [timeframe]);

    return (
        <div>
            <AdminNav />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2>Performance Metrics Dashboard</h2>
                    <select 
                        value={timeframe} 
                        onChange={(e) => setTimeframe(e.target.value)}
                        style={styles.timeframeSelect}
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
                
                {loading ? (
                    <div style={styles.loading}>Loading metrics data...</div>
                ) : error ? (
                    <div style={styles.error}>{error}</div>
                ) : (
                    <div style={styles.metricsGrid}>
                        {/* Overview Section */}
                        <div style={styles.overviewSection}>
                            <h3>Platform Overview</h3>
                            <div style={styles.statsGrid}>
                                <div style={styles.statCard}>
                                    <div style={styles.statIcon}>👥</div>
                                    <div style={styles.statValue}>{metrics.overview.totalUsers}</div>
                                    <div style={styles.statLabel}>Total Users</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statIcon}>✅</div>
                                    <div style={styles.statValue}>{metrics.overview.activeUsers}</div>
                                    <div style={styles.statLabel}>Active Users</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statIcon}>🛠️</div>
                                    <div style={styles.statValue}>{metrics.overview.totalServices}</div>
                                    <div style={styles.statLabel}>Total Services</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statIcon}>✓</div>
                                    <div style={styles.statValue}>{metrics.overview.completedJobs}</div>
                                    <div style={styles.statLabel}>Completed Jobs</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statIcon}>⏳</div>
                                    <div style={styles.statValue}>{metrics.overview.pendingJobs}</div>
                                    <div style={styles.statLabel}>Pending Jobs</div>
                                </div>
                                <div style={styles.statCard}>
                                    <div style={styles.statIcon}>⭐</div>
                                    <div style={styles.statValue}>{metrics.overview.averageRating}</div>
                                    <div style={styles.statLabel}>Avg. Rating</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Job Statistics */}
                        <div style={styles.card}>
                            <h3>Job Performance</h3>
                            <div style={styles.metricsTable}>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Job Posting Rate</div>
                                    <div style={styles.metricValue}>{metrics.jobStats.postingRate} per week</div>
                                </div>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Job Completion Rate</div>
                                    <div style={styles.metricValue}>{metrics.jobStats.completionRate}%</div>
                                </div>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Avg Response Time</div>
                                    <div style={styles.metricValue}>{metrics.jobStats.averageResponseTime} hours</div>
                                </div>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Avg Completion Time</div>
                                    <div style={styles.metricValue}>{metrics.jobStats.averageCompletionTime} days</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Customer Statistics */}
                        <div style={styles.card}>
                            <h3>Customer Metrics</h3>
                            <div style={styles.metricsTable}>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Customer Retention</div>
                                    <div style={styles.metricValue}>{metrics.customerStats.retention}%</div>
                                </div>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Avg Jobs Posted</div>
                                    <div style={styles.metricValue}>{metrics.customerStats.averageJobsPosted} per customer</div>
                                </div>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Satisfaction Score</div>
                                    <div style={styles.metricValue}>{metrics.customerStats.satisfactionScore}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Service Provider Statistics */}
                        <div style={styles.card}>
                            <h3>Provider Metrics</h3>
                            <div style={styles.metricsTable}>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Provider Retention</div>
                                    <div style={styles.metricValue}>{metrics.providerStats.retention}%</div>
                                </div>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Avg Jobs Completed</div>
                                    <div style={styles.metricValue}>{metrics.providerStats.averageJobsCompleted} per provider</div>
                                </div>
                            </div>
                            
                            <h4 style={styles.subheading}>Top Performing Providers</h4>
                            <div style={styles.topPerformersTable}>
                                <div style={styles.tableHeader}>
                                    <div>Name</div>
                                    <div>Jobs</div>
                                    <div>Rating</div>
                                </div>
                                {metrics.providerStats.topPerformers.map((provider, index) => (
                                    <div key={index} style={styles.tableRow}>
                                        <div>{provider.name}</div>
                                        <div>{provider.jobs}</div>
                                        <div>⭐ {provider.rating}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Service Statistics */}
                        <div style={styles.card}>
                            <h3>Service Metrics</h3>
                            <div style={styles.metricsTable}>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Avg Service Price</div>
                                    <div style={styles.metricValue}>${metrics.serviceStats.averagePrice.toFixed(2)}</div>
                                </div>
                                <div style={styles.metricRow}>
                                    <div style={styles.metricLabel}>Price Range</div>
                                    <div style={styles.metricValue}>
                                        ${metrics.serviceStats.priceRange.min.toFixed(2)} - ${metrics.serviceStats.priceRange.max.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            
                            <h4 style={styles.subheading}>Most Requested Services</h4>
                            <div style={styles.servicesList}>
                                {metrics.serviceStats.mostRequested.map((service, index) => (
                                    <div key={index} style={styles.serviceItem}>
                                        <span>{service.name}</span>
                                        <div style={styles.serviceBar}>
                                            <div 
                                                style={{
                                                    ...styles.serviceBarFill, 
                                                    width: `${(service.count / metrics.serviceStats.mostRequested[0].count) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <span>{service.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Conversion Funnel */}
                        <div style={styles.card}>
                            <h3>Conversion Funnel</h3>
                            <div style={styles.funnelContainer}>
                                {metrics.conversionRates.map((stage, index) => (
                                    <div key={index} style={styles.funnelStage}>
                                        <div style={styles.funnelLabel}>{stage.stage}</div>
                                        <div style={styles.funnelBar}>
                                            <div 
                                                style={{
                                                    ...styles.funnelBarFill, 
                                                    width: `${stage.rate}%`
                                                }}
                                            ></div>
                                            <span style={styles.funnelPercentage}>{stage.rate}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
        gap: '20px',
    },
    overviewSection: {
        gridColumn: '1 / -1',
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px',
        marginTop: '15px',
    },
    statCard: {
        textAlign: 'center',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    statIcon: {
        fontSize: '1.5rem',
        marginBottom: '5px',
    },
    statValue: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#0177cc',
    },
    statLabel: {
        color: '#666',
        marginTop: '5px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '4px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    metricsTable: {
        marginTop: '15px',
    },
    metricRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee',
    },
    metricLabel: {
        color: '#555',
    },
    metricValue: {
        fontWeight: '500',
    },
    subheading: {
        marginTop: '20px',
        marginBottom: '10px',
        fontSize: '1rem',
        color: '#555',
    },
    topPerformersTable: {
        border: '1px solid #eee',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        backgroundColor: '#f5f5f5',
        padding: '10px',
        fontWeight: 'bold',
    },
    tableRow: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        padding: '10px',
        borderTop: '1px solid #eee',
    },
    servicesList: {
        marginTop: '15px',
    },
    serviceItem: {
        display: 'grid',
        gridTemplateColumns: '1fr 3fr 50px',
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
    funnelContainer: {
        marginTop: '15px',
    },
    funnelStage: {
        marginBottom: '15px',
    },
    funnelLabel: {
        marginBottom: '5px',
        color: '#555',
    },
    funnelBar: {
        position: 'relative',
        height: '25px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    funnelBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    funnelPercentage: {
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        color: '#fff',
        fontWeight: 'bold',
        textShadow: '0 0 2px rgba(0,0,0,0.5)',
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
};

export default AdminMetrics;
