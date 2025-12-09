# Feedback Module API Documentation

## Base URL
`http://localhost:5000/feedback`

## Endpoints

### 1. Create Feedback
- **Method**: POST
- **Endpoint**: `/`
- **Request Body**:
  ```json
  {
    "title": "String (required)",
    "status": "String (default: 'Open')",
    "formJson": "JSON object (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "Integer",
      "title": "String",
      "status": "String",
      "formJson": "JSON object",
      "createdAt": "DateTime",
      "updatedAt": "DateTime"
    }
  }
  ```

### 2. Get All Feedback
- **Method**: GET
- **Endpoint**: `/`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "Integer",
        "title": "String",
        "status": "String",
        "formJson": "JSON object",
        "createdAt": "DateTime",
        "updatedAt": "DateTime"
      }
    ]
  }
  ```

### 3. Get Feedback by ID
- **Method**: GET
- **Endpoint**: `/:id`
- **URL Parameters**: `id` (Integer)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "Integer",
      "title": "String",
      "status": "String",
      "formJson": "JSON object",
      "createdAt": "DateTime",
      "updatedAt": "DateTime"
    }
  }
  ```

### 4. Update Feedback
- **Method**: PUT
- **Endpoint**: `/:id`
- **URL Parameters**: `id` (Integer)
- **Request Body**:
  ```json
  {
    "title": "String (optional)",
    "status": "String (optional)",
    "formJson": "JSON object (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "Integer",
      "title": "String",
      "status": "String",
      "formJson": "JSON object",
      "createdAt": "DateTime",
      "updatedAt": "DateTime"
    }
  }
  ```

### 5. Delete Feedback
- **Method**: DELETE
- **Endpoint**: `/:id`
- **URL Parameters**: `id` (Integer)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Feedback deleted"
  }
  ```

## Error Responses
All endpoints return the following structure on error:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Testing Guide

### Test Cases

1. Create Feedback:
```bash
curl -X POST http://localhost:5000/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Feedback",
    "status": "Open",
    "formJson": {"field1": "value1"}
  }'
```

2. Get All Feedback:
```bash
curl http://localhost:5000/feedback
```

3. Get Single Feedback:
```bash
curl http://localhost:5000/feedback/1
```

4. Update Feedback:
```bash
curl -X PUT http://localhost:5000/feedback/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Closed"
  }'
```

5. Delete Feedback:
```bash
curl -X DELETE http://localhost:5000/feedback/1
```