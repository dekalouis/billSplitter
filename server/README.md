# ip-rmt58 - Bill Splitter

# API Documentation

---

### ALL ENDPOINTS:

#### Table of Contents

- **User Endpoints**
  - **POST** /users/register
  - **POST** /users/login
  - **GET** /users/:id
- **Bill Endpoints**
  - **POST** /bills/add-bill
  - **GET** /bills
  - **GET** /bills/:id
  - **PUT** /bills/:id
  - **DELETE** /bills/:id
  - **POST** /bills/upload-image
- **Item Endpoints**
  - **POST** /items
  - **GET** /items/bill/:billId
  - **PUT** /items/:id
  - **DELETE** /items/:id
- **Participant Endpoints**
  - **POST** /participants
  - **GET** /participants/bill/:billId
  - **PUT** /participants/:id
  - **DELETE** /participants/:id
- **Allocation Endpoints**
  - **POST** /allocations
  - **GET** /allocations/item/:itemId
  - **GET** /allocations/participant/:participantId
  - **PUT** /allocations/:id
  - **DELETE** /allocations/:id

---

## User Endpoints

### 1. POST /users/register

**Description**

Register a new user.

**Request Body**

```json
{
  "email": "string (required, unique)",
  "password": "string (required)"
}
```

**Response Examples**

- **201 Created**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "message": "Successful registration!"
  }
  ```
- **400 Bad Request** (Validation error, e.g., missing email/password, or email taken)

  ```json
  {
    "message": "Email already in use"
    // or
    "message": "Email must not be empty"
    // or
    "message": "Password must not be empty"
  }

  ```

---

### 2. POST /users/login

**Description**

Login with existing user credentials.

**Request Body**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response Examples**

- **200 OK**
  ```json
  {
    "access_token": "jwt.token.string"
  }
  ```
- **400 Bad Request** (Missing fields)
  ```json
  {
    "message": "Email and password must be filled"
  }
  ```
- **401 Unauthorized** (Invalid credentials)
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

---

### 3. GET /users/:id

**Description**

Retrieve user data by user ID.

**Requires Authentication**; users can only access their own data.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - the user’s ID (integer)

**Response Examples**

- **200 OK**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2025-02-14T00:00:00.000Z",
    "updatedAt": "2025-02-14T00:00:00.000Z"
  }
  ```
  (Excluding password by design)
- **403 Forbidden**
  ```json
  {
    "message": "You cannot access other user's data"
  }
  ```
- **404 Not Found** (If user doesn’t exist)
  ```json
  {
    "message": "User not found"
  }
  ```

---

## Bill Endpoints

All **Bill** routes require a valid JWT in the Authorization header, except for user registration/login.

### 1. POST /bills/add-bill

**Description**

Create a new bill.

**Headers**

```
Authorization: Bearer <access_token>

```

**Request Body**

```json
{
  "billImageUrl": "string (optional)",
  "vatRate": "number (required)",
  "serviceChargeRate": "number (required)"
}
```

**Response Examples**

- **201 Created**
  ```json
  {
    "message": "Bill created successfully",
    "bill": {
      "id": 123,
      "createdBy": 1,
      "billImageUrl": "http://someimage.url",
      "vatRate": 0.11,
      "serviceChargeRate": 0.1,
      "updatedAt": "2025-02-14T00:00:00.000Z",
      "createdAt": "2025-02-14T00:00:00.000Z"
    }
  }
  ```
- **400 Bad Request** (e.g., invalid vatRate or serviceChargeRate)
  ```json
  {
    "message": "VAT rate and service charge rate must be valid numbers"
  }
  ```

---

### 2. GET /bills

**Description**

Retrieve all bills belonging to a specific user.

Only that user (matching the JWT’s user ID) can see these bills.

**Headers**

```
Authorization: Bearer <access_token>

```

**Response Examples**

- **200 OK**

  ```json
  {
    "bills": [
      {
        "id": 1,
        "totalPayment": 50000,
        "vatAmount": 5000,
        "serviceChargeAmt": 5000,
        "items": [
          {
            "id": 10,
            "name": "Pizza",
            "price": 20000,
            "quantity": 2,
            "participants": [
              { "id": 100, "name": "Alice", "portion": 50 },
              { "id": 101, "name": "Bob", "portion": 50 }
            ]
          },
          {
            "id": 11,
            "name": "Soda",
            "price": 5000,
            "quantity": 1,
            "participants": [{ "id": 102, "name": "Charlie", "portion": 100 }]
          }
        ],
        "participants": [
          { "id": 100, "name": "Alice" },
          { "id": 101, "name": "Bob" },
          { "id": 102, "name": "Charlie" }
        ]
      }
    ]
  }
  ```

- **403 Forbidden** (If `user` does not match the logged-in user’s ID)
  ```json
  {
    "message": "You cannot access other user's bills"
  }
  ```

