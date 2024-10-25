<?php
// Database connection
$host = 'localhost';
$db = 'attendance_system';
$user = 'attendees'; // MySQL username
$pass = 'attendanceMS@check'; // MySQL password

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Allow from any origin
header("Access-Control-Allow-Origin: *");
// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content
    exit;
}
// Log data to a file
file_put_contents('log.txt', file_get_contents('php://input'));

// Decode and process data
$data = json_decode(file_get_contents('php://input'), true);

// Log what $data looks like
file_put_contents('log_data.txt', print_r($data, true));

// Fetch input data from the decoded JSON
$name = $data['name'];
$email = $data['email'];
$phone = $data['phone'];
$password = password_hash($data['password'], PASSWORD_BCRYPT); // Hash the password for security
$role = $data['role'];
$fieldOfStudy = $data['fieldOfStudy'];
$laptopModel = $data['laptopModel'];
$carModel = $data['carModel'];
$licensePlateNumber = $data['licensePlateNumber'];
$staffID = $data['staffID'];
$department = $data['department'];
$address = $data['address'];
$city = $data['city'];

// Check if the email already exists
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$response = [];
if ($result->num_rows > 0) {
    $response['success'] = false;
    $response['error'] = "Email already exists";
} else {
    // Insert into the database
    $query = "INSERT INTO users (name, email, phone, password, role, fieldOfStudy, laptopModel, carModel, licensePlateNumber, staffID, department, address, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssssssssssss", $name, $email, $phone, $password, $role, $fieldOfStudy, $laptopModel, $carModel, $licensePlateNumber, $staffID, $department, $address, $city);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "User registered successfully";
    } else {
        $response['success'] = false;
        $response['error'] = "Error registering user";
    }
}

$stmt->close();
$conn->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
