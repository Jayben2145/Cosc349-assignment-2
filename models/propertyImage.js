module.exports = (sequelize, DataTypes) => {
    const PropertyImage = sequelize.define('PropertyImage', {
      propertyId: DataTypes.INTEGER,
      imageUrl: DataTypes.STRING,
    });
    return PropertyImage;
  };
  