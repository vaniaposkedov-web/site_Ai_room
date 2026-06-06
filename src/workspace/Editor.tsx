import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import FlowNode from './FlowNode'
import FlowEdge from './FlowEdge'
import { useFlow } from './store'

const nodeTypes = { flow: FlowNode }
const edgeTypes = { flow: FlowEdge }

export default function Editor() {
  const nodes = useFlow((s) => s.nodes)
  const edges = useFlow((s) => s.edges)
  const onNodesChange = useFlow((s) => s.onNodesChange)
  const onEdgesChange = useFlow((s) => s.onEdgesChange)
  const onConnect = useFlow((s) => s.onConnect)
  const isValidConnection = useFlow((s) => s.isValidConnection)
  const addNode = useFlow((s) => s.addNode)
  const setSelected = useFlow((s) => s.setSelected)
  const { screenToFlowPosition } = useReactFlow()

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('application/airoom-node')
      if (!type) return
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
      addNode(type, { x: position.x - 105, y: position.y - 40 })
    },
    [addNode, screenToFlowPosition],
  )

  const onNodeClick: NodeMouseHandler = useCallback((_e, node) => setSelected(node.id), [setSelected])

  return (
    <div
      className="flex-1 relative h-full"
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelected(null)}
        defaultEdgeOptions={{ type: 'flow' }}
        connectionRadius={42}
        colorMode="dark"
        fitView
        proOptions={{ hideAttribution: true }}
        minZoom={0.3}
        maxZoom={1.6}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="#333" />
        <Controls showInteractive={false} />
        <MiniMap pannable zoomable nodeColor="#FFE135" maskColor="rgba(0,0,0,0.6)" style={{ background: '#161616' }} />
      </ReactFlow>
    </div>
  )
}