---

### 3. GET /bills/:id

**Description**

Retrieve a single bill by ID.

Requires authorization check to ensure the bill belongs to the logged-in user.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - Bill’s ID (integer)

**Response Examples**

- **200 OK**

  ```json
  {
    "bills": [
      {
        "id": 1,
        "totalPayment": 50000,
        "vatAmount": 5000,
        "serviceChargeAmt": 5000,
        "items": [
          {
            "id": 10,
            "name": "Pizza",
            "price": 20000,
            "quantity": 2,
            "participants": [
              { "id": 100, "name": "Alice", "portion": 50 },
              { "id": 101, "name": "Bob", "portion": 50 }
            ]
          },
          {
            "id": 11,
            "name": "Soda",
            "price": 5000,
            "quantity": 1,
            "participants": [{ "id": 102, "name": "Charlie", "portion": 100 }]
          }
        ],
        "participants": [
          { "id": 100, "name": "Alice" },
          { "id": 101, "name": "Bob" },
          { "id": 102, "name": "Charlie" }
        ]
      }
    ]
  }
  ```

- **403 Forbidden** (If this bill is not owned by the logged-in user)
  ```json
  {
    "message": "You cannot access other user's bills"
  }
  ```
- **404 Not Found** (Invalid bill ID)
  ```json
  {
    "message": "Bill not found"
  }
  ```

---

### 4. PUT /bills/:id

**Description**

Update an existing bill’s image URL, vatRate, or serviceChargeRate.

Requires authorization check.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - Bill’s ID (integer)

**Request Body**

```json
{
  "billImageUrl": "string (optional)",
  "vatRate": "number (optional)",
  "serviceChargeRate": "number (optional)"
}
```

**Response Examples**

- **200 OK**
  ```json
  {
    "message": "Bill updated successfully"
  }
  ```
- **403 Forbidden** (If user doesn’t own the bill)
  ```json
  {
    "message": "You cannot access other user's bills"
  }
  ```
- **404 Not Found** (Invalid bill ID)
  ```json
  {
    "message": "Bill not found"
  }
  ```

---

### 5. DELETE /bills/:id

**Description**

Delete an existing bill.

Requires authorization check.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - Bill’s ID (integer)

**Response Examples**

- **200 OK**
  ```json
  {
    "message": "Bill deleted successfully"
  }
  ```
- **404 Not Found** (Invalid bill ID)
  ```json
  {
    "message": "Bill not found"
  }
  ```
- **403 Forbidden** (If user doesn’t own the bill)
  ```json
  {
    "message": "You cannot access other user's bills"
  }
  ```

---

### 6. POST /bills/upload-image

**Description**

Upload a bill image using multipart/form-data.

Requires an `image` file in the request. Internally, this calls an OpenAI function to parse the bill data (as an example). The returned JSON from OpenAI is also included in the response.

**Headers**

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

```

**Form-Data**

- Key: `image`, Value: file (e.g., .jpg)

**Response Examples**

- **200 OK**
  ```json
  {
    "message": "File uploaded successfully",
    "imageUrl": "https://ik.imagekit.io/your-bucket-id/bill-uploads/food.jpg",
    "rawGPT": "{\"items\":[{\"name\":\"Ayam Goreng\",\"quantity\":1,\"price\":15000}],\"vatAmount\":1650,\"serviceChargeAmt\":1500,\"totalPayment\":18000}",
    "data": {
      "items": [
        {
          "name": "Ayam Goreng",
          "quantity": 1,
          "price": 15000
        }
      ],
      "vatAmount": 1650,
      "serviceChargeAmt": 1500,
      "totalPayment": 18000
    }
  }
  ```
- **400 Bad Request** (No file uploaded / invalid GPT response)

or

    ```json
    {
      "message": "No file uploaded"
    }

    ```

    ```json
    {
      "message": "GPT output is not valid JSON"
    }

    ```

---

## Item Endpoints

All **Item** routes require a valid JWT.

### 1. POST /items

**Description**

Create a new item associated with a Bill.

**Headers**

```
Authorization: Bearer <access_token>

