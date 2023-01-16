import { Graph, Path } from "@antv/x6";
import { Button, Space } from "antd"
import { useToken } from "antd/es/theme/internal";
import { memo, useEffect, useRef, useState } from "react"
import { redoIcon, undoIcon } from "react-shells/ant5/icons";
import styled from "styled-components";
import { AlgoNode } from "./AlgoNode";
import { useAddNodes } from "./hooks/useAddNodes";
import "./style.less"
import { register } from '@antv/x6-react-shape'
import { Selection } from '@antv/x6-plugin-selection'

const SytledContent = styled.div`
  height: calc(100vh - 160px);
  display: flex;
  border: solid 1px;
`

const LeftArea = styled.div`
  width: 220px;
  border-right: solid 1px;
  padding: 8px;
`

const CenterArea = styled.div`
  flex:1;
  display: flex;
  flex-flow: column;
`

const Toolbar = styled.div`
  display: flex;
  padding: 0 8px;
  height: 40px;
  align-items: center;
  border-bottom: solid 1px;
`

const CanvasContainer = styled.div`
  flex: 1;
`

const PropertyBox = styled.div`
  width: 220px;
  border-left: solid 1px;
  padding: 8px;
`

register({
  shape: 'dag-node',
  width: 180,
  height: 36,
  component: AlgoNode,
  ports: {
    groups: {
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#C2C8D5',
            strokeWidth: 1,
            fill: '#fff',
          },
        },

      },
      out: {
        position: 'right',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#C2C8D5',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#C2C8D5',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
    },
  },
},
)

Graph.registerEdge(
  'dag-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#C2C8D5',
        strokeWidth: 1,
        targetMarker: null,
      },
    },
  },
  true,
)

Graph.registerConnector(
  'algo-connector',
  (s, e) => {
    const offset = 8
    const deltaX = Math.abs(e.x - s.x)
    const control = Math.floor((deltaX / 3) * 2)

    const v1 = { x: s.x + offset + control, y: s.y }
    const v2 = { x: e.x - offset - control, y: e.y }

    return Path.normalize(
      `M ${s.x} ${s.y}
       L ${s.x + offset} ${s.y}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x - offset} ${e.y}
       L ${e.x} ${e.y}
      `,
    )
  },
  true,
)
export const PipeEditor = memo(() => {
  const [, token] = useToken()
  const [graph, setGraph] = useState<Graph>()
  const canvasRef = useRef<HTMLDivElement>(null)

  useAddNodes(graph)


  useEffect(() => {
    // 画布
    const graph: Graph = new Graph({
      container: canvasRef.current!,
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'mouseWheel'],
      },
      mousewheel: {
        enabled: true,
        modifiers: 'ctrl',
        factor: 1.1,
        maxScale: 1.5,
        minScale: 0.5,
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4,
            },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: 'algo-connector',
        connectionPoint: 'anchor',
        anchor: 'center',
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'top'
        },
        createEdge() {
          return graph.createEdge({
            shape: 'dag-edge',
            attrs: {
              line: {
                strokeDasharray: '5 5',
              },
            },
            zIndex: -1,
          })
        },
      },
    })

    graph.use(new Selection({
      enabled: true,
      multiple: true,
      rubberEdge: true,
      rubberNode: true,
      modifiers: 'shift',
      rubberband: true,
    }))
    setGraph(graph)

    return () => {
      graph.dispose()
    }
  }, [])

  return (
    <SytledContent style={{ borderColor: token.colorBorder }}>
      <LeftArea style={{ borderColor: token.colorBorder }}>
        <p>
          方法
        </p>
      </LeftArea>
      <CenterArea>
        <Toolbar style={{ borderColor: token.colorBorder }}>
          <Space>
            <Button shape="circle" type="text" icon={undoIcon}></Button>
            <Button shape="circle" disabled type="text" icon={redoIcon}></Button>
          </Space>
        </Toolbar>
        <CanvasContainer ref={canvasRef} style={{ backgroundColor: token.colorBgContainer }} >

        </CanvasContainer>
      </CenterArea>
      <PropertyBox style={{ borderColor: token.colorBorder }}>
        right
      </PropertyBox>
    </SytledContent>
  )
})