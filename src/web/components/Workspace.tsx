import { useEffect, useRef, useState } from 'react'
import '../style/WorkspaceList.css'
import DosspaceApi from '../api'
import { useParams, useNavigate } from 'react-router-dom'
import { VscArrowLeft, VscChevronRight } from 'react-icons/vsc'
import { ShipmentTable } from '../../api/types'
import { v4 as uuidv4 } from 'uuid'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import InlineEdit from './InlineEdit'

interface HomepageWorkspace {
  id: string
  title: string
  buildShipments: ShipmentTable[]
}

/** Homepage of workspace that have been created */
export default function WorkSpace() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [workspace, setWorkspace] = useState<HomepageWorkspace>()
  const [buildNumber, setBuildNumber] = useState<string>('')
  const [toggleInput, setToggleInput] = useState<boolean>(false)
  const [disableAddButton, setDisableAddButton] = useState<boolean>(false)
  const [titleValue, setTitleValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Fetch single workspace from the API
  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await DosspaceApi.getWorkspace({ id })
      setWorkspace(workspace)
      setTitleValue(workspace?.title)
    }

    fetchWorkspace()
  }, [id])

  function createBuild({ buildNumber }: { buildNumber: string }) {
    let build = {
      id: uuidv4(),
      buildNumber,
      // Initialize the workspace with a single empty build shipment
      shipments: [{ id: uuidv4(), description: '', orderNumber: '', cost: 0 }],
    }
    let buildShipments = workspace?.buildShipments?.concat(build)
    return { ...workspace, ...{ buildShipments } }
  }

  async function itemHandler() {
    setDisableAddButton(true)
    let buildShip = createBuild({ buildNumber })
    const updatedWorkSpace = await DosspaceApi.updateWorkspace({ id, workspace: buildShip })
    setWorkspace(updatedWorkSpace)
    setBuildNumber('')
    setToggleInput(!toggleInput)
  }

  async function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value.trim() === '') {
      setTitleValue(titleValue)
    } else {
      setTitleValue(event.target.value)
    }
    let newWorkspace = workspace && Object.assign(workspace, { title: event.target.value })
    const updatedWorkSpace = await DosspaceApi.updateWorkspace({ id, workspace: newWorkspace })
    setWorkspace(updatedWorkSpace)
  }

  return (
    <div className="WorkspaceList">
      <div className="WorkspaceList__iconButton" onClick={() => navigate('/')}>
        <VscArrowLeft style={{ marginRight: '5px' }} />
        <div>Back</div>
      </div>
      <div className="WorkspaceList__headerbox">
        <InlineEdit text={titleValue} placeholder="Workspace name" type="input" childRef={inputRef}>
          <input
            ref={inputRef}
            type="text"
            name="title"
            placeholder="Workspace name"
            value={titleValue}
            onChange={(e) => handleTitleChange(e)}
          />
        </InlineEdit>
        <button
          className="WorkspaceList__createButton"
          onClick={() => setToggleInput(!toggleInput)}
        >
          Create Builds
        </button>
      </div>

      {workspace?.['buildShipments'].map((build) => (
        <div key={build.id} className="WorkspaceList__workspaceCard">
          <div className="WorkspaceList__buildNumberPanel">
            Build Number: #{build.buildNumber}
            <div
              className="WorkspaceList__iconButton"
              onClick={() =>
                navigate(`/workspace/${workspace.id}/build/${build.id}`, {
                  state: { workspace, build },
                })
              }
            >
              <VscChevronRight style={{ marginRight: '5px' }} />
            </div>
          </div>
        </div>
      ))}
      {toggleInput && (
        <div className="WorkspaceList__createWorkSpace">
          <input type="text" onChange={(e) => setBuildNumber(e.target.value)} />
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
