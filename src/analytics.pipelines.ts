/**
 * MongoDB Aggregation Pipelines for Analytics
 * 
 * This file contains various aggregation pipelines for generating
 * analytics and insights from the photon backend collections.
 */

import { Collections } from "./interface";

// ==================== PROJECT ANALYTICS ====================

/**
 * Get project statistics by status
 * Returns count and percentage of projects in each status
 */
export const projectsByStatus = [
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
      projects: {
        $push: {
          id: "$id",
          name: "$name",
          bookingCategory: "$bookingCategory",
          dateOfBooking: "$dateOfBooking",
        },
      },
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$count" },
      statuses: {
        $push: {
          status: "$_id",
          count: "$count",
          projects: "$projects",
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      total: 1,
      statuses: {
        $map: {
          input: "$statuses",
          as: "status",
          in: {
            status: "$$status.status",
            count: "$$status.count",
            percentage: {
              $multiply: [{ $divide: ["$$status.count", "$total"] }, 100],
            },
            projects: "$$status.projects",
          },
        },
      },
    },
  },
];

/**
 * Get project statistics by booking category
 * Useful for understanding which types of events are most popular
 */
export const projectsByBookingCategory = [
  {
    $group: {
      _id: "$bookingCategory",
      count: { $sum: 1 },
      averageDiscussionLength: { $avg: { $strLenCP: "$discussionSummary" } },
      totalRevenue: { $sum: "$totalAmount" }, // if you have this field
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $project: {
      _id: 0,
      bookingCategory: "$_id",
      count: 1,
      averageDiscussionLength: { $round: ["$averageDiscussionLength", 2] },
      totalRevenue: 1,
    },
  },
];

/**
 * Get project statistics by lead source
 * Helps identify most effective marketing channels
 */
export const projectsByLeadSource = [
  {
    $group: {
      _id: "$leadSource",
      count: { $sum: 1 },
      projectIds: { $push: "$id" },
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $project: {
      _id: 0,
      leadSource: "$_id",
      count: 1,
      conversionRate: 1, // Can be calculated if you track leads separately
    },
  },
];

/**
 * Monthly project bookings trend
 * Shows booking patterns over time
 */
export const monthlyProjectTrend = [
  {
    $group: {
      _id: {
        year: { $year: "$dateOfBooking" },
        month: { $month: "$dateOfBooking" },
      },
      count: { $sum: 1 },
      categories: { $push: "$bookingCategory" },
      statuses: { $push: "$status" },
    },
  },
  {
    $sort: { "_id.year": -1, "_id.month": -1 },
  },
  {
    $project: {
      _id: 0,
      year: "$_id.year",
      month: "$_id.month",
      count: 1,
      categories: 1,
      statuses: 1,
      monthName: {
        $let: {
          vars: {
            months: [
              "",
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
          },
          in: { $arrayElemAt: ["$$months", "$_id.month"] },
        },
      },
    },
  },
];

/**
 * Projects with clients enriched
 * Join projects with client information
 */
export const projectsWithClientDetails = [
  {
    $lookup: {
      from: "clients",
      localField: "clientId",
      foreignField: "id",
      as: "clientInfo",
    },
  },
  {
    $unwind: {
      path: "$clientInfo",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      id: 1,
      name: 1,
      status: 1,
      bookingCategory: 1,
      dateOfBooking: 1,
      isPremiumClient: "$clientInfo.isPremiumClient",
      clientName: "$clientInfo.name",
      clientPhone: "$clientInfo.phone",
      clientEmail: "$clientInfo.email",
    },
  },
];

/**
 * Premium vs Regular client project statistics
 */
export const premiumVsRegularClientStats = [
  {
    $lookup: {
      from: "clients",
      localField: "clientId",
      foreignField: "id",
      as: "clientInfo",
    },
  },
  {
    $unwind: {
      path: "$clientInfo",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $group: {
      _id: "$clientInfo.isPremiumClient",
      totalProjects: { $sum: 1 },
      openProjects: {
        $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] },
      },
      closedProjects: {
        $sum: { $cond: [{ $eq: ["$status", "close"] }, 1, 0] },
      },
    },
  },
  {
    $project: {
      _id: 0,
      clientType: {
        $cond: [{ $eq: ["$_id", true] }, "Premium", "Regular"],
      },
      totalProjects: 1,
      openProjects: 1,
      closedProjects: 1,
    },
  },
];

// ==================== EMPLOYEE ANALYTICS ====================

/**
 * Employee performance overview
 * Groups employees by status and role
 */
export const employeeOverview = [
  {
    $group: {
      _id: {
        status: "$status",
        role: "$role",
      },
      count: { $sum: 1 },
      averageRating: { $avg: "$rating" },
      employees: {
        $push: {
          id: "$id",
          name: "$name",
          rating: "$rating",
          expertise: "$expertise",
        },
      },
    },
  },
  {
    $sort: { "_id.role": 1, "_id.status": 1 },
  },
  {
    $project: {
      _id: 0,
      role: "$_id.role",
      status: "$_id.status",
      count: 1,
      averageRating: { $round: ["$averageRating", 2] },
      employees: 1,
    },
  },
];

/**
 * Employee expertise distribution
 * Shows which skills are most common among employees
 */
export const employeeExpertiseDistribution = [
  {
    $unwind: "$expertise",
  },
  {
    $group: {
      _id: "$expertise",
      count: { $sum: 1 },
      employees: {
        $push: {
          id: "$id",
          name: "$name",
          rating: "$rating",
        },
      },
      averageRating: { $avg: "$rating" },
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $project: {
      _id: 0,
      skill: "$_id",
      employeeCount: "$count",
      averageRating: { $round: ["$averageRating", 2] },
      employees: 1,
    },
  },
];

/**
 * Top performing employees by rating
 */
export const topPerformingEmployees = [
  {
    $match: {
      status: "active",
    },
  },
  {
    $sort: { rating: -1 },
  },
  {
    $limit: 10,
  },
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      rating: 1,
      expertise: 1,
      employmentType: 1,
      role: 1,
    },
  },
];

/**
 * Employee tenure analysis
 * Groups employees by how long they've been with the company
 */
export const employeeTenureAnalysis = [
  {
    $match: {
      status: "active",
    },
  },
  {
    $project: {
      id: 1,
      name: 1,
      role: 1,
      rating: 1,
      daysEmployed: {
        $dateDiff: {
          startDate: "$doj",
          endDate: "$$NOW",
          unit: "day",
        },
      },
      monthsEmployed: {
        $dateDiff: {
          startDate: "$doj",
          endDate: "$$NOW",
          unit: "month",
        },
      },
    },
  },
  {
    $bucket: {
      groupBy: "$monthsEmployed",
      boundaries: [0, 3, 6, 12, 24, 36, 1000],
      default: "Other",
      output: {
        count: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        employees: {
          $push: {
            id: "$id",
            name: "$name",
            monthsEmployed: "$monthsEmployed",
            rating: "$rating",
          },
        },
      },
    },
  },
];

// ==================== EVENT ANALYTICS ====================

/**
 * Upcoming events with team details
 */
export const upcomingEventsWithTeam = [
  {
    $match: {
      status: "upcoming",
      date: { $gte: new Date() },
    },
  },
  {
    $lookup: {
      from: "projects",
      localField: "projectId",
      foreignField: "id",
      as: "projectInfo",
    },
  },
  {
    $unwind: "$projectInfo",
  },
  {
    $sort: { date: 1 },
  },
  {
    $project: {
      _id: 0,
      eventId: "$id",
      date: 1,
      venue: 1,
      assignment: 1,
      teamSize: { $size: "$team" },
      projectName: "$projectInfo.name",
      bookingCategory: "$projectInfo.bookingCategory",
      team: 1,
    },
  },
];

/**
 * Employee event assignment frequency
 * Shows workload distribution across employees
 */
export const employeeEventAssignments = [
  {
    $unwind: "$team",
  },
  {
    $group: {
      _id: "$team.employeeId",
      totalEvents: { $sum: 1 },
      upcomingEvents: {
        $sum: { $cond: [{ $eq: ["$status", "upcoming"] }, 1, 0] },
      },
      completedEvents: {
        $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
      },
      leadEvents: {
        $sum: { $cond: [{ $eq: ["$team.isLead", "true"] }, 1, 0] },
      },
    },
  },
  {
    $lookup: {
      from: "employees",
      localField: "_id",
      foreignField: "id",
      as: "employeeInfo",
    },
  },
  {
    $unwind: "$employeeInfo",
  },
  {
    $sort: { totalEvents: -1 },
  },
  {
    $project: {
      _id: 0,
      employeeId: "$_id",
      employeeName: "$employeeInfo.name",
      totalEvents: 1,
      upcomingEvents: 1,
      completedEvents: 1,
      leadEvents: 1,
      workload: {
        $concat: [
          { $toString: "$upcomingEvents" },
          " upcoming, ",
          { $toString: "$completedEvents" },
          " completed",
        ],
      },
    },
  },
];

/**
 * Monthly event distribution
 */
export const monthlyEventDistribution = [
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" },
      },
      totalEvents: { $sum: 1 },
      upcomingEvents: {
        $sum: { $cond: [{ $eq: ["$status", "upcoming"] }, 1, 0] },
      },
      completedEvents: {
        $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
      },
      venues: { $addToSet: "$venue" },
    },
  },
  {
    $sort: { "_id.year": -1, "_id.month": -1 },
  },
  {
    $project: {
      _id: 0,
      year: "$_id.year",
      month: "$_id.month",
      totalEvents: 1,
      upcomingEvents: 1,
      completedEvents: 1,
      uniqueVenues: { $size: "$venues" },
    },
  },
];

