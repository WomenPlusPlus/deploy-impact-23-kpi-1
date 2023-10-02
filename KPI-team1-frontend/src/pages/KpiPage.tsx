import { useState } from 'react'
import ModalRightSide from '../components/ModalRightSide'

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
        <div>Values History</div>
        <div className='bg-gray-100 p-4'>
          <div className='text-neutral-900 text-2xl '>
            Set a new value for involuntary headcount change
          </div>
          <div className='flex justify-between my-2'>
            <label className='text-neutral-900 font-medium w-full mr-2'>
              Due date
              <input
                className='block w-full rounded-md'
                name='due date'
                type='date'
              />
            </label>
            <label className='text-neutral-900 font-medium w-full'>
              Enter a new value
              <input
                className='block w-full rounded-md'
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
              className='block w-full font-normal text-neutral-400 rounded-md border-neutral-400'
              name='target date'
              type='date'
            />
          </label>
          <label className='text-neutral-900 font-medium w-full'>
            Enter the target value
            <input
              className='block w-full font-normal text-neutral-400 rounded-md border-neutral-400'
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
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2.1'
                d='m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1'
              />
            </svg>
            <div className="text-violet-800 text-xl font-medium font-['Inter']">
              Monthly KPIs
            </div>
          </div>
          <table className='border-collapse table-auto w-full text-sm '>
            <thead>
              <tr className='bg-gray-100 border rounded-tl-lg border-b-neutral-300 [&>*]:text-transform: uppercase'>
                <th className='border-r border-neutral-300 w-80 h-14 text-center font-medium '>
                  KPI Name
                </th>
                <th className='border-r border-neutral-300 w-80 h-14 text-center font-medium'>
                  Target
                </th>
                <th className='border-r border-neutral-300 w-80 h-14 text-center font-medium'>
                  Latest Value
                </th>
                <th className='border-r border-neutral-300 w-80 h-14 text-center font-medium '>
                  Next Due Date
                </th>
                <th className='w-80 h-14 text-center font-medium'>
                  Description
                </th>
              </tr>
            </thead>
            <tbody className='bg-white [&>*]:border-b [&>*]:dark:border-neutral-300'>
              <tr className='[&>*]:border-r [&>*]:dark:border-neutral-300 [&>*:first-child]:text-transform: capitalize [&>*:last-child]:border-none [&>*]:p-4 [&>*]:text-center [&>*:first-child]:text-left'>
                <td>
                  share of teams constituted as circles
                  <button
                    type='button'
                    className='ml-4 text-gray-800 dark:text-white'
                    onClick={e =>
                      handleClick((e.target as HTMLElement).textContent || '')
                    }
                  >
                    test
                  </button>
                </td>
                <td>80%</td>
                <td>35%</td>
                <td>Aug 2023</td>
                <td>to define</td>
              </tr>
              <tr className='[&>*]:border-r [&>*]:dark:border-neutral-300 [&>*:first-child]:text-transform: capitalize [&>*:last-child]:border-none [&>*]:p-4 [&>*]:text-center [&>*:first-child]:text-left'>
                <td>count sessions on .projuventute.ch</td>
                <td>100'000</td>
                <td>158611</td>
                <td>Aug 2023</td>
                <td>to define</td>
              </tr>
              <tr className='[&>*]:border-r [&>*]:dark:border-neutral-300 [&>*:first-child]:text-transform: capitalize [&>*:last-child]:border-none [&>*]:p-4 [&>*]:text-center [&>*:first-child]:text-left'>
                <td>private donations</td>
                <td>100'000</td>
                <td>1369218</td>
                <td>Aug 2023</td>
                <td>to define</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
