// get health of application
exports.getHealth = (req, res, next) => {
  console.log('In route - getHealth');
  res.json({
    status: 'UP',
  });
};
