const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand 
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const dynamo = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "evaluations-table-dev";

const sendResponse = (statusCode, body) => ({
  statusCode,
  headers: { 
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  body: JSON.stringify(body),
});

exports.api = async (event) => {
  const { method, path } = event.requestContext.http;
  const id = event.pathParameters?.id;

  try {
    if (method === "GET" && !id) {
      const result = await dynamo.send(new ScanCommand({ TableName: TABLE_NAME }));
      return sendResponse(200, result.Items || []);
    }

    if (method === "GET" && id) {
      const result = await dynamo.send(new GetCommand({ 
        TableName: TABLE_NAME, 
        Key: { evaluationId: id } 
      }));
      
      if (!result.Item) {
        return sendResponse(404, { error: "Evaluación no encontrada" });
      }
      return sendResponse(200, result.Item);
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      
      if (!body.courseId || !body.title || !body.dueDate) {
        return sendResponse(400, { error: "courseId, title y dueDate son requeridos" });
      }

      const newEvaluation = {
        evaluationId: Date.now().toString(),
        courseId: body.courseId,
        title: body.title,
        description: body.description || "",
        dueDate: body.dueDate,
        status: body.status || "active",
        createdAt: new Date().toISOString()
      };

      await dynamo.send(new PutCommand({ 
        TableName: TABLE_NAME, 
        Item: newEvaluation 
      }));
      
      return sendResponse(201, newEvaluation);
    }

    if (method === "PUT" && id) {
      const body = JSON.parse(event.body || "{}");

      if (!body.courseId || !body.title || !body.dueDate || !body.status) {
        return sendResponse(400, { error: "Faltan campos obligatorios para actualizar" });
      }

      const updateResult = await dynamo.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { evaluationId: id },
        UpdateExpression: "set courseId = :c, title = :t, description = :d, dueDate = :w, #st = :s",
        ExpressionAttributeNames: { 
          "#st": "status" 
        },
        ExpressionAttributeValues: {
          ":c": body.courseId,
          ":t": body.title,
          ":d": body.description,
          ":w": body.dueDate,
          ":s": body.status
        },
        ReturnValues: "ALL_NEW"
      }));

      return sendResponse(200, updateResult.Attributes);
    }

    if (method === "DELETE" && id) {
      const verify = await dynamo.send(new GetCommand({ TableName: TABLE_NAME, Key: { evaluationId: id } }));
      if (!verify.Item) {
        return sendResponse(404, { error: "La evaluación que deseas eliminar no existe" });
      }

      await dynamo.send(new DeleteCommand({ 
        TableName: TABLE_NAME, 
        Key: { evaluationId: id } 
      }));
      
      return sendResponse(200, { message: "Evaluación eliminada con éxito", evaluationId: id });
    }

    return sendResponse(405, { error: `Método ${method} no permitido en esta ruta` });

  } catch (error) {
    console.error("[CloudWatch Log] Error detectado:", error);
    return sendResponse(500, { error: "Internal Server Error", detalles: error.message });
  }
};
