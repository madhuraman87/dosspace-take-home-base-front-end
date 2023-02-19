import { all, findOne, insert, update } from './db/db'
import { Workspace } from './types'
import { v4 as uuidv4 } from 'uuid'

/** Returns a list of all workspaces in the database */
export function getWorkspaces(dbString: string): Workspace[] {
  return all(dbString, 'workspaces')
}

/** Returns a single workspace from the database */
export function getWorkspace(dbString: string, id: string): Workspace {
  return findOne(dbString, 'workspaces', id)
}

function buildNumber(): string {
  let num = Math.random().toString(36).slice(4).toUpperCase()
  return num.replace(num.charAt(5), '-')
}

/** Create a workspace in the database */
export function createWorkspace(dbString: string, title: string): Workspace {
  const workspace: Workspace = {
    id: uuidv4(),
    title: title,
    buildShipments: [
      {
        id: uuidv4(),
        buildNumber: buildNumber(),
        // Initialize the workspace with a single empty build shipment
        shipments: [{ id: uuidv4(), description: '', orderNumber: '', cost: 0 }],
      },
    ],
  }
  insert(dbString, 'workspaces', workspace)
  return workspace
}

/** Update a workspace in the database */
export function updateWorkspace(dbString: string, workspace: Workspace): Workspace {
  update(dbString, 'workspaces', workspace.id, workspace)
  return findOne(dbString, 'workspaces', workspace.id)
}
