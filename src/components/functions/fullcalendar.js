import axios, { Axios } from 'axios'


    export const createEvent = async(values) => 
            await axios.post(import.meta.env.VITE_URL_API + '/event' ,values)

            export const listEvent = async(values) => 
            await axios.get(import.meta.env.VITE_URL_API + '/event')