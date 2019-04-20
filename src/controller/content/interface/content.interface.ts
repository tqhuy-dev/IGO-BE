export interface Content {
    username: string;
    content: string;
    location: {
        name: string,
        country: string,
        checkin: []
    },
    tag:[],
    reaction:{
        like: number,
        love: number,
    },
    comments:[],
    rate: number,
    travel: [],
    type: string,
    range: {
        from: string,
        to: string
    },
    total_price: number,
    hotel: [],
    metadata: any,
    images: []
}