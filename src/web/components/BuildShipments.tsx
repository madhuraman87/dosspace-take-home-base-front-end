import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../style/WorkspaceList.css'
import '../style/BuildShipments.css'
import DosspaceApi from '../api'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { VscArrowLeft } from 'react-icons/vsc'
import { ShipmentTable, Workspace } from '../../api/types'
import { GridApi, GridReadyEvent, RowEditingStoppedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { v4 as uuidv4 } from 'uuid'
import InlineEdit from './InlineEdit'

/** Homepage of Build that displays all shipments */
export default function BuildShipment() {
  const { id, buildId } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const [workspace, setWorkspace] = useState<Workspace>(state?.workspace)
  const [build, setBuild] = useState<ShipmentTable>(state?.build)
  const [gridApi, setGridApi] = useState<GridApi>()
  const [inputRow, setInputRow] = useState({
    id: uuidv4(),
    description: '',
    orderNumber: '',
    cost: 0,
  })
  const [titleValue, setTitleValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Fetch single workspace from the API
  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await DosspaceApi.getWorkspace({ id })
      setWorkspace(workspace)
      let build = workspace.buildShipments.find((build: ShipmentTable) => build.id === buildId)
      setBuild(build)
      setTitleValue(build?.buildNumber)
    }

    fetchWorkspace()
  }, [id, buildId])

  const buildShipmentRowData: Record<string, []> | undefined = useMemo(() => {
    let dataMap = workspace?.buildShipments.reduce(
      (obj, s) => ({ ...obj, [s.id]: s.shipments }),
      {}
    )
    return dataMap
  }, [workspace])

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      editable: true,
    }
  }, [])

  // Column Definition for each column.
  const columnDefs = [
    { field: 'orderNumber' },
    { field: 'description' },
    {
      field: 'cost',
      headerName: 'Cost',
      valueGetter: (params: any) => {
        return params?.data?.cost
      },
      valueSetter: (params: any) => {
        var newValInt = parseInt(params.newValue)
        var valueChanged = params.data.cost !== newValInt
        if (valueChanged) {
          params.data.cost = newValInt
        }
        return valueChanged
      },
    },
  ]

  const getRowData = ({ id }: { id: string }) => {
    return buildShipmentRowData?.[id]
  }

  const onRowEditingStopped = useCallback(
    async (event: RowEditingStoppedEvent) => {
      let shipIndex = build?.shipments?.findIndex((ship) => ship.id === event.data.id)
      if (shipIndex !== -1) {
        console.log('existing row', workspace)
        const updatedWorkSpace = await DosspaceApi.updateWorkspace({ id, workspace })
        setWorkspace(updatedWorkSpace)
      } else {
        let newShipmentRecord = event.data
        let updateShipments = build?.shipments?.concat(newShipmentRecord)
        build && Object.assign(build.shipments, updateShipments)
        setBuild(build)
        console.log('new row', workspace)
        const updatedWorkSpace = await DosspaceApi.updateWorkspace({
          id,
          workspace,
        })
        setWorkspace(updatedWorkSpace)
      }
      setInputRow({
        id: uuidv4(),
        description: '',
        orderNumber: '',
        cost: 0,
      })
    },
    [id, build, workspace]
  )

  async function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value.trim() === '') {
      setTitleValue(titleValue)
    } else {
      setTitleValue(event.target.value)
    }
    if (titleValue !== event.target.value) {
      let updatedBuild = build && Object.assign(build, { buildNumber: event.target.value })
      setBuild(updatedBuild)
      const updatedWorkSpace = await DosspaceApi.updateWorkspace({ id, workspace })
      setWorkspace(updatedWorkSpace)
    }
  }

  return (
    <div className="WorkspaceList">
      <div
        className="WorkspaceList__iconButton"
        onClick={() => navigate(`/workspace/${workspace?.id}`)}
      >
        <VscArrowLeft style={{ marginRight: '5px' }} />
        <div>Back</div>
      </div>
      <div className="BuildShipment__header">
        <div style={{ marginRight: '10px' }}>Build Number: #</div>
        <InlineEdit text={titleValue} placeholder="Workspace name" type="input" childRef={inputRef}>
          <input
            ref={inputRef}
            type="text"
            name="title"
            placeholder="Build Number"
            value={titleValue}
            onChange={(e) => handleTitleChange(e)}
          />
        </InlineEdit>
      </div>
      <div className="WorkspaceList__workspaceCard">
        <button onClick={() => gridApi?.applyTransaction({ add: [inputRow] })}>Add a row</button>
        <div key={buildId} className="UpperWrapper">
          <div className="TableWrapper ag-theme-alpine">
            <AgGridReact
              onGridReady={(grid: GridReadyEvent) => {
                setGridApi(grid.api)
              }}
              rowHeight={40}
              headerHeight={40}
              groupHeaderHeight={50}
              defaultColDef={defaultColDef}
              rowData={getRowData({ id: buildId as string })} // Row Data for Rows
              columnDefs={columnDefs} // Column Defs for Columns
              editType={'fullRow'}
              onRowEditingStopped={onRowEditingStopped}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
