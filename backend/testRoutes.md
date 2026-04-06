## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users/search?role=mentor&skill=React` - Search users
- `GET /api/users/mentors?skill=React` - Get mentors
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/projects` - Get user's projects
- `PUT /api/users/profile` - Update own profile (protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/search?category=AI/ML&stage=mvp` - Search projects
- `GET /api/projects/my-projects` - Get my projects (protected)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)
- `POST /api/projects/:id/like` - Like/unlike project (protected)
- `POST /api/projects/:id/team` - Add team member (protected)
- `DELETE /api/projects/:id/team/:userId` - Remove team member (protected)

### Connections
- `POST /api/connections` - Send connection request (protected)
- `GET /api/connections` - Get all connections (protected)
- `GET /api/connections/received` - Get received requests (protected)
- `GET /api/connections/sent` - Get sent requests (protected)
- `GET /api/connections/network` - Get accepted connections (protected)
- `PUT /api/connections/:id` - Accept/reject request (protected)
- `DELETE /api/connections/:id` - Delete connection (protected)

### Messages
- `POST /api/messages` - Send message (protected)
- `GET /api/messages/conversations` - Get all conversations (protected)
- `GET /api/messages/conversation/:userId` - Get conversation with user (protected)
- `GET /api/messages/unread-count` - Get unread count (protected)
- `PUT /api/messages/:id/read` - Mark message as read (protected)
- `PUT /api/messages/conversation/:userId/read` - Mark conversation as read (protected)
- `DELETE /api/messages/:id` - Delete message (protected)

---