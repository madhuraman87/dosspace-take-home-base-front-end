import { useEffect, useState } from 'react'
import '../style/WorkspaceList.css'
import DosspaceApi from '../api'
import { useNavigate } from 'react-router-dom'
import { VscChevronRight } from 'react-icons/vsc'

interface HomepageWorkspace {
  id: string
  title: string
}

/** Homepage list of all workspaces that have been created */
export default function WorkspaceList() {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState<HomepageWorkspace[]>([])
  const [workSpaceTitle, setWorkSpaceTitle] = useState<string>('')
  const [toggleInput, setToggleInput] = useState<boolean>(false)
  const [disableAddButton, setDisableAddButton] = useState<boolean>(false)

  // Fetch all workspaces from the API
  useEffect(() => {
    async function fetchWorkspaces() {
      const workspaces = await DosspaceApi.getWorkspaces()
      setWorkspaces(workspaces)
    }

    fetchWorkspaces()
  }, [])

  async function itemHandler() {
    setDisableAddButton(true)
    const workspace = await DosspaceApi.createWorkspace({ title: workSpaceTitle })
    const updatedWorkSpaceList = workspaces.concat(workspace)
    setWorkspaces(updatedWorkSpaceList)
    setWorkSpaceTitle('')
    setToggleInput(!toggleInput)
  }

  return (
    <div className="WorkspaceList">
      <div className="WorkspaceList__headerbox">
        <h1 data-testid="workspace-header" className="WorkspaceList__header">
          All workspaces
        </h1>
        <button
          data-testid="create-workspace-button"
          className="WorkspaceList__createButton"
          onClick={() => setToggleInput(!toggleInput)}
        >
          Create Workspace
        </button>
      </div>

      {workspaces?.map((workspace) => (
        <div
          key={workspace.id}
          data-testid="workspace-card"
          className="WorkspaceList__workspaceCard"
        >
          <div className="WorkspaceList__buildNumberPanel">
            {workspace.title}
            <div
              className="WorkspaceList__iconButton"
              onClick={() => navigate(`/workspace/${workspace.id}`)}
            >
              <VscChevronRight style={{ marginRight: '5px' }} />
            </div>
          </div>
        </div>
      ))}
      {toggleInput && (
        <div className="WorkspaceList__createWorkSpace">
          <input
            data-testid="create-workspace-input"
            type="text"
            onChange={(e) => setWorkSpaceTitle(e.target.value)}
          />
          <button
            className="WorkspaceList__button"
            disabled={disableAddButton}
            onClick={() => itemHandler()}
          >
            Add
          </button>
          <button className="WorkspaceList__button" onClick={() => setToggleInput(!toggleInput)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
