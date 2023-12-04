## Register Controller

- **Route:** `/register`
- **Description:** Registers a new user in the system.
- **Method:** `POST`
- **Parameters:**
  - `email` (string): User's email.
  - `password` (string): User's password.
  - `birthday` (Date): User's date of birth.
- **Responses:**
  - `statusCode: 200`: User created successfully.
  - `statusCode: 400`: Validation error or email already exists.

## Login Controller

- **Route:** `/login`
- **Description:** Allows a user to log in to the system.
- **Method:** `POST`
- **Parameters:**
  - `email` (string): User's email.
  - `password` (string): User's password.
- **Responses:**
  - `statusCode: 200`: User authenticated successfully.
  - `statusCode: 400`: Validation error or incorrect credentials.

## Verification Controller

- **Route:** `/validate`
- **Description:** Verifies a user's verification code.
- **Method:** `POST`
- **Parameters:**
  - `verificationCode` (number): Verification code.
- **Responses:**
  - `statusCode: 200`: User verified successfully.
  - `statusCode: 400`: Invalid verification code.

## Sent Verification Code Controller

- **Route:** `/sent-code`
- **Description:** Sends a verification code to the user.
- **Method:** `GET`
- **Responses:**
  - `statusCode: 200`: Verification code sent successfully.
  - `statusCode: 409`: User already validated.

## Add User Info Controller

- **Route:** `/add-info`
- **Description:** Adds additional information to the user's profile.
- **Method:** `POST`
- **Parameters:**
  - `name` (string): User's name.
  - `lastname` (string): User's last name.
  - `phone` (string, optional): User's phone number.
- **Responses:**
  - `statusCode: 200`: User information updated successfully.
  - `statusCode: 400`: Validation error or information already added.
