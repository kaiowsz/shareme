export interface ImageAsset {
    extension: string;
    url: string;
    _id: string;
    size: number | string;
}

export interface PinProps {
    pin: PinType;
    className: string;
}

export type User = {
    image: string;
    username: string;
    _createdAt?: string;
    _id: string;
}
  
export type PostedBy = {
    image: string;
    username: string;
    _id: string;
}
  
export interface PinDetails {
    about: string;
    category: string;
    comments?: Comment[];
    destination: string;
    image: {
        asset: {
        url: string;
        }
    };
    postedBy: PostedBy;
    title: string;
    _id: string;
}

export interface Comment {
    comment: string;
    postedBy: PostedBy;
    _key: string;
}

export type PinType = {
    destination: string;
    image: {
        asset: {
        url: string;
        }
    };
    postedBy: PostedBy;
    save: any;
    _id: string;
}