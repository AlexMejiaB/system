import axios from 'axios'

const CLICKUP_API_URL = 'https://api.clickup.com/api/v2'
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN as string

export interface ClickUpTask {
    id: string
    name: string
    status: { status: string }
}

export const getTicket = async (taskId: string) => {
    return axios.get<ClickUpTask>(`${CLICKUP_API_URL}/task/${taskId}`,{ headers: { Authorization: CLICKUP_API_TOKEN }})
}

export const updateTaskStatus = async (taskId: string, status: string) => {
    return axios.put(`${CLICKUP_API_URL}/task/${taskId}`, { status }, {headers: { Authorization: CLICKUP_API_TOKEN}})
}

export const createWebHook = async ( 
    teamId: string,
    endpoint: string,
    events: string[]
) => {
    return axios.post(`${CLICKUP_API_URL}/team/${teamId}/webhook`, 
        {endpoint, events}, {
            headers: { 
                Authorization: CLICKUP_API_TOKEN 
            } })
}
