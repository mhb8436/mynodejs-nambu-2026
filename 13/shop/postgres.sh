docker run -d \
  --name myshop-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=myshop \
  -p 5432:5432 \
  -v myshop-pgdata:/var/lib/postgresql/data \
  postgres:16