```

**Request Body**

```json
{
  "name": "string (required)",
  "quantity": "integer (required)",
  "price": "integer (required)",
  "BillId": "integer (required)"
}
```

**Response Examples**

- **201 Created**
  ```json
  {
    "message": "Item created",
    "item": {
      "id": 101,
      "name": "Fried Rice",
      "quantity": 2,
      "price": 30000,
      "BillId": 15,
      "updatedAt": "2025-02-14T00:00:00.000Z",
      "createdAt": "2025-02-14T00:00:00.000Z"
    }
  }
  ```
- **400 Bad Request** (Missing required fields)
  ```json
  {
    "message": "BadRequest - some fields are missing"
  }
  ```

---

### 2. GET /items/bill/:billId

**Description**

Retrieve all items associated with a given bill.

**Authorization**: Only the bill owner can retrieve items from that bill.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `billId` - Bill’s ID (integer)

**Response Examples**

- **200 OK**
  ```json
  [
    {
      "id": 1,
      "name": "Fried Rice",
      "quantity": 2,
      "price": 30000,
      "BillId": 15,
      "createdAt": "2025-02-14T00:00:00.000Z",
      "updatedAt": "2025-02-14T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Iced Tea",
      "quantity": 1,
      "price": 5000,
      "BillId": 15,
      "createdAt": "2025-02-14T00:00:00.000Z",
      "updatedAt": "2025-02-14T00:00:00.000Z"
    }
  ]
  ```
- **403 Forbidden** (Not the bill’s owner)
  ```json
  {
    "message": "You cannot access other user's bills"
  }
  ```
- **404 Not Found** (Bill not found or user not authorized)

  ```json
  {
    "message": "Item not found"
    // or
    "message": "Bill not found"
  }

  ```

---

### 3. PUT /items/:id

**Description**

Update an item’s name, quantity, or price.

**Authorization**: Must own the bill that the item belongs to.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - Item’s ID (integer)

**Request Body**

```json
{
  "name": "string (optional)",
  "quantity": "integer (optional)",
  "price": "integer (optional)"
}
```

**Response Examples**

- **200 OK**
  ```json
  {
    "message": "Item updated successfully"
  }
  ```
- **404 Not Found** (Item not found or belongs to another user)
  ```json
  {
    "message": "Item not found"
  }
  ```
- **403 Forbidden** (Not the owner)
  ```json
  {
    "message": "You cannot update items in other user's bills"
  }
  ```

---

### 4. DELETE /items/:id

**Description**

Delete an item.

**Authorization**: Must own the bill that the item belongs to.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - Item’s ID (integer)

**Response Examples**

- **200 OK**
  ```json
  {
    "message": "Item deleted successfully"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "Item not found"
  }
  ```
- **403 Forbidden**
  ```json
  {
    "message": "You cannot delete items in other user's bills"
  }
  ```

---

## Participant Endpoints

All **Participant** routes require a valid JWT.

### 1. POST /participants

**Description**

Create a new participant linked to a Bill.

**Headers**

```
Authorization: Bearer <access_token>

```

**Request Body**

```json
{
  "name": "string (required)",
  "BillId": "integer (required)"
}
```

**Response Examples**

- **201 Created**
  ```json
  {
    "message": "Participant created",
    "participant": {
      "id": 50,
      "name": "Alice",
      "BillId": 15,
      "createdAt": "2025-02-14T00:00:00.000Z",
      "updatedAt": "2025-02-14T00:00:00.000Z"
    }
  }
  ```
- **400 Bad Request** (Missing fields)
  ```json
  {
    "message": "BadRequest - 'name' or 'BillId' is missing"
  }
  ```

---

### 2. GET /participants/bill/:billId

**Description**

Retrieve all participants for a given Bill.

**Authorization**: Must own the bill to view participants.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `billId` - Bill’s ID (integer)

**Response Examples**

- **200 OK**
  ```json
  [
    {
      "id": 101,
      "name": "Alice",
      "BillId": 15,
      "createdAt": "2025-02-14T00:00:00.000Z",
      "updatedAt": "2025-02-14T00:00:00.000Z"
    },
    {
      "id": 102,
      "name": "Bob",
      "BillId": 15,
      "createdAt": "2025-02-14T00:00:00.000Z",
      "updatedAt": "2025-02-14T00:00:00.000Z"
    }
  ]
  ```
- **403 Forbidden**
  ```json
  {
    "message": "You cannot access other user's bills"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "Participant not found"
  }
  ```

---

### 3. PUT /participants/:id

**Description**

Update the participant’s name.

**Authorization**: Must own the bill that the participant belongs to.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - Participant’s ID (integer)

**Request Body**

```json
{
  "name": "string"
}
```

**Response Examples**

- **200 OK**
  ```json
  {
    "message": "Participant updated successfully"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "Participant not found"
  }
  ```
- **400 Bad Request** (Update failed)
  ```json
  {
    "message": "Update failed"
  }
  ```
- **403 Forbidden**
  ```json
  {
    "message": "You cannot update participants in other user's bills"
  }
  ```

---

### 4. DELETE /participants/:id

**Description**

Delete a participant.

**Authorization**: Must own the bill that the participant belongs to.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - Participant’s ID (integer)

**Response Examples**

- **200 OK**
  ```json
  {
    "message": "Participant deleted successfully"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "Participant not found"
  }
  ```
- **403 Forbidden**
  ```json
  {
    "message": "You cannot delete participants in other user's bills"
  }
  ```

---

## Allocation Endpoints

All **Allocation** routes require a valid JWT.

### 1. POST /allocations

**Description**

Create a new item allocation, linking an Item and a Participant.

**Headers**

```
Authorization: Bearer <access_token>

