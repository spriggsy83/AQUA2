Running api from Windows:

```
cd aqua2-express-api
set DEBUG=aqua2-express-api:* & npm start
```

Running front-end:

```
cd aqua2-react-fe
npm start
```

Running through Docker:

```
cd aqua2-express-api
docker build -t aqua2-express-api .
docker run -p 4000:4000 -d aqua2-express-api

cd ../aqua2-react-fe
docker build -t aqua2-react-fe .
docker run -p 3000:3000 -d aqua2-react-fe
```
