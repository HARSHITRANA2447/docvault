# DocVault

An intelligent document vault built with Spring Boot, MongoDB, and AI-powered summarization. Upload documents, extract text using Apache Tika, and get AI-generated summaries instantly.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (User and Admin roles)
- **Document Upload**: Support for PDF and text files with secure file storage
- **Text Extraction**: Apache Tika integration for extracting text from various document formats
- **AI Summarization**: OpenAI GPT integration for generating document summaries
- **Admin Panel**: Administrative interface for managing users and documents
- **Responsive UI**: Modern, responsive frontend built with vanilla JavaScript
- **RESTful API**: Well-structured REST API for all operations

## Technologies Used

- **Backend**: Spring Boot 3.2.3, Java 17
- **Database**: MongoDB
- **Security**: JWT (JSON Web Tokens), Spring Security
- **Text Processing**: Apache Tika
- **AI Integration**: OpenAI API
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Tool**: Maven

## Prerequisites

- Java 17 or higher
- MongoDB (running on localhost:27017)
- Maven 3.6+
- OpenAI API key (for AI summarization features)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/docvault.git
   cd docvault
   ```

2. **Configure MongoDB:**
   - Ensure MongoDB is running on `localhost:27017`
   - The application will create the database `docvault` automatically

3. **Configure OpenAI API:**
   - Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
   - Update `src/main/resources/application.properties`:
     ```properties
     ai.api.key=YOUR_OPENAI_API_KEY_HERE
     ```

4. **Build and run the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

   Or on Windows:
   ```cmd
   mvnw.cmd spring-boot:run
   ```

5. **Access the application:**
   - Frontend: http://localhost:8080
   - API Base URL: http://localhost:8080

## Configuration

Key configuration options in `application.properties`:

- `server.port`: Server port (default: 8080)
- `spring.data.mongodb.uri`: MongoDB connection URI
- `jwt.secret`: JWT signing secret
- `jwt.expiration`: JWT token expiration time (default: 24 hours)
- `file.upload-dir`: Directory for file uploads (default: ./uploads)
- `ai.api.url`: OpenAI API endpoint
- `ai.api.key`: Your OpenAI API key
- `ai.model`: OpenAI model to use (default: gpt-3.5-turbo)

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### User Operations
- `POST /user/upload` - Upload a document (requires authentication)
- `GET /user/documents` - Get user's documents (requires authentication)

### Admin Operations (requires ADMIN role)
- `GET /admin/users` - Get all users
- `GET /admin/documents` - Get all documents
- `PUT /admin/user/{id}` - Update user details
- `PUT /admin/document/{id}` - Update document details

## Usage

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Upload Documents**: Use the upload interface to add PDF or text files
3. **View Summaries**: Uploaded documents are automatically processed and summarized using AI
4. **Manage Documents**: Users can view their documents; admins can manage all documents and users

## CORS Configuration

The application includes CORS configuration to allow frontend-backend communication. If you encounter CORS issues, ensure the frontend is served from the correct origin.

## File Upload Limits

- Maximum file size: 10MB per file
- Maximum request size: 10MB
- Supported formats: PDF, DOCX, TXT, and other text-extractable formats

## Development

### Running Tests
```bash
./mvnw test
```

### Building for Production
```bash
./mvnw clean package
```

### IDE Setup
- Import as a Maven project in your preferred IDE
- Ensure Lombok plugin is installed for annotation processing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) for the framework
- [Apache Tika](https://tika.apache.org/) for text extraction
- [OpenAI](https://openai.com/) for AI summarization
- [MongoDB](https://www.mongodb.com/) for the database</content>
<parameter name="filePath">C:\Users\harshit rana\IdeaProjects\docvault\README.md
