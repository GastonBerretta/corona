module.exports = (sequelize, dataTypes) => {

    const alias = 'User';
    const cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unsigned: true,
            notNull: true,
        },
        name: {
            type: dataTypes.STRING,
            notNull: true
        },

        surname: {
            type: dataTypes.STRING,
            notNull: true
        },

        email: {
            type: dataTypes.STRING,
            notNull: true,
            unique: true
        },

        password: {
            type: dataTypes.STRING,
            notNull: true
        },

        role: {
            type: dataTypes.INTEGER,
            default: 0,
        },

        avatar: {
            type: dataTypes.STRING,
        },

        description: {
            type: dataTypes.STRING,
        },





    }

    const config = {
        timestamps: false
    }

    const User = sequelize.define(alias, cols, config);

    User.associate = function(models){
        User.hasMany(models.Cart, {
            as: 'cart',
            foreignKey: 'idUser'
        });

        User.hasMany(models.Address, {
             as: 'addresses',
             foreignKey: 'idUser',
        });

        User.hasMany(models.Order,{
            as:'orders',
            foreignKey: 'idUser'
        })
    }



    return User
}