"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuidv4_1 = require("uuidv4");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const projects = [];
function logRequests(req, resp, next) {
    const { method, url } = req;
    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.time(logLabel);
    next();
    console.timeEnd(logLabel);
}
function validateProjectId(request, response, next) {
    const { id } = request.params;
    if (!(0, uuidv4_1.isUuid)(id)) {
        response.status(400).json({ error: "invalid project id" });
    }
    next();
}
app.use(logRequests);
app.use("/projects/:id", validateProjectId);
app.get("/projects", logRequests, (request, response) => {
    const objeto = request.query;
    const results = objeto.title !== undefined
        ? projects.filter((project) => project.title.includes(objeto.title))
        : projects;
    if (results.length === 0) {
        response.status(204).json(results);
    }
    else {
        response.json(results);
    }
});
app.put("/projects/:id", (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;
    const projectIndex = projects.findIndex((project) => project.id === id);
    if (projectIndex >= 0) {
        const newProject = {
            id,
            title,
            owner,
        };
        projects[projectIndex] = newProject;
        response.json(newProject);
    }
    else {
        response.status(400).json({ erro: "project not found" });
    }
});
app.delete("/projects/:id", (request, response) => {
    const { id } = request.params;
    const projectIndex = projects.findIndex((project) => project.id === id);
    if (projectIndex >= 0) {
        projects.splice(projectIndex, 1);
        response.status(204).json();
    }
    else {
        response.status(400).json({ erro: "project not found" });
    }
});
app.post("/projects", (request, response) => {
    const { title, owner } = request.body;
    const project = { id: (0, uuidv4_1.uuid)(), title, owner };
    projects.push(project);
    response.json(project);
});
app.listen(3333, () => {
    console.log("Back-end iniciado!");
});
