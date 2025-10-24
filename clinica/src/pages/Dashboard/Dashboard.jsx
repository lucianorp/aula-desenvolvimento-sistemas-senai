import React from 'react'
import PatientsCounter from '../../components/counters/PatientsCounter'
import ConsultsCounter from '../../components/counters/ConsultsCounter'
import ExamsCounter from '../../components/counters/ExamsCounter'

const Dashboard = () => {
    return (
        <>
            <h2 className='text-xl font-semibold mb-4'>Estatísticas do Sistema</h2>
            <div className='flex gap-6'>
                <PatientsCounter />
                <ConsultsCounter />
                <ExamsCounter />
            </div>
        </>
    )
}

export default Dashboard