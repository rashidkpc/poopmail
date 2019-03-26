module.exports = ({ to }) => {
  console.log(`Reject plugin rejecting ${to}`);
  return false;
};
