import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

/** The API for the app, for querying, creating and updating workspaces */
class DosspaceApi {
  /** Returns the ID and title of every existing workspace */
  static async getWorkspaces() {
    try {
      const req = await axios.get(BASE_URL)
      const { workspaces } = req.data
      return workspaces
    } catch (err) {
      throw new Error('Unable to fetch workspaces')
    }
  }

  /** Returns the workspace info */
  static async getWorkspace({ id }: { id: string | undefined }) {
    try {
      const req = await axios.get(`${BASE_URL}/${id}`)
      const { workspace } = req.data
      return workspace
    } catch (err) {
      throw new Error('Unable to fetch workspace')
    }
  }

  /** Creates a new workspace */
  static async createWorkspace({ title }: { title: string }) {
    try {
      const req = await axios.post(BASE_URL, {
        title,
      })
      const { workspace } = req.data
      return workspace
    } catch (err) {
      throw new Error('Unable to create workspace')
    }
  }

  /** Updates a existing workspace */
  static async updateWorkspace({ id, workspace }: { id: string | undefined; workspace: any }) {
    try {
      const req = await axios.post(`${BASE_URL}/${id}`, {
        workspace,
      })
      const { workspace: updatedWorkspace } = req.data
      return updatedWorkspace
    } catch (err) {
      throw new Error('Unable to create workspace')
    }
  }
}

export default DosspaceApi
