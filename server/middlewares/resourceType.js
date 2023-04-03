const resourceType = resourceType => (req, res, next) => {
  res.resourceType = resourceType;
  next();
};

module.exports = resourceType;
