const express = require("express")
const { Sequelize, DataTypes } = require("sequelize")
const path = require("path")

const app = express()
app.use(express.json())

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "board.db"),
    logging: false
});

const Post = sequelize.define("Post", {
    title: {type: DataTypes.STRING, allowNull : false},
    content: {type: DataTypes.TEXT, allowNull : false},
    author: {type: DataTypes.STRING}
});