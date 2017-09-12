import { Chart } from './chart';

export const CHARTS: Chart[] = [
    {
        id: 4,
        name: 'Map',
        type: 'map',
        view: [500, 500],
    },
    {
        id: 1,
        name: 'Line Chart',
        type: 'line',
        view: [400, 400],
    },
    {
        id: 2,
        name: 'Radar Chart',
        type: 'radar',
        view: [500, 400],
    },
    {
        id: 3,
        name: 'Guage Chart',
        type: 'guage',
        view: [700, 300],
    }

];
