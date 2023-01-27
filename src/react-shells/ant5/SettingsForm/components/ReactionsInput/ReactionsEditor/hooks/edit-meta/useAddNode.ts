import { Node } from "@antv/x6";
import { useCallback, useEffect } from "react";
import { ActionType } from "../../actions";
import { INodeData } from "../../interfaces";
import { useEditorState } from "../useEditorState";
import { useBackup } from "./useBackup";

export function useAddNode() {
  const { graph, dispatch } = useEditorState()
  const backup = useBackup()
  const handleNodeAdd = useCallback(({ node }: { node: Node, index: number, options: any }) => {
    const { meta } = node.getData() as INodeData
    backup()
    const newData = {
      ...meta,
      id: node.id,
      x6Node: {
        x: node.getPosition().x,
        y: node.getPosition().y,
        width: node.getSize().width,
        height: node.getSize().height,
      }
    }
    node.setData(newData)
    graph?.select(node.id)
    dispatch({
      type: ActionType.ADD_NODE,
      payload: newData
    })
  }, [backup, dispatch, graph])

  useEffect(() => {
    graph?.on('node:added', handleNodeAdd)

    return () => {
      graph?.off('node:added', handleNodeAdd)
    }
  }, [graph, handleNodeAdd])
}