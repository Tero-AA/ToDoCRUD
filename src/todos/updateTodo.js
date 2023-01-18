"use strict";

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.updateTodo = async (event) => {
  const timestamp = new Date().getTime();
  const { text, checked } = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      "#todo_text": "text",
    },
    ExpressionAttributeValues: {
      ":text": text,
      ":checked": checked,
      ":updatedAt": timestamp,
    },
    UpdateExpression:
      "set #todo_text = :text, checked = :checked, updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "To Do updated successfully",
        data: result.Attributes,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      body: JSON.stringify({
        error: "Error occured while updating the ToDo from the data base",
      }),
    };
  }
};
