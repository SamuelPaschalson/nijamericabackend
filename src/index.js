const http = require("http");
const server = require("./server");

const port = process.env.PORT || 3000;

const startServer = () => {
	server.listen(port, "0.0.0.0", () => {
		console.log("Backend server (api) is running on port: ", port);
	});
};

startServer();
