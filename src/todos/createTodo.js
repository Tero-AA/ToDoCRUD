"use strict";

const { v4 } = require("uuid");
const { DynamoDB, SQS } = require("aws-sdk");

const dynamodb = new DynamoDB.DocumentClient();
const sqs = new SQS();

const createTodoQueueTrigger = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No event body was found",
      }),
    };
  }
  const { text } = JSON.parse(event.body);
  if (!text) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No ToDo text was found",
      }),
    };
  }

  let statusCode;
  let message;

  try {
    await sqs
      .sendMessage({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: event.body,
        MessageAttributes: {
          AttributeName: {
            StringValue: "ToDo body",
            DataType: "String",
          },
        },
      })
      .promise();
    statusCode = 200;
    message = "Create ToDo message was added to the queue";
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

const createTodos = async (event) => {
  for (const record of event.Records) {
    const timestamp = new Date().getTime();
    const { text } = JSON.parse(record.body);
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
  }
};

module.exports = {
  createTodos,
  createTodoQueueTrigger,
};
