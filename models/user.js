'use strict';
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const Course = require('./course');

module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is required'
                },
                notEmpty: {
                    msg: 'Please provide first name'
                },
            },
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name is required'
                },
                notEmpty: {
                    msg: 'Please provide last name'
                },
            },
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The email provided already exists'
            },
            validate: {
                notNull: {
                    msg: 'Email is required'
                },
                isEmail: {
                    msg: 'Please provide a valid email'
                },
            },
        },

        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                },
                len: {
                    args: [5, 10],
                    msg: 'The password should be between 5 and 10 characters in length'
                },
            },
        },

        confirmedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                if (val === this.password) {
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('confirmedPassword', hashedPassword);
                }
            },
            validate: {
                notNull: {
                    msg: 'Both password must match'
                },
            },
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        })
    };

    return User;
};