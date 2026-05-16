docker stop audira-route
docker rm audira-route
docker build -t audira-route .
docker run -d --name audira-route -p 20128:20128 --env-file .env -v audira-route-data:/app/data audira-route