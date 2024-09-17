module.exports = (sequelize, DataTypes) => {
    const Property = sequelize.define('Property', {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DECIMAL,
      location: DataTypes.STRING,
      latitude: DataTypes.DECIMAL,
      longitude: DataTypes.DECIMAL,
      display: DataTypes.BOOLEAN,
      notes: DataTypes.TEXT,
    });
    return Property;
  };
  