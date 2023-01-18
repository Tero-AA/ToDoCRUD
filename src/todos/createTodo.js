"use strict";

const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.createTodo = async (event) => {
  const timestamp = new Date().getTime();
  const { text } = JSON.parse(event.body);
  const id = v4();

  const newTodo = {
    id,
    text,
    checked: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: newTodo,
  };

  try {
    await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newTodo),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error occured while uploading data to DynamoDB",
      }),
    };
  }
};