// ==================== DELIVERABLE ANALYTICS ====================

/**
 * Deliverable type distribution
 * Shows which deliverables are most commonly offered
 */
export const deliverableTypeDistribution = [
  {
    $group: {
      _id: "$type",
      count: { $sum: 1 },
      averageDeliveryTime: { $avg: "$deliveryTime" },
      physicalCount: {
        $sum: { $cond: [{ $eq: ["$assetType", "physical"] }, 1, 0] },
      },
      digitalCount: {
        $sum: { $cond: [{ $eq: ["$assetType", "digital"] }, 1, 0] },
      },
    },
  },
  {
    $sort: { count: -1 },
  },
  {
    $project: {
      _id: 0,
      deliverableType: "$_id",
      count: 1,
      averageDeliveryTime: { $round: ["$averageDeliveryTime", 1] },
      physicalCount: 1,
      digitalCount: 1,
    },
  },
];

/**
 * Project deliverable status overview
 * Shows delivery progress across all projects
 */
export const projectDeliverableStatus = [
  {
    $lookup: {
      from: "projects",
      localField: "projectId",
      foreignField: "id",
      as: "projectInfo",
    },
  },
  {
    $unwind: "$projectInfo",
  },
  {
    $lookup: {
      from: "deliverables",
      localField: "deliverableId",
      foreignField: "id",
      as: "deliverableInfo",
    },
  },
  {
    $unwind: "$deliverableInfo",
  },
  {
    $project: {
      _id: 0,
      projectId: 1,
      projectName: "$projectInfo.name",
      deliverableType: "$deliverableInfo.type",
      deliverableDisplayName: "$deliverableInfo.displayName",
      isDelivered: 1,
      totalUpdates: { $size: "$deliveryUpdates" },
      completedUpdates: {
        $size: {
          $filter: {
            input: "$deliveryUpdates",
            as: "update",
            cond: { $eq: ["$$update.status", "done"] },
          },
        },
      },
      inProgressUpdates: {
        $size: {
          $filter: {
            input: "$deliveryUpdates",
            as: "update",
            cond: { $eq: ["$$update.status", "in_progress"] },
          },
        },
      },
    },
  },
  {
    $addFields: {
      completionPercentage: {
        $cond: [
          { $eq: ["$totalUpdates", 0] },
          0,
          {
            $multiply: [
              { $divide: ["$completedUpdates", "$totalUpdates"] },
              100,
            ],
          },
        ],
      },
    },
  },
];

