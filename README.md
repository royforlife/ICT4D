# ICT4D

### backend

```shell
cd backend
pip install -r requirements.txt
python app.py
```

### frontend 

1. edit URL IP address:

if you deployment in a server with an IP address, you should edit the frontend/util/api.js 
replace the "http://127.0.0.1:4000" with "http://{IP_address}:4000" 

2. run program:

```
cd frontend
npm config set legacy-peer-deps true
npm install
npm start
```

### open browser

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
