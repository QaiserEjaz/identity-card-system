import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import api from '../utils/api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState({ range: '7', type: 'days' });

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        const fetchStats = async () => {
            try {
                setError(null);
                const response = await api.get('/dashboard/stats', {
                    params: timeRange,
                    signal: controller.signal,
                    timeout: 30000
                });

                if (mounted && response.data.success) {
                    console.log('Age stats received:', response.data.data.ageStats);
                    // Check if we have age data
                    if (!response.data.data.ageStats || response.data.data.ageStats.length === 0) {
                        console.warn('No age data received from backend');
                    } else {
                        console.log('Age groups found:', response.data.data.ageStats.map(stat => stat._id));
                    }
                    setStats(response.data.data);
                }
            } catch (error) {
                if (mounted) {
                    console.error('Error fetching stats:', error);
                    setError(error.message || 'Failed to load dashboard data');
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchStats();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [timeRange]);

    const TimeRangeSelector = () => {
        // Define range options based on the selected type
        const rangeOptions = {
            days: [
                { value: '7', label: 'Last 7 days' },
                { value: '14', label: 'Last 14 days' },
                { value: '30', label: 'Last 30 days' }
            ],
            weeks: [
                { value: '2', label: 'Last 2 weeks' },
                { value: '4', label: 'Last 4 weeks' },
                { value: '8', label: 'Last 8 weeks' }
            ],
            months: [
                { value: '3', label: 'Last 3 months' },
                { value: '6', label: 'Last 6 months' },
                { value: '12', label: 'Last 12 months' }
            ]
        };

        // Get the appropriate options for the current type
        const currentOptions = rangeOptions[timeRange.type] || rangeOptions.days;

        return (
            <div className="d-flex gap-2 mb-3">
                <select
                    className="form-select w-auto"
                    value={timeRange.range}
                    onChange={(e) => setTimeRange(prev => ({ ...prev, range: e.target.value }))}
                >
                    {currentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select
                    className="form-select w-auto"
                    value={timeRange.type}
                    onChange={(e) => {
                        // When changing type, also set an appropriate default range for that type
                        const newType = e.target.value;
                        const defaultRanges = {
                            days: '7',
                            weeks: '4',
                            months: '3'
                        };
                        setTimeRange({ type: newType, range: defaultRanges[newType] || '7' });
                    }}
                >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                </select>
            </div>
        );
    };

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                <h4 className="alert-heading">Error Loading Dashboard</h4>
                <p>{error}</p>
                <hr />
                <button
                    className="btn btn-outline-danger"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const chartOptions = {
        line: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#000',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
                    ticks: { stepSize: 1, precision: 0, padding: 10 }
                }
            },
            elements: {
                line: { tension: 0.4 },
                point: { radius: 4, hoverRadius: 6 }
            },
            animation: false
        },
        pie: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { padding: 20 } }
            },
            animation: false
        }
    };

    const chartData = {
        line: {
            labels: stats?.dailyStats?.map(stat => {
                if (!stat?._id) {
                    console.warn('Missing stat._id:', stat);
                    return 'Unknown';
                }
                try {
                    if (timeRange.type === 'weeks') {
                        // Week parsing logic
                        const parts = stat._id.split('-W');
                        if (parts.length !== 2) {
                            console.warn('Invalid week format:', stat._id);
                            return stat._id;
                        }

                        const year = parseInt(parts[0]);
                        const week = parseInt(parts[1]);

                        if (isNaN(year) || isNaN(week)) {
                            console.warn('Invalid year or week number:', stat._id);
                            return stat._id;
                        }

                        return `Week ${week}, ${year}`;
                    } else if (timeRange.type === 'months') {
                        // Month parsing logic
                        if (stat._id.match(/^\d{4}-\d{2}$/)) {
                            const [year, month] = stat._id.split('-').map(Number);
                            const date = new Date(year, month - 1);
                            return date.toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                            });
                        } else {
                            return stat._id;
                        }
                    } else {
                        // Day parsing logic
                        if (stat._id.includes('-W')) {
                            const parts = stat._id.split('-W');
                            if (parts.length === 2) {
                                const year = parseInt(parts[0]);
                                const week = parseInt(parts[1]);
                                if (!isNaN(year) && !isNaN(week)) {
                                    return `Week ${week}, ${year}`;
                                }
                            }
                            return stat._id;
                        }

                        const date = new Date(stat._id);
                        if (isNaN(date.getTime())) {
                            throw new Error(`Invalid date for _id: ${stat._id}`);
                        }
                        return date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: timeRange.range > 14 ? '2-digit' : undefined
                        });
                    }
                } catch (error) {
                    console.error('Date parsing error:', error.message);
                    return 'Invalid Date';
                }
            }) || [],
            datasets: [
                {
                    label: 'Created',
                    data: stats?.dailyStats?.map(stat => stat.created ?? 0) || [],
                    borderColor: '#00A86B',
                    backgroundColor: 'rgba(0, 168, 107, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#00A86B'
                },
                {
                    label: 'Updated',
                    data: stats?.dailyStats?.map(stat => stat.updated ?? 0) || [],
                    borderColor: '#0D6EFD',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#0D6EFD'
                },
                {
                    label: 'Deleted',
                    data: stats?.dailyStats?.map(stat => stat.deleted ?? 0) || [],
                    borderColor: '#DC3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#DC3545'
                }
            ]
        },
        pie: {
            labels: stats?.genderStats?.map(stat => stat._id) || [],
            datasets: [{
                data: stats?.genderStats?.map(stat => stat.count) || [],
                backgroundColor: [

                     '#808080','#FF69B4',  '#2E86C1', 
                ]
            }]
        },
        religion: {
            labels: stats?.religionStats?.map(stat => stat._id) || [],
            datasets: [{
                data: stats?.religionStats?.map(stat => stat.count) || [],
                backgroundColor: [
                    '#006A4E', '#1A5D1A', '#9E4784', '#D63484',
                    '#3F704D', '#8F9779', '#116530'
                ]
            }]
        },
        location: {
            labels: stats?.locationStats?.slice(0, 10).map(stat =>
                `${stat._id.city || 'Unknown City'}, ${stat._id.province || 'Unknown Province'}`
            ) || [],
            datasets: [{
                data: stats?.locationStats?.slice(0, 10).map(stat => stat.count) || [],
                backgroundColor: [
                    '#006A4E', '#1A5D1A', '#9E4784', '#D63484',
                    '#3F704D', '#8F9779', '#116530', '#4F6F52',
                    '#739072', '#86A789'
                ]
            }]
        }
    };

    // Ensure all age groups are represented with real data from backend
    const allAgeGroups = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75+'];

    // Check if we have meaningful age data
    const hasRealAgeData = stats?.ageStats &&
        stats.ageStats.length > 1 &&
        stats.ageStats.some(stat => stat.count > 0);

    // For testing purposes, generate sample data if no real data exists
    const sampleAgeStats = allAgeGroups.map(group => ({
        _id: group,
        count: Math.floor(Math.random() * 20) + 5 // Random value between 5-24
    }));

    // Use real data if available, otherwise use sample data
    const displayAgeStats = hasRealAgeData
        ? allAgeGroups.map(group => {
            const existingStat = stats?.ageStats?.find(stat => stat._id === group);
            return {
                _id: group,
                count: existingStat ? existingStat.count : 0
            };
        })
        : sampleAgeStats;

    // Age chart with specific colors for each age group
    const ageChartData = {
        labels: displayAgeStats.map(stat => stat._id),
        datasets: [{
            data: displayAgeStats.map(stat => stat.count),
            backgroundColor: [
                '#4169E1',  // Royal Blue for Under 18
                '#32CD32',  // Lime Green for 18-24
                '#FFD700',  // Gold for 25-34
                '#FF8C00',  // Dark Orange for 35-44
                '#9370DB',  // Medium Purple for 45-54
                '#20B2AA',  // Light Sea Green for 55-64
                '#FF6347',  // Tomato for 65-74
                '#8A2BE2'   // Blue Violet for 75+
            ]
        }]
    };

    // Add tooltips with percentage calculation for age chart
    const ageChartOptions = {
        ...chartOptions.pie,
        plugins: {
            ...chartOptions.pie.plugins,
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    generateLabels: function (chart) {
                        // Only show labels for segments that exist in the data
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => {
                                const meta = chart.getDatasetMeta(0);
                                const style = meta.controller.getStyle(i);

                                return {
                                    text: label,
                                    fillStyle: style.backgroundColor,
                                    strokeStyle: style.borderColor,
                                    lineWidth: style.borderWidth,
                                    hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        if (context.label === 'No Age Data') {
                            return 'No age data available';
                        }
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="container-fluid py-3" style={{ background: '#f0f7f4' }}>
            <div className="row g-3">
                {/* Stats Cards Row */}
                <div className="col-md-4">
                    <div className="card border-0 h-100"
                        style={{
                            background: 'linear-gradient(135deg, #006A4E, #00bf8f)',
                            borderRadius: '20px',
                            boxShadow: '0 10px 30px rgba(0, 106, 78, 0.2)',
                        }}>
                        <div className="card-body text-white position-relative overflow-hidden p-3">
                            {/* Decorative Elements */}
                            <div className="position-absolute" style={{
                                right: '-30px',
                                top: '-30px',
                                width: '150px',
                                height: '150px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                                borderRadius: '50%'
                            }}></div>

                            <div className="d-flex align-items-center gap-3">
                                <div className="stats-icon p-2" style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.3)'
                                }}>
                                    <i className="fas fa-id-card fa-2x"></i>
                                </div>
                                <div>
                                    <h6 className="text-uppercase mb-1 opacity-75" style={{
                                        fontSize: '0.9rem',
                                        letterSpacing: '1px'
                                    }}>Total Cards</h6>
                                    <h2 className="mb-0 display-6 fw-bold">{stats?.totalCards || 0}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card border-0 h-100"
                        style={{
                            background: 'linear-gradient(135deg, #2E8B57, #3CB371)',
                            borderRadius: '20px',
                            boxShadow: '0 10px 30px rgba(26, 93, 26, 0.2)',
                        }}>
                        <div className="card-body text-white position-relative overflow-hidden p-4">
                            {/* Decorative Elements */}
                            <div className="position-absolute" style={{
                                left: '-30px',
                                top: '-30px',
                                width: '200px',
                                height: '200px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                                borderRadius: '50%'
                            }}></div>

                            <h6 className="text-uppercase mb-4" style={{
                                fontSize: '1.2rem',
                                letterSpacing: '1px'
                            }}>Today's Activities</h6>

                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div className="activity-card p-3" style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        transition: 'transform 0.2s ease',
                                        cursor: 'pointer',
                                    }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle bg-white p-2" style={{
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                            }}>
                                                <i className="fas fa-plus text-success px-1" ></i>
                                            </div>
                                            <div>
                                                <small className="d-block opacity-75">Created</small>
                                                <h3 className="mb-0 fw-bold">{stats?.todayActivities?.created || 0}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="activity-card p-3" style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        backdropFilter: 'blur(5px)',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle bg-white p-2" style={{
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                            }}>
                                                <i className="fas fa-sync text-success px-1"></i>
                                            </div>
                                            <div>
                                                <small className="d-block opacity-75">Updated</small>
                                                <h3 className="mb-0 fw-bold">{stats?.todayActivities?.updated || 0}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="activity-card p-3" style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        backdropFilter: 'blur(5px)',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle bg-white p-2" style={{
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                            }}>
                                                <i className="fas fa-trash text-success px-1"></i>
                                            </div>
                                            <div>
                                                <small className="d-block opacity-75">Deleted</small>
                                                <h3 className="mb-0 fw-bold">{stats?.todayActivities?.deleted || 0}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rest of the dashboard content */}
                <div className="col-12">
                    <div className="card border-0"
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 10px 20px rgba(0, 106, 78, 0.1)',
                            background: 'linear-gradient(to right bottom, #ffffff, #f8faf9)'
                        }}>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-0 flex-wrap gap-3">
                                <h5 className="card-title mb-0"
                                    style={{
                                        color: '#006A4E',
                                        fontSize: '1.5rem',
                                        fontWeight: '600'
                                    }}>
                                    <i className="fas fa-chart-line me-2"></i>
                                    Activity Trend
                                </h5>
                                <div className="time-range-selector">
                                    <TimeRangeSelector />
                                </div>
                            </div>
                            <div style={{ height: '300px' }} className="chart-container">
                                <Line data={chartData.line} options={{
                                    ...chartOptions.line,
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        ...chartOptions.line.scales,
                                        x: {
                                            ...chartOptions.line.scales.x,
                                            ticks: {
                                                maxRotation: 45,
                                                minRotation: 45
                                            }
                                        }
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Distribution Charts */}
                <div className="col-md-6">
                    <div className="card border-0"
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 10px 20px rgba(0, 106, 78, 0.1)',
                            background: 'linear-gradient(to right bottom, #ffffff, #f8faf9)'
                        }}>
                        <div className="card-body p-4">
                            <h6 className="card-title text-success mb-4">
                                <i className="fas fa-venus-mars me-2"></i>
                                Gender Distribution
                            </h6>
                            <div style={{ height: '250px' }}>
                                <Pie data={chartData.pie} options={chartOptions.pie} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card border-0"
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 10px 20px rgba(0, 106, 78, 0.1)',
                            background: 'linear-gradient(to right bottom, #ffffff, #f8faf9)'
                        }}>
                        <div className="card-body p-4">
                            <h6 className="card-title text-success mb-4">
                                <i className="fas fa-pray me-2"></i>
                                Religion Distribution
                            </h6>
                            <div style={{ height: '250px' }}>
                                <Pie data={chartData.religion} options={chartOptions.pie} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Age Distribution */}
                <div className="col-12">
                    <div className="card border-0"
                        style={{
                            borderRadius: '15px',
                            boxShadow: '0 10px 20px rgba(0, 106, 78, 0.1)',
                            background: 'linear-gradient(to right bottom, #ffffff, #f8faf9)'
                        }}>
                        <div className="card-body p-4">
                            <h6 className="card-title text-success mb-4">
                                <i className="fas fa-users me-2"></i>
                                Age Distribution
                            </h6>
                            <div style={{ height: '300px' }}>
                                <Pie data={ageChartData} options={ageChartOptions} />
                            </div>
                            {!hasRealAgeData && (
                                <div className="text-muted text-center mt-3">
                                    <small><i className="fas fa-info-circle me-1"></i>Sample data shown for demonstration purposes</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .card {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.1),
                        transparent
                    );
                    transition: 0.5s;
                }
                .card:hover {
                    box-shadow: 0 15px 30px rgba(0, 106, 78, 0.15);
                }
                .card:hover::before {
                    left: 100%;
                }
                .activity-card {
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .activity-card:hover {
                    transform: translateY(-5px);
                    background: rgba(255,255,255,0.25) !important;
                }
                .activity-card:active {
                    transform: scale(0.98);
                }
                .stats-icon {
                    transition: all 0.3s ease;
                }
                .card:hover .stats-icon {
                    transform: scale(1.1) rotate(5deg);
                }
                .rounded-circle {
                    transition: all 0.3s ease;
                }
                .activity-card:hover .rounded-circle {
                    transform: rotate(360deg);
                }
                .form-select {
                    border-radius: 10px;
                    border: 1px solid rgba(0, 106, 78, 0.2);
                    background-color: rgba(255, 255, 255, 0.9);
                    transition: all 0.3s ease;
                }
                .form-select:hover {
                    border-color: #006A4E;
                    box-shadow: 0 0 10px rgba(0, 106, 78, 0.1);
                }
                .form-select:focus {
                    border-color: #006A4E;
                    box-shadow: 0 0 0 0.25rem rgba(0, 106, 78, 0.25);
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .card h2.display-6 {
                    animation: pulse 2s infinite;
                }
                
            .time-range-selector {
                display: flex;
                gap: 8px;
            }
            
            .time-range-selector .form-select {
                min-width: 120px;
                padding: 7px 29px;
                font-size: 0.8rem;
            }

            @media (max-width: 768px) {
                .time-range-selector {
                    width: 100%;
                    justify-content: flex-start;
                }
                .time-range-selector .form-select {
                    flex: 1;
                    padding: 7px 29px;
                    min-width: unset;
                }
            
            `}</style>
        </div>
    );
}

export default Dashboard;
