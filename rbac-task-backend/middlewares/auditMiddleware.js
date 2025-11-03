import AuditLog from '../models/AuditLog.js';

const audit = (actionType) => {
  return async (req, res, next) => {
    res.on('finish', async () => {
      try {
        const performedBy = req.user?.userId || null;
        await AuditLog.create({
          actionType,
          performedBy,
          targetId: req.params.id || req.body?.id || null,
          role: req.user?.role || null,
          details: `${req.method} ${req.originalUrl} - status ${res.statusCode}`,
        });
      } catch (err) {
        console.error('Failed to write audit log', err);
      }
    });
    next();
  };
};

export default audit;