/**
 * Overdue deliverables
 * Identifies deliverables that should have been delivered by now
 */
export const overdueDeliverables = [
  {
    $match: {
      isDelivered: false,
    },
  },
  {
    $lookup: {
      from: "deliverables",
      localField: "deliverableId",
      foreignField: "id",
      as: "deliverableInfo",
    },
  },
  {
    $unwind: "$deliverableInfo",
  },
  {
    $lookup: {
      from: "projects",
      localField: "projectId",
      foreignField: "id",
      as: "projectInfo",
    },
  },
  {
    $unwind: "$projectInfo",
  },
  {
    $addFields: {
      expectedDeliveryDate: {
        $dateAdd: {
          startDate: "$projectInfo.dateOfBooking",
          unit: "day",
          amount: "$deliverableInfo.deliveryTime",
        },
      },
    },
  },
  {
    $match: {
      expectedDeliveryDate: { $lt: new Date() },
    },
  },
  {
    $project: {
      _id: 0,
      projectId: 1,
      projectName: "$projectInfo.name",
      deliverableType: "$deliverableInfo.type",
      deliverableDisplayName: "$deliverableInfo.displayName",
      expectedDeliveryDate: 1,
      daysOverdue: {
        $dateDiff: {
          startDate: "$expectedDeliveryDate",
          endDate: new Date(),
          unit: "day",
        },
      },
      completionPercentage: {
        $multiply: [
          {
            $divide: [
              {
                $size: {
                  $filter: {
                    input: "$deliveryUpdates",
                    as: "update",
                    cond: { $eq: ["$$update.status", "done"] },
                  },
                },
              },
              { $size: "$deliveryUpdates" },
            ],
          },
          100,
        ],
      },
    },
  },
  {
    $sort: { daysOverdue: -1 },
  },
];

// ==================== CLIENT ANALYTICS ====================

/**
 * Client overview statistics
 */
