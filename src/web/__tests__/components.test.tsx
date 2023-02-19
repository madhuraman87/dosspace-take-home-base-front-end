import '@testing-library/jest-dom'
import { act, render, screen, within } from '@testing-library/react'
import WorkspaceList from '../components/WorkspaceList'
import DosspaceApi from '../api'
import userEvent from '@testing-library/user-event'
import Workspace from '../components/Workspace'
import BuildShipment from '../components/BuildShipments'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => jest.fn(),
}))

const dummyData = [
  {
    id: 'dd1e69a4-73bf-4535-8751-bf678c765f34',
    title: 'FedEx Ground',
    buildShipments: [
      {
        id: 'eafce64d-d8c5-469a-987c-678dd90d0c38',
        buildNumber: '2288I-6N',
        shipments: [
          {
            id: '7c04e126-41a8-45be-a74e-9f7068210dd9',
            description: '54 units',
            orderNumber: '123-45436-356554',
            cost: 10000,
          },
          {
            id: 'af7d4e19-8afd-46b1-b65c-899adcfb3c9b',
            description: '50 units',
            orderNumber: '123-5435-4352435',
            cost: 8000,
          },
          {
            id: '5df417a3-04b1-442d-919a-c13bdfe9071a',
            description: '74 units',
            orderNumber: '232-23545-23523',
            cost: 194646,
          },
        ],
      },
    ],
  },
  {
    id: '50be3980-2b89-442b-9a61-6feb8bb320ee',
    title: 'TruGreen',
    buildShipments: [
      {
        id: '50fbf746-b31d-4fb5-84ce-d71c3f88b4eb',
        buildNumber: 'R3Z-TYCZXN',
        shipments: [
          {
            id: '9b208147-089e-486e-a319-c376a4bb300a',
            description: '',
            orderNumber: '',
            cost: 0,
          },
        ],
      },
      {
        id: '6f6e20c8-47d3-49eb-b7f3-380c8f7924cd',
        buildNumber: 'K4Y-2FG56',
        shipments: [
          {
            id: 'fcd2fcb7-a01c-4e7b-bb3c-90ce1200aeed',
            description: '54 units of base doors',
            orderNumber: '234-4543-235235',
            cost: 54000,
          },
          {
            id: 'fcd2fcb7-a01c-4e7b-bb3c-90ce1200aeed',
            description: '54 units of base doors',
            orderNumber: '234-4543-235235',
            cost: 54000,
          },
          {
            id: 'fcd2fcb7-a01c-4e7b-bb3c-90ce1200aeed',
            description: '54 units of base doors',
            orderNumber: '234-4543-235235',
            cost: 54000,
          },
        ],
      },
    ],
  },
]

jest.mock('../api')

describe('App', () => {
  beforeEach(() => {
    // assign the mock jest.fn() to static method
    DosspaceApi.getWorkspaces = jest.fn().mockReturnValue(dummyData)
    DosspaceApi.getWorkspace = jest.fn().mockReturnValue(dummyData[0])
  })

  test('loads and displays WorkspaceList', async () => {
    await act(async () => render(<WorkspaceList />))
    expect(screen.getByTestId('workspace-header')).toBeInTheDocument()
    expect(screen.getAllByTestId('workspace-card')).toHaveLength(2)
    expect(DosspaceApi.getWorkspaces).toHaveBeenCalled()
    const contents = screen.getAllByTestId('workspace-card').map((e) => e.textContent)
    expect(contents).toEqual([dummyData[0].title, dummyData[1].title])
  })

  test(`should render input box when 'Create Workspace' is clicked`, async () => {
    // render your component
    await act(async () => render(<WorkspaceList />))
    // access your button
    const button = screen.getByTestId('create-workspace-button')
    // simulate button click
    userEvent.click(button)

    // expect result
    await screen.findByTestId('workspace-header')
  })

  test(`should render build cards`, async () => {
    await act(async () => render(<Workspace />))
    expect(screen.getAllByTestId('build-shipments-card')).toHaveLength(1)
    const ViewBuildCard = screen.queryAllByTestId('build-shipments-card')[0]
    const ViewBuildCardButton = within(ViewBuildCard).getByTestId('view-build-shipments')
    userEvent.click(ViewBuildCardButton)
    expect(DosspaceApi.getWorkspace).toHaveBeenCalled()
  })

  test(`should render table when clicking on build`, async () => {
    await act(async () => render(<BuildShipment />))
    expect(DosspaceApi.getWorkspace).toHaveBeenCalled()
    expect(screen.getAllByTestId('add-new-row')).toHaveLength(1)
    const { getByText } = within(screen.getByTestId('shipment-table'))
    expect(getByText('Order Number')).toBeInTheDocument()
    expect(getByText('Description')).toBeInTheDocument()
    expect(getByText('Cost')).toBeInTheDocument()
  })
})
