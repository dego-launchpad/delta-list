import childProcess from 'child_process';
import fs from 'fs';
import projects from './main.json';
import { Project } from './validate';

childProcess.execSync('git clone https://github.com/dego-launchpad/delta-list.git --depth=1 delta-list-main')

const mainFile =  fs.readFileSync('delta-list-main/main.json','utf-8')

const mainProjects =  JSON.parse(mainFile) as Project[]

mainProjects.forEach((p,index)=>{
  const currentProject = (projects as Project[]).find(project=>project.id===p.id)
  Object.entries(p).forEach(([key,value])=>{
    const _value = currentProject?.[key as keyof Project]
    if((typeof value === 'object' && JSON.stringify(_value)!==JSON.stringify(value)) || _value!==value){
      throw new Error(`old projects' ${index} index was changed!`)
    }
  })
})


