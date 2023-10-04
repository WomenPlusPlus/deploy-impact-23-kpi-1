import { useState } from 'react'
import ModalRightSide from '../components/ModalRightSide'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

const HEADER_KPI_COLUMNS: GridColDef[] = [
  {
    headerName: 'KPI Name',
    field: 'kpi_name',
    width: 300,
    sortable: true,
    hideable: false
  },
  {
    headerName: 'Target',
    field: 'kpi_target',
    width: 150,
    sortable: false
  },
  {
    headerName: 'Latest Value',
    field: 'kpi_latest_value',
    width: 150,
    sortable: true
  },
  {
    headerName: 'Next Due Date',
    field: 'kpi_next_due_date',
    width: 150,
    sortable: true
  },
  {
    headerName: 'Description',
    field: 'description',
    width: 150,
    sortable: false,
    filterable: false
  }
]
const data: GridRowsProp = [
  {
    id: 1,
    kpi_name: 'share of teams constituted as circles',
    kpi_target: '80%',
    kpi_latest_value: '35%',
    kpi_next_due_date: 'Aug 2023',
    description: 'to define'
  },
  {
    id: 2,
    kpi_name: 'count sessions on .projuventute.ch',
    kpi_target: '100000',
    kpi_latest_value: '158611',
    kpi_next_due_date: 'Aug 2023',
    description: 'to define'
  },
  {
    id: 3,
    kpi_name: 'private donations',
    kpi_target: '100000',
    kpi_latest_value: '1369218',
    kpi_next_due_date: 'Aug 2023',
    description: 'to define'
  }
]
const COLUMN_WIDTH = 600

export default function KpiPage(): JSX.Element {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedKpi, setSelectedKpi] = useState('')
  const handleOpenModal = () => {
    setModalIsOpen(!modalIsOpen)
  }

  const handleClick = (kpi: string) => {
    setSelectedKpi(kpi)
    handleOpenModal()
  }

  return (
    <>
      <ModalRightSide isOpen={modalIsOpen} onRequestClose={handleOpenModal}>
        <div className='text-center text-neutral-900 text-3xl font-light'>
          Share Of Teams Constituted As Circles
        </div>
        <div className='mt-4 text-neutral-900 text-2xl'>Values History</div>
        <div className='bg-gray-100 p-4'>
          <div className='text-neutral-900 text-2xl '>
            Set a new value for involuntary headcount change
          </div>
          <div className='flex justify-between my-2'>
            <label className='text-neutral-900 font-medium w-full mr-2'>
              Due date
              <input
                className='block w-full p-2 border rounded-md'
                name='due date'
                type='date'
              />
            </label>
            <label className='text-neutral-900 font-medium w-full'>
              Enter a new value
              <input
                className='block w-full p-2 border rounded-md'
                name='new value'
                type='number'
              />
            </label>
          </div>
          <div className='pt-4 flex justify-end'>
            <button className='w-28 h-10 mr-4 bg-white rounded border border-amber-400 justify-center items-center gap-2 inline-flex text-zinc-700 text-base font-medium'>
              Cancel
            </button>
            <button className='w-28 h-10  bg-amber-400 rounded justify-center items-center gap-2 inline-flex text-neutral-900 text-base font-medium'>
              Save
            </button>
          </div>
        </div>

        <div className='mt-4 text-neutral-900 text-2xl'>Previous Values</div>
        <div className='mt-4 text-neutral-900 text-2xl'>
          Set a target value for this year
        </div>
        <div className='flex justify-between my-2'>
          <label className='text-neutral-900 font-medium w-full mr-2'>
            Set a date
            <input
              className='block w-full font-normal text-neutral-400 p-2 border rounded-md border-neutral-400'
              name='target date'
              type='date'
            />
          </label>
          <label className='text-neutral-900 font-medium w-full'>
            Enter the target value
            <input
              className='block w-full font-normal text-neutral-400 p-2 border rounded-md border-neutral-400'
              name='target value'
              type='number'
              placeholder="What's your target"
            />
          </label>
        </div>
      </ModalRightSide>

      <div className='flex justify-center mt-12'>
        <div className='w-11/12 md:w-3/4 lg:w-2/3 xl:w-800'>
          <div className='text-neutral-900 text-2xl py-4 my-2 border-b border-gray-300'>
            KPIs - Marketing Zürich
          </div>
          <div>
            <svg
              className='w-[17px] h-[17px] text-gray-800 dark:text-white'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 8'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2.1'
                d='m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1'
              />
            </svg>
            <div className="text-violet-800 text-xl font-medium font-['Inter']">
              Monthly KPIs
            </div>
          </div>
          <DataGrid rows={data} columns={HEADER_KPI_COLUMNS} />
        </div>
      </div>
    </>
  )
}
