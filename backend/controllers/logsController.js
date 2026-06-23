const AuditLog = require("../models/AuditLog");

const uploadLogs = async (req, res) => {
  try {
    const { logs } = req.body;

    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({
        error: "Invalid request. Expected { logs: [...] }",
        uploaded: 0,
        failed: 0,
      });
    }

    if (logs.length === 0) {
      return res.status(400).json({
        error: "No logs provided",
        uploaded: 0,
        failed: 0,
      });
    }

    const validLogs = [];
    let uploaded = 0;
    let failed = 0;
    const errors = [];

    for (let i = 0; i < logs.length; i++) {
      try {
        const log = logs[i];

        if (
          !log.actor ||
          !log.action ||
          !log.resource ||
          !log.resourceType ||
          !log.ipAddress ||
          !log.severity ||
          !log.status ||
          !log.timestamp
        ) {
          failed++;

          errors.push({
            index: i,
            error: "Missing required fields",
          });

          continue;
        }

        if (typeof log.timestamp === "string") {
          log.timestamp = new Date(log.timestamp);
        }

        if (isNaN(log.timestamp.getTime())) {
          failed++;

          errors.push({
            index: i,
            error: "Invalid timestamp format",
          });

          continue;
        }

        validLogs.push(log);
        uploaded++;
      } catch (err) {
        failed++;

        errors.push({
          index: i,
          error: err.message,
        });
      }
    }

    if (validLogs.length > 0) {
      await AuditLog.insertMany(validLogs, {
        ordered: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Upload completed`,
      uploaded,
      failed,
      errors: errors.slice(0, 10),
    });
  } catch (err) {
    console.error("Upload error:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to upload logs",
      details: err.message,
    });
  }
};

const fetchLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);

    const limit = Math.min(
      1000,
      Math.max(1, parseInt(req.query.limit) || 20)
    );

    const sortField = req.query.sort || "timestamp";

    const sortOrder =
      (req.query.order || "desc").toLowerCase() === "asc"
        ? 1
        : -1;

    const filterObj = {};

    if (req.query.role) {
      filterObj.role = req.query.role;
    }

    if (req.query.severity) {
      filterObj.severity = req.query.severity;
    }

    if (req.query.status) {
      filterObj.status = req.query.status;
    }

    if (req.query.region) {
      filterObj.region = req.query.region;
    }

    if (req.query.action) {
      filterObj.action = req.query.action;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");

      filterObj.$or = [
        { actor: searchRegex },
        { resource: searchRegex },
        { ipAddress: searchRegex },
      ];
    }

    const allowedSortFields = [
      "actor",
      "role",
      "action",
      "severity",
      "status",
      "timestamp",
      "resource",
      "region",
    ];

    const finalSortField = allowedSortFields.includes(sortField)
      ? sortField
      : "timestamp";

    const sortObj = {
      [finalSortField]: sortOrder,
    };

    const total = await AuditLog.countDocuments(filterObj);

    const logs = await AuditLog.find(filterObj)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Fetch logs error:", err);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch logs",
      details: err.message,
    });
  }
};

module.exports = {
  uploadLogs,
  fetchLogs,
};