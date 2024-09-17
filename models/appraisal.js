module.exports = (sequelize, DataTypes) => {
  const Appraisal = sequelize.define('Appraisal', {
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    message: DataTypes.TEXT,
    contacted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Appraisal;
};
