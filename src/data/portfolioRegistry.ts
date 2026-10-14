import { experiences } from "./experience";
import { projects } from "./projects";
import { publications } from "./publications";
import { certifications } from "./certifications";
import { achievements } from "./achievements";
import { education } from "./education";
import { skillGroups } from "./skills";

export type RecordKind = "experience" | "project" | "publication" | "certification" | "achievement";
type Identified = {id:string};
function unique<T extends Identified>(items:T[],kind:RecordKind):T[]{
 const ids=new Set<string>();
 for(const item of items){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id))throw new Error(kind+" invalid id "+item.id);
  if(ids.has(item.id))throw new Error(kind+" duplicate id "+item.id);
  ids.add(item.id);
 }
 return items;
}
export const portfolioRegistry={
 experiences:unique(experiences,"experience"),
 projects:unique(projects,"project"),
 publications:unique(publications,"publication"),
 certifications:unique(certifications,"certification"),
 achievements:unique(achievements,"achievement"),
 education,skillGroups
};
export type PortfolioRegistry=typeof portfolioRegistry;
export function exhibitPage<T>(items:readonly T[],page:number,size=4):T[]{
 return items.slice(Math.max(0,Math.floor(page))*size,Math.max(0,Math.floor(page))*size+size);
}
export function appendValidated<T extends Identified>(items:readonly T[],entry:T,kind:RecordKind):T[]{
 return unique([...items,entry],kind);
}
