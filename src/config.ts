import AppConfig from './types/AppConfig';


const conf: AppConfig = {
    botToken: process.env.BOT_TOKEN as any,
    channels: [
        {
            name: 'test',
            dispname: 'Тестовый канал',
            id: '',
        },
    ]
}

export default conf;
