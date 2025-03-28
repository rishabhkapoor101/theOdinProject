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
  port: process.env.port,
  ssl: false,
  clientMinMessages: 'notice',
});


const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    // type: sql.uuid,
    // defaultValue: sql.uuidv4,
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
}, {
  tableName: 'users',
  // schema: 'application_v1',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  hooks: {
    beforeValidate: (user) => {
      if (!user.id) {
        user.id = require('uuid').v4(); // Fallback UUID generation
      }
    }
  }
});


// await User.sync({force:true})


const newUser = await User.create({
  firstName: "John",
  lastName: "Doe",
  phone: "+15551234567",
  email: "johnny@example.com",
  password: "hashedpassword",
});
console.log(newUser.id);