export interface Content {
    user_data: {
        username: string,
        name: string,
        avatar: string
    };
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
        comments: number,
        share: number
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
    images: [],
    createAt: string
}