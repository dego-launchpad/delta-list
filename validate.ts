import dayjs from 'dayjs';
import projects from './main.json';
import fs from 'fs';

/**
 * project information need add in /main.json
 */
export interface Project {
  /**
   * uniquely identifies, can use project name without space
   * This field will be used as the project route, and the resource storage directory name such as pictures|documents
   */
  id: string

  /**
   * the project type.
   * erc-20: target token is ERC20 token,
   * brc-20: target token is BRC20 token,
   * brc-20-lucky: target token is BRC20 token and will be a lucky pool just for whitelist users
   */
  project_type: 'erc-20' | 'brc-20' | 'brc-20-lucky' | 'ticket-whitelist' | 'ticket-stake'

  /**
   * project contract address
   */
  contract_address: string

  /**
   * public | private
   */
  pool_type: 'public' | 'private'

  /**
   * project name
   */
  title: string

  /**
   * project description
   */
  summary: string

  /**
   * project chain info
   */
  chain_info: {
    id: number
    name: string
  }

  /**
   * project unlock method
   */
  unlock_method?: {
    method: 'Linear Unlock'
    desc: 'desc...'
  }

  /**
   * project nft name
   */
  nft_name: string

  /**
   * user will pay cost token to get target token
   */
  cost_token: {
    name: string
    symbol: string
  }

  /**
   * user will pay cost token to get target token
   */
  target_token: {
    name: string
    symbol: string
  }

  /**
   * 'twitter' | 'telegram' | 'discord' | 'website'
   */
  social_accounts: {
    type: 'twitter' | 'telegram' | 'discord' | 'website'
    address: string
  }[]

  /**
   * project start time (time to enter project preparation phase)
   * Notice: please use the UTC time format YYYY-MM-DDThh:mm:ssTZD
   */
  start_time: string

  /**
   * project start time
   * if erc-20 project, this field means the time project will be end
   * if brc-20 or brc-20-lucky project, this field means the time user can claim nft to get target token
   * Notice: please use the UTC time format YYYY-MM-DDThh:mm:ssTZD
   */
  end_time: string

  /**
   * the time when nft will be expired
   */
  expiration_time?: string
}


// is projects a array of Project

if(!Array.isArray(projects)){
  throw new Error('projects is not a array')
}

const projectIDs:string[] = [];

const projectContractAddress:string[] = [];

(projects as Project[]).forEach((project,index)=>{
  if(!project.id){
    throw new Error(`index ${index}'s project.id is required`)
  }
  
  if(projectIDs.includes(project.id)){
    throw new Error(`index ${index}'s project.id ${project.id} is duplicated`)
  }

  projectIDs.push(project.id)

  if(!project.project_type || ['erc-20','brc-20','brc-20-lucky'].includes(project.project_type)){
    throw new Error(`index ${index}'s project.project_type is required and must be erc-20|brc-20|brc-20-lucky`)
  }

  if(!project.pool_type){
    throw new Error(`index ${index}'s project.pool_type is required`)
  }

  if(project.pool_type!=='public' && project.pool_type!=='private'){
    throw new Error(`index ${index}'s project.pool_type is invalid, it should be public or private`)
  }

  if(!project.contract_address){
    throw new Error(`index ${index}'s project.contract_address is required`)
  }

  if(projectContractAddress.includes(project.contract_address)){
    throw new Error(`index ${index}'s project.contract_address is duplicated`)
  }

  projectContractAddress.push(project.contract_address)

  if(!project.title){
    throw new Error(`index ${index}'s project.title is required`)
  }

  if(!project.summary){
    throw new Error(`index ${index}'s project.summary is required`)
  }

  if(!project.social_accounts || !Array.isArray(project.social_accounts)){
    throw new Error(`index ${index}'s project.social_accounts is required and must be a Array`)
  }

  for(let s=0;s<project.social_accounts.length;s++){
    const account = project.social_accounts[s];
    if(!account.type || !['twitter','telegram','discord','website'].includes(account.type)){
      throw new Error(`index ${index}'s project.social_accounts' type is required and must be twitter or telegram or discord or website`)
    }
    if(!account.address){
      throw new Error(`index ${index}'s project.social_accounts' address is required`)
    }
  }
  
  if(!project.chain_info){
    throw new Error(`index ${index}'s project.chain_info is required`)
  }
  
  if(!project.chain_info.id){
    throw new Error(`index ${index}'s project.chain_info.id is required`)
  }
  
  if(!project.chain_info.name){
    throw new Error(`index ${index}'s project.chain_info.name is required`)
  }


  if(!project.nft_name){
    throw new Error(`index ${index}'s project.nft_name is required`)
  }

  if(!project.cost_token){
    throw new Error(`index ${index}'s project.cost_token is required`)
  }

  if(!project.cost_token.name){
    throw new Error(`index ${index}'s project.cost_token.name is required`)
  }
  
  if(!project.cost_token.symbol){
    throw new Error(`index ${index}'s project.cost_token.symbol is required`)
  }

  if(!project.target_token){
    throw new Error(`index ${index}'s project.target_token is required`)
  }

  if(!project.target_token.name){
    throw new Error(`index ${index}'s project.target_token.name is required`)
  }
  
  if(!project.target_token.symbol){
    throw new Error(`index ${index}'s project.target_token.symbol is required`)
  }

  // if(!project.unlock_method){
  //   throw new Error(`index ${index}'s project.unlock_method is required`)
  // }
  // if(!project.unlock_method.method){
  //   throw new Error(`index ${index}'s project.unlock_method.method is required`)
  // }
  // if(!project.unlock_method.desc){
  //   throw new Error(`index ${index}'s project.unlock_method.desc is required`)
  // }


  if(!project.start_time || !dayjs(project.start_time,'YYYY-MM-DDThh:mm:ssZ',true).isValid()){
    throw new Error(`index ${index}'s project.start_time is required and must be YYYY-MM-DDThh:mm:ssTZD`)
  }

  if(!project.end_time || !dayjs(project.end_time,'YYYY-MM-DDThh:mm:ssZ',true).isValid()){
    throw new Error(`index ${index}'s project.end_time is required and must be YYYY-MM-DDThh:mm:ssTZD`)
  }

  if(!project.expiration_time || !dayjs(project.expiration_time,'YYYY-MM-DDThh:mm:ssZ',true).isValid()){
    throw new Error(`index ${index}'s project.expiration_time is required and must be YYYY-MM-DDThh:mm:ssTZD`)
  }
})

const needFiles = ['description.md','detail-cover.png','list-cover.png','logo.png','nft.png']

for (let i =0; i<projectIDs.length;i++){
  const id = projectIDs[i];

  const files =  fs.readdirSync(`./projects/${id}`)

  needFiles.forEach(nf=>{
    if(!files.includes(nf)){
      throw new Error(`project ${id}'s folder is missing ${nf}`)
    }
  })

}

