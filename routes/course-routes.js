'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User } = require('../models/user');
const { Course } = require('../models/course');
const { authenticateUser } = require('../middleware/auth-user');
const { sequelize } = require('../models');
const course = require('../models/course');



//construct a router instance
const router = express.Router();

//Send a GET request to /courses to READ all courses

router.get('/', asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
        include: [{
            model: User,
            as: 'user',
            where: { id: Sequelize.col('Course.userId') }, //foreign key condition
            attributes: ['firstName', 'lastName', 'emailAddress']//specific attributes from the user model
        }]
    });
    res.status(200).json(courses);
}));

//Send a GET request to /courses/:id to READ (view) a course
router.get('/:id', asyncHandler(async (req, res, next) => {

    const course = await Course.findByPk(req.params.id, {
        include: [{
            model: User,
            as: 'user',
            where: { id: Sequelize.col('Course.userId') }, //foreign key condition
            attributes: ['firstName', 'lastName', 'emailAddress']//specific attributes from the user model
        }]
    });

    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: 'Course not found' })
    }

}));

//Send a POST request to /courses to CREATE a course
router.post('/', authenticateUser, asyncHandler(async (req, res, next) => {

    try {
        const course = await Course.create(req.body);
        const courseId = course.id;
        res.location(`/courses/${courseId}`).status(201).end();

    } catch (error) {

        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            next(error);
        }
    }
}));

//Send a PUT request to /courses/:id to UPDATE (edit) a course
//Send a DELETE to /courses/:id to request to DELETE a course





module.exports = router;