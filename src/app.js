const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  
  const {title} = request.query;

  const results = title 
  ? repositories.filter(r => r.title.include(title))
  : repositories

  return response.json(
    results
  );
});

app.post("/repositories", (request, response) => {
  const {title, url, techs}  = request.body;
  const likes = 0;

  if(title == "" || url == "" || techs == ""){
    return response.status(400).json({error: 'no parameters'})   
  }

  const repository = {id: uuid(), title, url, techs, likes};

  repositories.push(repository);

    return response.json(
      repository
    );
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(p=>p.id == id);

  if(repositoryIndex < 0){
      return response.status(400).json({error: 'Bad Request'})   
  }
  const likes = repositoryIndex.likes ? repositoryIndex.likes : 0;
  
  const repository = {
      id,
      title,
      url,
      techs,
      likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(
    repository
  );
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(p=>p.id == id);

  if(repositoryIndex < 0){
      return response.status(400).json({error: 'Bad Request'})   
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.put("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(p=>p.id == id);

  if(repositoryIndex < 0){
      return response.status(400);//.json("Bad Request");
  }

  const repositoryTemp = repositories.find(p=>p.id == id);

  const likes = repositoryTemp.likes++;
  const title = repositoryTemp.title;
  const url = repositoryTemp.url;
  const techs = repositoryTemp.techs;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repositoryIndex] = repository;

  var json = JSON.stringify({likes:likes});

  return response.end(
    json
  );

});

module.exports = app;
