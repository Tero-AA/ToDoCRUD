"use strict";

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.deleteTodo = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    await dynamodb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({
        error: "Error occured while deleting the ToDo from the data base",
      }),
    };
  }
};
