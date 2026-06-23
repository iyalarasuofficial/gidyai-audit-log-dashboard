const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'manager', 'viewer'],
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'DELETE_USER',
        'CREATE_USER',
        'UPDATE_USER',
        'LOGIN',
        'LOGOUT',
        'ACCESS_RESOURCE',
        'MODIFY_RESOURCE',
        'DELETE_RESOURCE',
        'CREATE_POLICY',
        'DELETE_POLICY',
      ],
      index: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ['USER', 'POLICY', 'ROLE', 'RESOURCE', 'API', 'CONFIG'],
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      enum: [
        'us-east-1',
        'us-west-2',
        'eu-west-1',
        'ap-south-1',
        'ap-southeast-1',
      ],
      index: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      index: true,
    },
    status: {
      type: String,
      enum: ['Resolved', 'Unresolved', 'Investigating'],
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ actor: 1, timestamp: -1 });
auditLogSchema.index({ status: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
