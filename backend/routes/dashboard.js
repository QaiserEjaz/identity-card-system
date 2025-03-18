import express from 'express';
import Card from '../models/Card.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
        const range = parseInt(req.query.range) || 7;
        const type = req.query.type || 'days';

        if (isNaN(range) || range <= 0) {
            return res.status(400).json({ success: false, error: 'Invalid range parameter' });
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);

        const startDate = new Date(today);
        if (type === 'weeks') {
            startDate.setDate(startDate.getDate() - (range * 7));
        } else if (type === 'months') {
            startDate.setMonth(startDate.getMonth() - range);
        } else {
            startDate.setDate(startDate.getDate() - (range - 1));
        }
        startDate.setHours(0, 0, 0, 0);

        // Determine the date format based on the type
        let dateFormat;
        if (type === 'weeks') {
            dateFormat = '%Y-W%V';
        } else if (type === 'months') {
            dateFormat = '%Y-%m';
        } else {
            dateFormat = '%Y-%m-%d';
        }

        const dailyStatsAggregation = [
            {
                $match: { 
                    $or: [
                        { createdAt: { $gte: startDate, $exists: true, $ne: null } },
                        { updatedAt: { $gte: startDate, $exists: true, $ne: null } },
                        { deletedAt: { $gte: startDate, $exists: true, $ne: null } }
                    ]
                }
            },
            {
                $facet: {
                    created: [
                        {
                            $match: { createdAt: { $gte: startDate, $exists: true, $ne: null } }
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: { 
                                        format: dateFormat, 
                                        date: '$createdAt'
                                    }
                                },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id': 1 } }
                    ],
                    updated: [
                        {
                            $match: { updatedAt: { $gte: startDate, $exists: true, $ne: null } }
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: { 
                                        format: dateFormat, 
                                        date: '$updatedAt'
                                    }
                                },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id': 1 } }
                    ],
                    deleted: [
                        {
                            $match: { deletedAt: { $gte: startDate, $exists: true, $ne: null } }
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: { 
                                        format: dateFormat, 
                                        date: '$deletedAt'
                                    }
                                },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { '_id': 1 } }
                    ]
                }
            }
        ];

        const [stats] = await Card.aggregate(dailyStatsAggregation);
        
        const allDates = new Set([
            ...(stats.created || []).map(s => s._id),
            ...(stats.updated || []).map(s => s._id),
            ...(stats.deleted || []).map(s => s._id)
        ]);
        const dailyStats = Array.from(allDates).map(date => ({
            _id: date,
            created: stats.created?.find(s => s._id === date)?.count || 0,
            updated: stats.updated?.find(s => s._id === date)?.count || 0,
            deleted: stats.deleted?.find(s => s._id === date)?.count || 0
        })).sort((a, b) => a._id.localeCompare(b._id));

        const [
            totalCards,
            todayCards,
            genderStats,
            ageStats,
            departmentStats,
            religionStats,
            locationStats,
            todayActivities
        ] = await Promise.all([
            Card.countDocuments(),
            Card.countDocuments({ createdAt: { $gte: todayStart, $lte: today } }),
            Card.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ['$gender', 'UNKNOWN'] },
                        count: { $sum: 1 }
                    }
                }
            ]),
            Card.aggregate([
                {
                    $project: {
                        // Calculate age from dob field
                        age: {
                            $floor: {
                                $divide: [
                                    { $subtract: [new Date(), "$dob"] },
                                    365 * 24 * 60 * 60 * 1000
                                ]
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $switch: {
                                branches: [
                                    { case: { $lt: ['$age', 18] }, then: 'Under 18' },
                                    { case: { $lt: ['$age', 25] }, then: '18-24' },
                                    { case: { $lt: ['$age', 35] }, then: '25-34' },
                                    { case: { $lt: ['$age', 45] }, then: '35-44' },
                                    { case: { $lt: ['$age', 55] }, then: '45-54' },
                                    { case: { $lt: ['$age', 65] }, then: '55-64' },
                                    { case: { $lt: ['$age', 75] }, then: '65-74' }
                                ],
                                default: '75+'
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id': 1 } }
            ]),
            Card.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ['$department', 'Unknown'] },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]),
            Card.aggregate([
                {
                    $group: {
                        _id: { $ifNull: ['$religion', 'Unknown'] },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }
            ]),
            Card.aggregate([
                {
                    $group: {
                        _id: {
                            province: { $ifNull: ['$province', 'Unknown'] },
                            city: { $ifNull: ['$city', 'Unknown'] }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            Card.aggregate([
                {
                    $match: {
                        $or: [
                            { createdAt: { $gte: todayStart } },
                            { updatedAt: { $gte: todayStart } },
                            { deletedAt: { $gte: todayStart } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: null,
                        created: {
                            $sum: { $cond: [{ $gte: ['$createdAt', todayStart] }, 1, 0] }
                        },
                        updated: {
                            $sum: { $cond: [{ $gte: ['$updatedAt', todayStart] }, 1, 0] }
                        },
                        deleted: {
                            $sum: { $cond: [{ $gte: ['$deletedAt', todayStart] }, 1, 0] }
                        }
                    }
                }
            ])
        ]);

        res.json({
            success: true,
            data: {
                totalCards,
                todayCards,
                dailyStats,
                genderStats,
                ageStats,
                departmentStats,
                religionStats,
                locationStats,
                todayActivities: todayActivities[0] || {
                    created: 0,
                    updated: 0,
                    deleted: 0
                }
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard statistics'
        });
    }
});

export default router;