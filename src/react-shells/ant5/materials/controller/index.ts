import { IReactionMaterial } from "runner/reaction/interfaces/material";
import { reactionMaterial } from "./reaction";
import { setPropMaterial } from "./setProp";
import { listenVariableMaterial, readVariableMaterial, setVariableMaterial } from "./variable";

export const controllerReactions: IReactionMaterial[] = [
  setVariableMaterial,
  listenVariableMaterial,
  setPropMaterial,
  readVariableMaterial,
  reactionMaterial,
]
