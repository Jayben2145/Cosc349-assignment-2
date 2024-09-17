module.exports = (sequelize, DataTypes) => {
  const BuyerSpecification = sequelize.define('BuyerSpecification', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    areaWanted: {
      type: DataTypes.STRING,
      allowNull: false
    },
    priceRange: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contacted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false  // Set default to false until the buyer is contacted
    }
  }, {
    timestamps: true,  // Enable timestamps (createdAt, updatedAt)
    tableName: 'BuyerSpecifications'
  });

  return BuyerSpecification;
};
