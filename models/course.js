'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const User = require('./User');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }
    Course.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A "title" is required'
                },
                notEmpty: {
                    msg: 'Please provide title'
                },
            },
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A "description" is required'
                },
                notEmpty: {
                    msg: 'Please provide a description'
                },
            },
        },

        estimatedTime: {
            type: DataTypes.STRING,
        },

        materialsNeeded: {
            type: DataTypes.STRING,
        }

    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            },
        });
    };

    return Course;
};