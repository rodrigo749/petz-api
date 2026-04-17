const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ 
      status: 'error', 
      errors: error.errors.map(err => ({ field: err.path[0], message: err.message })) 
    });
  }
};

module.exports = validate;