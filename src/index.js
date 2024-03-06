const express = require('express');
const {uuid, isUuid} = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(express.json());


app.use(cors());

const projects = [];

function logRequests(request, response, next){
  const {method, url} = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel); 
  next(); 
  console.timeEnd(logLabel);
}
function validateProjectId(request,response,next){
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error:'invalid project id'});
  }
  return next();
}

app.use(logRequests);
app.use('/projects/:id',validateProjectId);


app.get('/projects',logRequests,(request, response)=>{
  const {title} = request.query;
  const results = (title !== undefined) ? projects.filter(project => project.title.includes(title)): projects;
  if(results.length === 0){
    return response.status(204).json(results);
  }else{
    return response.json(results);
  }
  
});

 
app.put('/projects/:id',(request,response)=>{
  const {id} = request.params;
  const {title,owner} = request.body;
  const projectIndex = projects.findIndex(project => project.id === id);
  
  if(projectIndex >= 0){
    const newProject = {
      id,
      title,
      owner
    }
    projects[projectIndex] = newProject;
    return response.json(newProject);
  }else{
    return response.status(400).json({erro:'project not found'});
  }
  
  
  
});

app.delete('/projects/:id', (request,response)=>{
  const {id} = request.params;
  const projectIndex = projects.findIndex(project => project.id === id);
  
  if(projectIndex >= 0){
    projects.splice(projectIndex,1);
    return response.status(204).json();
  }else{
    return response.status(400).json({erro:'project not found'});
  }
});


app.post('/projects', (request,response)=>{
  
  const {title,owner} = request.body;

  const project = {id:uuid(), title, owner};

  projects.push(project);

  return response.json(project);
});



app.listen(3333,()=>{
  console.log('Back-end iniciado!');
});
