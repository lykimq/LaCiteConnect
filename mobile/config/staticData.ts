// Static data configuration
// This file provides constants for the app to use static data
// instead of making backend API calls

// App information
export const APP_INFO = {
    name: 'La Cité Connect',
    version: '1.0.0',
    description: 'Connect with La Cité Church in Paris'
};

// Static data URLs for external resources
export const STATIC_URLS = {
    youtube: 'https://www.youtube.com/embed/SmPZrx7W1Eo',
    location: 'https://maps.google.com/?q=24+Rue+Antoine-Julien+Hénard+75012+Paris',
    website: 'https://www.egliselacite.com',
    subscribe: 'https://egliselacite.us15.list-manage.com/subscribe?u=b7c8a90c7c939a0dbcc276d14&id=03e223e5ce',
    volunteer: 'https://www.egliselacite.com/about-1-1',
    prayerRequest: 'https://docs.google.com/forms/d/e/1FAIpQLSfWI6SAJJI3CCqc1Fb3coe-fQoFPdUdmvbSPuMWLU5y3A7_Vw/viewform',
    chezNous: 'https://www.egliselacite.com/chez-nous-enquiry',
    chezNousDetails: 'https://www.egliselacite.com/chez-nous',
    statements: 'https://www.egliselacite.com/_files/ugd/40e9ff_1b54e943b1e8425794c30475cfbe1de3.pdf',
    donate: {
        mission: 'https://www.helloasso.com/associations/la-cite-eglise-chretienne-de-paris/formulaires/3',
        building: 'https://www.helloasso.com/associations/la-cite-eglise-chretienne-de-paris/formulaires/1'
    }
};

// Static events data
export const STATIC_EVENTS = [
    {
        id: '1',
        summary: 'Sunday Service',
        description: 'Regular Sunday worship service. Everyone is welcome!',
        start: {
            dateTime: '2023-11-05T10:30:00+01:00',
        },
        end: {
            dateTime: '2023-11-05T12:00:00+01:00',
        },
        location: '24 Rue Antoine-Julien Hénard, 75012 Paris',
    },
    {
        id: '2',
        summary: 'Chez Nous Group - Central Paris',
        description: 'Weekly small group meeting for Bible study and fellowship.',
        start: {
            dateTime: '2023-11-08T19:00:00+01:00',
        },
        end: {
            dateTime: '2023-11-08T21:00:00+01:00',
        },
        location: '15 Avenue des Gobelins, 75005 Paris',
    },
    {
        id: '3',
        summary: 'Prayer Meeting',
        description: 'Join us for a time of prayer for our church, city, and world.',
        start: {
            dateTime: '2023-11-10T19:00:00+01:00',
        },
        end: {
            dateTime: '2023-11-10T20:30:00+01:00',
        },
        location: '24 Rue Antoine-Julien Hénard, 75012 Paris',
    },
    {
        id: '4',
        summary: 'Youth Event',
        description: 'Special event for teenagers and young adults.',
        start: {
            dateTime: '2023-11-17T18:00:00+01:00',
        },
        end: {
            dateTime: '2023-11-17T21:00:00+01:00',
        },
        location: '24 Rue Antoine-Julien Hénard, 75012 Paris',
    },
    {
        id: '5',
        summary: 'Christmas Special Service',
        description: 'Special Christmas celebration with music, drama, and a message of hope.',
        start: {
            dateTime: '2023-12-24T18:00:00+01:00',
        },
        end: {
            dateTime: '2023-12-24T19:30:00+01:00',
        },
        location: '24 Rue Antoine-Julien Hénard, 75012 Paris',
    }
];

// Bank details for donations
export const BANK_DETAILS = {
    missionFund: {
        accountName: 'La Cité Eglise Chrétienne',
        iban: 'FR76 3000 3032 9100 0372 7230 583',
        bic: 'SOGEFRPP',
        description: 'Religious association 1905 - authorized to issue tax receipts'
    },
    buildingFund: {
        accountName: 'La Cité Eglise Chrétienne',
        iban: 'FR76 3000 3032 9100 0372 7264 436',
        bic: 'SOGEFRPP',
        description: 'For our permanent place project'
    },
    lesMainsTendues: {
        accountName: 'Les Mains Tendues De La Cité',
        iban: 'FR76 3000 3032 9100 0372 7277 628',
        bic: 'SOGEFRPP',
        description: 'Association 1901 - NOT authorized to issue tax receipts. For caring for the poor and other biblical activities'
    }
};

// Helper function to log app information
export const logAppInfo = () => {
    console.log('App Name:', APP_INFO.name);
    console.log('App Version:', APP_INFO.version);
    console.log('App Description:', APP_INFO.description);
};