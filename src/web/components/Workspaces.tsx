import WorkspaceList from './WorkspaceList'
import '../style/Workspaces.css'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ReadMe from './ReadMe'
import WorkSpace from './Workspace'
import BuildShipment from './BuildShipments'

function Workspaces() {
  const navigate = useNavigate()

  return (
    <>
      <div className="Workspaces__header" onClick={() => navigate('/')}>
        Dosspace
      </div>
      <div className="Workspaces__content">
        <Routes>
          <Route path="/workspace/:id/build/:buildId" element={<BuildShipment />} />
          <Route path="/workspace/:id" element={<WorkSpace />} />
          <Route path="/readme" element={<ReadMe />} />
          <Route path="*" element={<WorkspaceList />} />
        </Routes>
      </div>
    </>
  )
}

export default Workspaces
