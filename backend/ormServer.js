require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

// import { DataTypes, Sequelize } from '@sequelize/core';
// import { PostgresDialect } from '@sequelize/postgres';
// import {DataTypes, Sequelize} = require('@sequelize/core');

const { Sequelize, DataTypes } = require('@sequelize/core');
const {PostgresDialect} = require('@sequelize/postgres')

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


const user = sequelize.define("users", 
    {
        id:{
            type: DataTypes.UUID,          // Correct type
            defaultValue: DataTypes.UUIDV4, // Default value generator
            allowNull:false,
            primaryKey: true
        },
        firstName:{
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName:{
            type:DataTypes.STRING,
            allowNull: false
        },
        phone:{
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
              is: /^\+?[\d\s\-\(\)]{6,20}$/i
            }
        },
        email:{
            type: DataTypes.STRING,  // VARCHAR(255) by default
            allowNull: false,
            unique: true,            // Enforce unique emails
            validate: {
                isEmail: true,         // Built-in Sequelize validation
                notEmpty: true,        // Prevent empty strings
                len: [5, 254]
            }
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        },
        // createdAt: {
        //     type: DataTypes.DATE,
        //     defaultValue: DataTypes.NOW,
        //     allowNull: false
        // }

    },
    {
        timestamps: true,
    }
);

// await user.sync({force: true})

(async()=>
    await user.sync({force: true})
)();