import { Chart } from './chart';

export const CHARTS: Chart[] = [
    {
        chartid: 1,
        name: 'Line Chart',
        type: 'line',
        view: [600, 600],
    },
    {
        chartid: 2,
        name: 'Radar Chart',
        type: 'radar',
        view: [400, 400],
    },
    {
        chartid: 3,
        name: 'Guage Chart',
        type: 'guage',
        view: [400, 400],
    },
    {
        chartid: 4,
        name: 'Map',
        type: 'map',
        view: [400, 400],
    },

];
