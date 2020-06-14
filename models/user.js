module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    family_name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_login_date:{
      type: DataTypes.DATE,
      allowNull: false,

    }
  });


  User.sync()
    .then(() => console.log('User table created successfully'))
    .catch(err => console.log('oooh, did you enter wrong database credentials?'));
  return User;
};