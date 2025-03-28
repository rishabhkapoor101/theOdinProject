// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const bcrypt = require("bcrypt");

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';

import { DataTypes, Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
// import {DataTypes, Sequelize} = require('@sequelize/core');

// const { Sequelize, DataTypes } = require('@sequelize/core');
// const {PostgresDialect} = require('@sequelize/postgres')

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_schema,
  port: 5432,
  ssl: false,
  clientMinMessages: 'notice',
});
// const { v4: uuidv4 } = require('uuid'); // Import UUID generator


const user = sequelize.define("users", 
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                is: /^\+?[\d\s\-\(\)]{6,20}$/i
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true,
                len: [5, 254]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true, // This enables createdAt and updatedAt
        createdAt: 'createdAt', // Explicitly name the timestamp columns
        updatedAt: 'updatedAt',
        tableName: 'users', // Explicit table name
        schema: 'application_v1', // Explicit schema name
        hooks: {
            beforeValidate: (user) => {
                if (!user.id) {
                    user.id = uuidv4(); // Extra protection for UUID
                }
            }
        }
    }
);



// (async()=>
//     // In your migration file
//     // await user.sync({force: true});

//     await sequelize.dropSchema('application_v1', { cascade: true }),
//     await sequelize.createSchema('application_v1'),
//     await sequelize.sync({ force: true })
// )();


await sequelize.sync({force:true})
