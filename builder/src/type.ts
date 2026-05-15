import {type Data} from "@puckeditor/core";

export interface User {
    id: string;
    email: string;
}

export interface Sites {
    id: string;
    name: string;
    slug: string;
}

export interface Site {
    id: string;
    name: string;
    slug: string;
}

export interface Pages {
    id: string;
    title: string;
    path: string;
}

export interface Page {
    id: string;
    title: string;
    path: string;
    content: Data;
}