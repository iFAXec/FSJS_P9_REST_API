'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { User, Course, Sequelize } = require('../models');
const { authenticateUser } = require('../middleware/auth-user');

//construct a router instance
const router = express.Router();

//Send a GET request to /courses to READ all courses
/**
 * Retrieve all the course details 
 * include user  attributes - firstName, lastName and emailAddress 
 * exclude createdAt and updateAt attributes 
 */
router.get('/', asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
            model: User,
            where: { id: Sequelize.col('Course.userId') }, //foreign key condition
            attributes: ['firstName', 'lastName', 'emailAddress']//specific attributes from the user model
        }]
    });
    res.status(200).json(courses);
}));


//Send a GET request to /courses/:id to READ (view) a course
/**
 * Retrieve course based on the id
 * include user  attributes - firstName, lastName and emailAddress
 * exclude createdAt and updateAt attributes    
 */
router.get('/:id', asyncHandler(async (req, res, next) => {

    const course = await Course.findByPk(req.params.id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
            model: User,
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
/**
 * Create a new course, set the Location header to the URI for the newly created course
 * Return a 201 HTTP status code and no content.
 */
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
/** 
 * Create a PUT route that will update the corresponding course 
 * and return a 204 HTTP status code and no content.
*/
router.put('/:id', authenticateUser, asyncHandler(async (req, res, next) => {

    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            if (course.userId == req.currentUser.id) {
                await course.update({
                    title: req.body.title,
                    description: req.body.description
                });
                res.status(204).end();

            } else {
                res.status(403).json({ message: `You are not authorised to update the course` });
            }
        } else {
            res.status(404).json({ message: 'course not found' });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            next(error);
        }
    }
}));

/**
 * Create a DELETE route that will delete the corresponding course 
 * and return a 204 HTTP status code and no content. 
 */
//Send a DELETE to /courses/:id to request to DELETE a course
router.delete('/:id', authenticateUser, asyncHandler(async (req, res, next) => {

    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            if (course.userId == req.currentUser.id) {
                await course.destroy();
                res.status(204).end();
            } else {
                res.status(403).json({ message: `You are not authorised to delete the course` });
            }
        } else {
            res.status(404).json({ message: 'course not found' });

        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors })
        } else {
            next(error);
        }
    }
}));

module.exports = router;