```

**Request Body**

```json
{
  "allocatedQuantity": "integer (required)",
  "ParticipantId": "integer (required)",
  "ItemId": "integer (required)"
}
```

**Response Examples**

- **201 Created**
  ```json
  {
    "message": "Allocation created",
    "allocation": {
      "id": 77,
      "allocatedQuantity": 1,
      "ParticipantId": 50,
      "ItemId": 101,
      "updatedAt": "2025-02-14T00:00:00.000Z",
      "createdAt": "2025-02-14T00:00:00.000Z"
    }
  }
  ```
- **404 Not Found** (If Item or Participant doesn’t exist)

  ```json
  {
    "message": "Item not found"
  }
  // or
  {
    "message": "Participant not found"
  }

  ```

- **400 Bad Request** (Invalid or missing fields)
  ```json
  {
    "message": "Invalid allocation data"
  }
  ```

---

### 2. GET /allocations/item/:itemId

**Description**

Retrieve all allocations associated with a specific item.

Requires that the user own the bill that the item belongs to (checked in middleware).

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `itemId` - Item’s ID (integer)

**Response Examples**

- **200 OK**
  ```json
  [
    {
      "id": 101,
      "allocatedQuantity": 2,
      "ParticipantId": 50,
      "ItemId": 15,
      "createdAt": "2025-02-14T00:00:00.000Z",
      "updatedAt": "2025-02-14T00:00:00.000Z"
    },
    {
      "id": 102,
      "allocatedQuantity": 1,
      "ParticipantId": 51,
      "ItemId": 15,
      "createdAt": "2025-02-14T00:00:00.000Z",
      "updatedAt": "2025-02-14T00:00:00.000Z"
    }
  ]
  ```
- **403 Forbidden**
  ```json
  {
    "message": "You cannot access other user's items"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "Allocation not found"
  }
  ```

---

### 3. GET /allocations/participant/:participantId

**Description**

Retrieve all allocations linked to a specific participant.

Requires that the user own the bill that the participant belongs to.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `participantId` - Participant’s ID (integer)

**Response Examples**

- **200 OK**
  ```json
  [
    {
      "id": 201,
      "allocatedQuantity": 1,
      "ParticipantId": 50,
      "ItemId": 10,
      "createdAt": "2025-02-14T00:00:00.000Z",
      "updatedAt": "2025-02-14T00:00:00.000Z"
    },
    {
      "id": 202,
      "allocatedQuantity": 3,
      "ParticipantId": 50,
      "ItemId": 11,
      "createdAt": "2025-02-14T00:00:00.000Z",
      "updatedAt": "2025-02-14T00:00:00.000Z"
    }
  ]
  ```
- **403 Forbidden**
  ```json
  {
    "message": "You cannot access other user's participants"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "Allocation not found"
  }
  ```

---

### 4. PUT /allocations/:id

**Description**

Update an allocation’s `allocatedQuantity`.

**Authorization**: Must own the associated Bill.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - Allocation’s ID (integer)

**Request Body**

```json
{
  "allocatedQuantity": "integer (required)"
}
```

**Response Examples**

- **200 OK**
  ```json
  {
    "message": "Allocation updated successfully"
  }
  ```
- **404 Not Found** (Allocation doesn’t exist or belongs to another user)
  ```json
  {
    "message": "Allocation not found"
  }
  ```

---

### 5. DELETE /allocations/:id

**Description**

Delete an allocation.

**Authorization**: Must own the associated Bill.

**Headers**

```
Authorization: Bearer <access_token>

```

**URL Parameters**

- `id` - Allocation’s ID (integer)

**Response Examples**

- **200 OK**
  ```json
  {
    "message": "Allocation deleted successfully"
  }
  ```
- **404 Not Found**
  ```json
  {
    "message": "Allocation not found"
  }
  ```

---

## Common Error Response Examples

Many endpoints use the same error structures. Examples:

- **401 Unauthorized**
  Missing or invalid token:

  ````json
  {
  "message": "Invalid token"
  }

      ```

  ````

- **403 Forbidden**
  User is authenticated but does not have the permission to access/modify this data:

  ````json
  {
  "message": "Forbidden"
  }

      ```

  ````

- **404 Not Found**
  Resource not found for the provided ID:

  ````json
  {
  "message": "<Resource> not found"
  }

      ```

  ````

- **400 Bad Request**
  Invalid input or required fields missing:

  ````json
  {
  "message": "BadRequest"
  }

      ```
  ````

---

**End of API Documentation**
