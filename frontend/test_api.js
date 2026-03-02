const fetch = require('node-fetch');

async function testApi() {
    try {
        console.log("Checking if API is reachable...");
        // Since we don't have token natively, we'll just check if the backend throws 401 instead of 404
        const res = await fetch('http://localhost:8080/api/projects/1/tasks/1/is-new');
        console.log("Response status:", res.status);
    } catch(e) {
        console.error(e.message);
    }
}
testApi();
