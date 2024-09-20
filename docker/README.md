
### Starting the Program
To start the program, use the following command:

```bash
docker-compose up --build -d
```

- **API Port:** 18080
- **Website Port:** 8080

### Testing the API
Since the "add node" functionality is not implemented yet, you can test by making API calls from the website's shell.

1. Open the web shell using:

    ```bash
    docker-compose exec web sh
    ```

2. From the web shell, install curl if it's not already installed:

    ```bash
    apk add --no-cache curl
    ```

3. To make a test API call, run the following command:

    ```bash
    curl -X POST http://api:18080/api/add_object \
         -H 'Content-Type: application/json' \
         -d '{"serial": "DEF456", "name": "Child Object", "parent_id": 1}'
    ```
