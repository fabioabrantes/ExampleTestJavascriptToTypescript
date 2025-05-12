import express, { Request, Response, NextFunction } from "express";
import { uuid, isUuid } from "uuidv4";
import cors from "cors";

type Project = {
  id: string;
  title: string;
  owner: string;
};
const app = express();

app.use(express.json());

app.use(cors());

const projects:Project[] = [] ;

function logRequests(req: Request, resp: Response, next: NextFunction) {
  const { method, url } = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}
function validateProjectId(request:Request, response:Response, next:NextFunction) {
  const { id } = request.params;

  if (!isUuid(id)) {
    response.status(400).json({ error: "invalid project id" });
  }
   next();
}

app.use(logRequests);
app.use("/projects/:id", validateProjectId);

type ObjetQuery ={
  title:string;
}
app.get("/projects", logRequests, (request, response) => {
  
  const objeto = request.query as ObjetQuery;
  
  const results =
    objeto.title !== undefined
      ? projects.filter((project) => project.title.includes(objeto.title))
      : projects;
  if (results.length === 0) {
     response.status(204).json(results);
  } else {
    response.json(results);
  }
});

app.put("/projects/:id", (request:Request, response:Response) => {
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
  } else {
    response.status(400).json({ erro: "project not found" });
  }
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex >= 0) {
    projects.splice(projectIndex, 1);
    response.status(204).json();
  } else {
     response.status(400).json({ erro: "project not found" });
  }
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

   response.json(project);
});

app.listen(3333, () => {
  console.log("Back-end iniciado!");
});
