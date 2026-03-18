#!/bin/bash

PROJECT_NAME="zeb-backend"

echo "Creating project: $PROJECT_NAME"

# Root
mkdir $PROJECT_NAME
cd $PROJECT_NAME

# Create folder structure
mkdir -p src/config
mkdir -p src/models
mkdir -p src/controllers
mkdir -p src/routes
mkdir -p src/services
mkdir -p src/middleware
mkdir -p src/utils
mkdir -p src/types
mkdir -p uploads

# Create base files
touch src/app.ts
touch src/server.ts

touch src/config/db.ts

touch src/models/user.model.ts
touch src/models/art.model.ts

touch src/controllers/user.controller.ts
touch src/controllers/art.controller.ts

touch src/routes/user.routes.ts
touch src/routes/art.routes.ts

touch src/services/hash.service.ts

touch src/middleware/auth.middleware.ts

touch src/utils/constants.ts

touch .env
touch .gitignore
touch README.md

echo "Node project structure created successfully."