export const clientOverview = [
  {
    $facet: {
      totalStats: [
        {
          $group: {
            _id: null,
            totalClients: { $sum: 1 },
            premiumClients: {
              $sum: { $cond: ["$isPremiumClient", 1, 0] },
            },
            regularClients: {
              $sum: { $cond: ["$isPremiumClient", 0, 1] },
            },
          },
        },
      ],
      clientsWithProjects: [
        {
          $lookup: {
            from: "projects",
            localField: "id",
            foreignField: "clientId",
            as: "projects",
          },
        },
        {
          $project: {
            id: 1,
            name: 1,
            isPremiumClient: 1,
            totalProjects: { $size: "$projects" },
            openProjects: {
              $size: {
                $filter: {
                  input: "$projects",
                  as: "project",
                  cond: { $eq: ["$$project.status", "open"] },
                },
              },
            },
            closedProjects: {
              $size: {
                $filter: {
                  input: "$projects",
                  as: "project",
                  cond: { $eq: ["$$project.status", "close"] },
                },
              },
            },
          },
        },
        {
          $sort: { totalProjects: -1 },
        },
      ],
    },
  },
];

/**
 * Top clients by project count
 */
export const topClientsByProjects = [
  {
    $lookup: {
      from: "projects",
      localField: "id",
      foreignField: "clientId",
      as: "projects",
    },
  },
  {
    $project: {
      _id: 0,
      id: 1,
      name: 1,
      phone: 1,
      email: 1,
      isPremiumClient: 1,
      totalProjects: { $size: "$projects" },
      bookingCategories: "$projects.bookingCategory",
    },
  },
  {
    $match: {
      totalProjects: { $gt: 0 },
    },
  },
  {
    $sort: { totalProjects: -1 },
  },
  {
    $limit: 20,
  },
];

// ==================== COMBINED ANALYTICS ====================

/**
 * Comprehensive project dashboard
 * Combines multiple metrics for a complete overview
 */
export const projectDashboard = [
  {
    $facet: {
      statusBreakdown: [
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ],
      categoryBreakdown: [
        {
          $group: {
            _id: "$bookingCategory",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ],
      leadSourceBreakdown: [
        {
          $group: {
            _id: "$leadSource",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ],
      monthlyTrend: [
        {
          $group: {
            _id: {
              year: { $year: "$dateOfBooking" },
              month: { $month: "$dateOfBooking" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ],
      recentProjects: [
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
            status: 1,
            bookingCategory: 1,
            createdAt: 1,
          },
        },
      ],
    },
  },
];

/**
 * Team performance dashboard
 * Shows employee metrics and event assignments
 */
export const teamPerformanceDashboard = [
  {
    $facet: {
      employeeStats: [
        {
          $group: {
            _id: null,
            totalEmployees: { $sum: 1 },
            activeEmployees: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            averageRating: { $avg: "$rating" },
          },
        },
      ],
      employmentTypeBreakdown: [
        {
          $group: {
            _id: "$employmentType",
            count: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ],
      roleDistribution: [
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
      ],
      topPerformers: [
        { $match: { status: "active" } },
        { $sort: { rating: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
            rating: 1,
            role: 1,
          },
        },
      ],
    },
  },
];

/**
 * Business health metrics
 * Overall KPIs for business monitoring
 */
export const businessHealthMetrics = [
  {
    $facet: {
      projectMetrics: [
        {
          $group: {
            _id: null,
            totalProjects: { $sum: 1 },
            openProjects: {
              $sum: { $cond: [{ $eq: ["$status", "open"] }, 1, 0] },
            },
            closedProjects: {
              $sum: { $cond: [{ $eq: ["$status", "close"] }, 1, 0] },
            },
            withdrawnProjects: {
              $sum: { $cond: [{ $eq: ["$status", "withdrawn"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalProjects: 1,
            openProjects: 1,
            closedProjects: 1,
            withdrawnProjects: 1,
            closureRate: {
              $multiply: [
                { $divide: ["$closedProjects", "$totalProjects"] },
                100,
              ],
            },
            withdrawalRate: {
              $multiply: [
                { $divide: ["$withdrawnProjects", "$totalProjects"] },
                100,
              ],
            },
          },
        },
      ],
    },
  },
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Helper function to get date range filter
 */
export const getDateRangeFilter = (startDate: Date, endDate: Date) => ({
  createdAt: {
    $gte: startDate,
    $lte: endDate,
  },
});

/**
 * Helper function to add date range to any pipeline
 */
export const addDateRangeToPipeline = (
  pipeline: any[],
  startDate: Date,
  endDate: Date
) => {
  return [
    {
      $match: getDateRangeFilter(startDate, endDate),
    },
    ...pipeline,
  ];
};
