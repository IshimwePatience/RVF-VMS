module.exports = (sequelize, DataTypes) => {
  const PasswordResetRequest = sequelize.define('PasswordResetRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    timestamps: true,
    tableName: 'password_reset_requests'
  });

  return PasswordResetRequest;
};
