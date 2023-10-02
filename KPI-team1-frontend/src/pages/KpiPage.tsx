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
        test
      </ModalRightSide>

      <div className='flex justify-center mt-12'>
        <div className='w-11/12 md:w-3/4 lg:w-2/3 xl:w-800'>
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
                d='M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7'
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
