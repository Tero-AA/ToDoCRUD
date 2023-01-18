"use strict";

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.listTodos = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  try {
    const result = await dynamodb.scan(params).promise();
    const todos = result.Items;
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({
        error: "Error occured while fetching to Do's from the data base",
      }),
    };
  }
};
